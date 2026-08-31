/**
 * The single source of truth for the library's design tokens.
 *
 * `tailwind-preset.js` builds its theme from this file and injects the variable
 * declarations via `addBase`; `scripts/generate-tokens-css.js` generates
 * `src/index.css` from it as a readable reference. Nothing else may hard-code a
 * default — that is how the preset and the stylesheet drifted apart before.
 *
 * ## One token per role
 *
 * A token carries **both** values: `light` and, when it differs, `dark`. The
 * dark value is published under a `.dark` selector, so a component writes the
 * role once:
 *
 *     bg-card            ✅ resolves per theme
 *     bg-card dark:bg-card-dark   ❌ the old scheme, two classes for one role
 *
 * That removes the failure mode where a component forgets the second class, and
 * — more importantly — it stops five different files from each deciding what
 * "secondary text in dark mode" means.
 *
 * A value is either a literal CSS colour or `{ alias: "other-token" }`. Aliases
 * stay aliases in the generated CSS, so overriding a base token cascades; and
 * because the alias resolves through the custom property, an alias set once
 * follows the aliased token into dark mode by itself.
 *
 * `format: "rgb"` marks a space-separated RGB triple. Tailwind needs those raw
 * so it can inject `<alpha-value>` for opacity utilities like `bg-primary/20`.
 */

/** @typedef {string | { alias: string }} TokenValue */
/** @typedef {{ name: string, light: TokenValue, dark?: TokenValue, format?: "rgb", comment?: string }} Token */

/** @type {{ title: string, tokens: Token[] }[]} */
const GROUPS = [
    {
        title: "Brand",
        tokens: [
            // Deliberately identical in both themes: the brand colour is the one
            // thing a viewer should recognise regardless of the surface.
            { name: "primary", light: "229 77 13", format: "rgb", comment: "#e54d0d" },
            { name: "primary-hover", light: "255 95 31", format: "rgb", comment: "#ff5f1f" },
        ],
    },
    {
        title: "Semantic State Colors",
        tokens: [
            { name: "error", light: "#dc2626", dark: "#f87171" },
            { name: "error-hover", light: "#b91c1c" },
            { name: "error-bg", light: "#fef2f2", dark: "rgba(127, 29, 29, 0.3)" },

            { name: "success", light: "#16a34a", dark: "#4ade80" },
            { name: "success-hover", light: "#15803d" },

            { name: "warning", light: "#ea580c", dark: "#fb923c" },
            { name: "warning-hover", light: "#c2410c" },
            { name: "warning-bg", light: "#ffedd5", dark: "rgba(124, 45, 18, 0.3)" },

            { name: "info", light: "#2563eb", dark: "#60a5fa" },
            // The dark value is the former `info-light`, which existed only
            // because FileBrowser needed a lighter hover on a dark surface.
            { name: "info-hover", light: "#1d4ed8", dark: "#93c5fd" },

            { name: "accent", light: "#4f46e5", dark: "#818cf8" },
            { name: "accent-hover", light: "#4338ca" },
            { name: "accent-bg", light: "#eef2ff", dark: "rgba(49, 46, 129, 0.3)" },
        ],
    },
    {
        title: "Surfaces & Backgrounds",
        tokens: [
            { name: "bg-app", light: "#f9fafb", dark: "#111111", comment: "page / layout background" },
            { name: "bg-card", light: "#ffffff", dark: "#141414", comment: "panels, dropdowns, modal sheets" },
            { name: "bg-card-header", light: "#f3f4f6", dark: "#181818" },
            { name: "overlay", light: "rgba(0, 0, 0, 0.6)", comment: "scrim behind modals" },
        ],
    },
    {
        title: "Typography",
        tokens: [
            { name: "text-primary", light: "#111827", dark: "#f9fafb" },
            { name: "text-secondary", light: "#4b5563", dark: "#d1d5db" },
            { name: "text-muted", light: "#808080", dark: "#808080" },
        ],
    },
    {
        title: "Borders & Interactive States",
        tokens: [
            { name: "border", light: "#e2e8f0", dark: "#2a2a2a" },
            { name: "hover", light: "#f3f4f6", dark: "#252525" },
        ],
    },
    {
        title: "Component: Button",
        tokens: [
            { name: "button-primary-text", light: "#ffffff" },
            { name: "button-secondary-bg", light: "#e5e7eb", dark: "#333333" },
            { name: "button-secondary-hover-bg", light: "#d1d5db", dark: "#444444" },
            // A solid red button with white text reads on either surface, so
            // unlike `error` this one does not lighten in dark mode.
            { name: "button-danger-bg", light: "#dc2626" },
            { name: "button-danger-hover-bg", light: "#b91c1c" },
        ],
    },
    {
        title: "Component: Badge",
        tokens: [
            { name: "badge-success-bg", light: "#dcfce7", dark: "rgba(20, 83, 45, 0.3)" },
            { name: "badge-success-text", light: "#15803d", dark: "#4ade80" },

            { name: "badge-warning-bg", light: "#ffedd5", dark: "rgba(124, 45, 18, 0.3)" },
            { name: "badge-warning-text", light: "#c2410c", dark: "#fb923c" },

            { name: "badge-error-bg", light: "#fef2f2", dark: "rgba(127, 29, 29, 0.3)" },
            { name: "badge-error-text", light: "#b91c1c", dark: "#f87171" },

            { name: "badge-info-bg", light: "#dbeafe", dark: "rgba(30, 58, 138, 0.3)" },
            { name: "badge-info-text", light: "#1d4ed8", dark: "#60a5fa" },

            { name: "badge-neutral-bg", light: { alias: "hover" } },
            { name: "badge-neutral-text", light: { alias: "text-secondary" } },
        ],
    },
    {
        title: "Component: Input / Select",
        tokens: [
            { name: "input-bg", light: { alias: "bg-app" } },
            { name: "input-border", light: { alias: "border" } },
        ],
    },
    {
        title: "Component: Sidebar",
        tokens: [
            { name: "sidebar-bg", light: { alias: "bg-app" }, dark: "#1a1a1a" },
            { name: "sidebar-item-active-bg", light: { alias: "bg-card" }, dark: "#252525" },
            { name: "sidebar-badge-active-bg", light: { alias: "hover" }, dark: "#333333" },
            {
                name: "sidebar-badge-inactive-bg",
                light: { alias: "sidebar-badge-active-bg" },
                comment: "aliased so the two states can diverge without code changes",
            },
        ],
    },
    {
        title: "Component: Table",
        tokens: [
            { name: "table-header-bg", light: { alias: "bg-card-header" }, dark: "#202020" },
            { name: "table-header-toggle-bg", light: "#e5e7eb", dark: { alias: "bg-app" } },
            { name: "table-header-toggle-active-bg", light: { alias: "bg-card" }, dark: "#444444" },
            { name: "table-row-bg", light: { alias: "bg-app" }, dark: "#181818" },
            { name: "table-row-hover-bg", light: { alias: "hover" }, dark: "#202020" },
        ],
    },
    {
        title: "Component: StatCard",
        tokens: [
            { name: "statcard-bg", light: { alias: "bg-card-header" }, dark: "#181818" },
            { name: "statcard-icon-bg", light: { alias: "bg-app" }, dark: "#252525" },
        ],
    },
    {
        title: "Component: DashboardHeader",
        tokens: [
            { name: "browser-header-bg", light: { alias: "bg-card" }, dark: "#1e1e1e" },
        ],
    },
];

