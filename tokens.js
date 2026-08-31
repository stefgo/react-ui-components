/**
 * The single source of truth for the library's design tokens.
 *
 * `tailwind-preset.js` builds its colour scale from this file, and
 * `scripts/generate-tokens-css.js` generates `src/index.css` from it. Nothing
 * else may hard-code a default – that is how the two drifted apart before.
 *
 * A token is `{ name, value }`, where `value` is either a literal CSS colour or
 * `{ alias }` pointing at another token. Aliases stay aliases all the way into
 * the generated CSS, so overriding a base token cascades to everything built on
 * top of it.
 *
 * `format: "rgb"` marks a space-separated RGB triple. Tailwind needs those raw
 * so it can inject `<alpha-value>` for opacity utilities like `bg-primary/20`.
 */

/** @typedef {{ name: string, value: string | { alias: string }, format?: "rgb", comment?: string }} Token */

/** @type {{ title: string, tokens: Token[] }[]} */
const GROUPS = [
    {
        title: "Brand",
        tokens: [
            { name: "primary", value: "229 77 13", format: "rgb", comment: "#e54d0d" },
            { name: "primary-hover", value: "255 95 31", format: "rgb", comment: "#ff5f1f" },
        ],
    },
    {
        title: "Semantic State Colors",
        tokens: [
            { name: "error", value: "#dc2626" },
            { name: "error-hover", value: "#b91c1c" },
            { name: "error-dark", value: "#f87171" },
            { name: "error-bg", value: "#fef2f2" },
            { name: "error-bg-dark", value: "rgba(127, 29, 29, 0.3)" },

            { name: "success", value: "#16a34a" },
            { name: "success-hover", value: "#15803d" },
            { name: "success-dark", value: "#4ade80" },

            { name: "warning", value: "#ea580c" },
            { name: "warning-hover", value: "#c2410c" },
            { name: "warning-dark", value: "#fb923c" },
            { name: "warning-bg", value: "#ffedd5" },
            { name: "warning-bg-dark", value: "rgba(124, 45, 18, 0.3)" },

            { name: "info", value: "#2563eb" },
            { name: "info-hover", value: "#1d4ed8" },
            { name: "info-dark", value: "#60a5fa" },
            { name: "info-light", value: "#93c5fd" },

            { name: "accent", value: "#4f46e5" },
            { name: "accent-hover", value: "#4338ca" },
            { name: "accent-dark", value: "#818cf8" },
            { name: "accent-bg", value: "#eef2ff" },
            { name: "accent-bg-dark", value: "rgba(49, 46, 129, 0.3)" },
        ],
    },
    {
        title: "Surfaces & Backgrounds",
        tokens: [
            { name: "bg-app", value: "#f9fafb", comment: "page / layout background" },
            { name: "bg-app-dark", value: "#111111" },
            { name: "bg-card", value: "#ffffff", comment: "panels, dropdowns, modal sheets" },
            { name: "bg-card-dark", value: "#141414" },
            { name: "bg-card-header", value: "#f3f4f6" },
            { name: "bg-card-header-dark", value: "#181818" },
            { name: "overlay", value: "rgba(0, 0, 0, 0.6)", comment: "scrim behind modals" },
        ],
    },
    {
        title: "Typography",
        tokens: [
            { name: "text-primary", value: "#111827" },
            { name: "text-primary-dark", value: "#f9fafb" },
            { name: "text-secondary", value: "#4b5563" },
            { name: "text-secondary-dark", value: "#d1d5db" },
            { name: "text-muted", value: "#808080" },
            { name: "text-muted-dark", value: "#808080" },
        ],
    },
    {
        title: "Borders & Interactive States",
        tokens: [
            { name: "border", value: "#e2e8f0" },
            { name: "border-dark", value: "#2a2a2a" },
            { name: "hover", value: "#f3f4f6" },
            { name: "hover-dark", value: "#252525" },
        ],
    },
    {
        title: "Component: Button",
        tokens: [
            { name: "button-primary-text", value: "#ffffff" },
            { name: "button-secondary-bg", value: "#e5e7eb" },
            { name: "button-secondary-hover-bg", value: "#d1d5db" },
            { name: "button-secondary-bg-dark", value: "#333333" },
            { name: "button-secondary-hover-bg-dark", value: "#444444" },
            { name: "button-danger-bg", value: { alias: "error" } },
            { name: "button-danger-hover-bg", value: { alias: "error-hover" } },
        ],
    },
    {
        title: "Component: Badge",
        tokens: [
            { name: "badge-success-bg", value: "#dcfce7" },
            { name: "badge-success-text", value: "#15803d" },
            { name: "badge-success-bg-dark", value: "rgba(20, 83, 45, 0.3)" },
            { name: "badge-success-text-dark", value: "#4ade80" },

            { name: "badge-warning-bg", value: "#ffedd5" },
            { name: "badge-warning-text", value: "#c2410c" },
            { name: "badge-warning-bg-dark", value: "rgba(124, 45, 18, 0.3)" },
            { name: "badge-warning-text-dark", value: "#fb923c" },

            { name: "badge-error-bg", value: "#fef2f2" },
            { name: "badge-error-text", value: "#b91c1c" },
            { name: "badge-error-bg-dark", value: "rgba(127, 29, 29, 0.3)" },
            { name: "badge-error-text-dark", value: "#f87171" },

            { name: "badge-info-bg", value: "#dbeafe" },
            { name: "badge-info-text", value: "#1d4ed8" },
            { name: "badge-info-bg-dark", value: "rgba(30, 58, 138, 0.3)" },
            { name: "badge-info-text-dark", value: "#60a5fa" },
        ],
    },
    {
        title: "Component: Input / Select",
        tokens: [
            { name: "input-bg", value: { alias: "bg-app" } },
            { name: "input-bg-dark", value: { alias: "bg-app-dark" } },
            { name: "input-border", value: { alias: "border" } },
            { name: "input-border-dark", value: { alias: "border-dark" } },
        ],
    },
    {
        title: "Component: Sidebar",
        tokens: [
            { name: "sidebar-bg", value: { alias: "bg-app" } },
            { name: "sidebar-bg-dark", value: "#1a1a1a" },
            { name: "sidebar-item-active-bg", value: { alias: "bg-card" } },
            { name: "sidebar-item-active-bg-dark", value: "#252525" },
            { name: "sidebar-badge-active-bg", value: { alias: "hover" } },
            { name: "sidebar-badge-active-bg-dark", value: "#333333" },
            {
                name: "sidebar-badge-inactive-bg",
                value: { alias: "sidebar-badge-active-bg" },
                comment: "aliased so the two states can diverge without code changes",
            },
            { name: "sidebar-badge-inactive-bg-dark", value: { alias: "sidebar-badge-active-bg-dark" } },
        ],
    },
    {
        title: "Component: Table",
        tokens: [
            { name: "table-header-bg", value: { alias: "bg-card-header" } },
            { name: "table-header-bg-dark", value: "#202020" },
            { name: "table-header-toggle-bg", value: "#e5e7eb" },
            { name: "table-header-toggle-bg-dark", value: { alias: "bg-app-dark" } },
            { name: "table-header-toggle-active-bg", value: { alias: "bg-card" } },
            { name: "table-header-toggle-active-bg-dark", value: "#444444" },
            { name: "table-row-bg", value: { alias: "bg-app" } },
            { name: "table-row-bg-dark", value: "#181818" },
            { name: "table-row-hover-bg", value: { alias: "hover" } },
            { name: "table-row-hover-bg-dark", value: "#202020" },
        ],
    },
    {
        title: "Component: StatCard",
        tokens: [
            { name: "statcard-bg", value: { alias: "bg-card-header" } },
            { name: "statcard-bg-dark", value: "#181818" },
            { name: "statcard-icon-bg", value: { alias: "bg-app" } },
            { name: "statcard-icon-bg-dark", value: "#252525" },
        ],
    },
    {
        title: "Component: DashboardHeader",
        tokens: [
            { name: "browser-header-bg", value: { alias: "bg-card" } },
            { name: "browser-header-bg-dark", value: "#1e1e1e" },
        ],
    },
];

const ALL = GROUPS.flatMap(g => g.tokens);
const BY_NAME = new Map(ALL.map(t => [t.name, t]));

/**
 * The value a token carries in the generated stylesheet. Aliases keep pointing at
 * the token they alias, with the resolved literal as the fallback, so overriding
 * a base token still cascades.
 */
function cssValue(token) {
    if (typeof token.value === "string") return token.value;

    const target = BY_NAME.get(token.value.alias);
    if (!target) throw new Error(`Token "${token.name}" aliases unknown token "${token.value.alias}"`);
    return `var(--ruic-${target.name}, ${cssValue(target)})`;
}

/**
 * The value the Tailwind preset uses: the token's own custom property with the
 * default (or alias chain) as its fallback.
 */
function themeValue(name) {
    const token = BY_NAME.get(name);
    if (!token) throw new Error(`Unknown token "${name}"`);

    if (token.format === "rgb") {
        return `rgb(var(--ruic-${name}, ${token.value}) / <alpha-value>)`;
    }
    return `var(--ruic-${name}, ${cssValue(token)})`;
}

module.exports = { GROUPS, ALL, cssValue, themeValue };