const ALL = GROUPS.flatMap(g => g.tokens);
const BY_NAME = new Map(ALL.map(t => [t.name, t]));

/**
 * The value a token carries in one theme block. Aliases keep pointing at the
 * token they alias, with the resolved literal as the fallback, so overriding a
 * base token still cascades.
 */
function resolve(value, theme) {
    if (typeof value === "string") return value;

    const target = BY_NAME.get(value.alias);
    if (!target) throw new Error(`Unknown alias target "${value.alias}"`);
    return `var(--ruic-${target.name}, ${resolve(target[theme] ?? target.light, theme)})`;
}

/** The `:root` value of a token. */
const lightValue = (token) => resolve(token.light, "light");

/**
 * The `.dark` value, or `null` when the token does not change between themes.
 * An alias that is the same in both is left out: it follows the aliased token
 * into dark mode on its own.
 */
function darkValue(token) {
    if (token.dark === undefined) return null;
    const light = lightValue(token);
    const dark = resolve(token.dark, "dark");
    return dark === light ? null : dark;
}

/**
 * The value the Tailwind preset uses: the token's own custom property, with the
 * light value as the fallback. Which theme applies is decided by the `.dark`
 * class in the cascade, not here — that is the whole point.
 */
function themeValue(name) {
    const token = BY_NAME.get(name);
    if (!token) throw new Error(`Unknown token "${name}"`);

    if (token.format === "rgb") {
        return `rgb(var(--ruic-${name}, ${token.light}) / <alpha-value>)`;
    }
    return `var(--ruic-${name}, ${lightValue(token)})`;
}

/** `{ ':root': {...}, '.dark': {...} }` — what the preset feeds to `addBase`. */
function baseDeclarations() {
    const root = {};
    const dark = {};

    for (const token of ALL) {
        root[`--ruic-${token.name}`] = lightValue(token);
        const value = darkValue(token);
        if (value !== null) dark[`--ruic-${token.name}`] = value;
    }

    return { ":root": root, ".dark": dark };
}

// ─── Scales ──────────────────────────────────────────────────────────────────
// Not themed, but equally a design decision: without them every component picks
// its own radius and duration, which is how six different corner radii ended up
// in one library.

const RADIUS = {
    sm: "0.375rem",  // 6px  – inline chips, small controls
    md: "0.5rem",    // 8px  – buttons, inputs, menus
    lg: "0.75rem",   // 12px – cards, panels, sheets
    xl: "1rem",      // 16px – large surfaces, mobile sheets
    full: "9999px",  //      – pills and icon buttons
};

const DURATION = {
    fast: "150ms",   // state changes on a single element
    base: "200ms",   // the default for colour and shadow
    slow: "300ms",   // layout-affecting motion (sidebar, sheets)
};

module.exports = { GROUPS, ALL, lightValue, darkValue, themeValue, baseDeclarations, RADIUS, DURATION };
