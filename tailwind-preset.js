const path = require("path");
const { themeValue: t, baseDeclarations, RADIUS, DURATION } = require("./tokens");

/**
 * Tailwind CSS preset for @stefgo/react-ui-components.
 *
 * It does three things:
 *   1. adds the library's dist files to Tailwind's `content` scanning,
 *   2. maps the design tokens from `tokens.js` onto Tailwind utilities,
 *   3. emits the token declarations themselves (`:root` and `.dark`) as base
 *      styles, so consumers need no extra stylesheet import.
 *
 * Defaults live in `tokens.js` only — never repeat a colour literal here.
 *
 * Every colour is one class, not two: `bg-card` resolves per theme because the
 * `.dark` block redefines the custom property. Consumers override by redefining
 * the variables:
 *
 *   :root { --ruic-primary: 12 34 56; }
 *   .dark { --ruic-bg-card: #0b0b0b; }
 */
module.exports = {
  darkMode: "class",
  content: [path.join(__dirname, "dist/**/*.{js,mjs}")],
  safelist: [
    "group-hover:bg-table-row-hover",
  ],
  theme: {
    extend: {
      colors: {
        // ─── Brand ────────────────────────────────────────────────────────────
        primary: {
          DEFAULT: t("primary"),
          hover: t("primary-hover"),
        },

        // ─── Semantic State Colors ────────────────────────────────────────────
        error: {
          DEFAULT: t("error"),
          hover: t("error-hover"),
          bg: t("error-bg"),
        },
        success: {
          DEFAULT: t("success"),
          hover: t("success-hover"),
        },
        warning: {
          DEFAULT: t("warning"),
          hover: t("warning-hover"),
          bg: t("warning-bg"),
        },
        info: {
          DEFAULT: t("info"),
          hover: t("info-hover"),
        },
        accent: {
          DEFAULT: t("accent"),
          hover: t("accent-hover"),
          bg: t("accent-bg"),
        },

        // ─── Surfaces & Backgrounds ──────────────────────────────────────────
        card: {
          DEFAULT: t("bg-card"),
          header: t("bg-card-header"),
        },
        app: {
          bg: t("bg-app"),
        },
        overlay: t("overlay"),

        // ─── Typography ──────────────────────────────────────────────────────
        text: {
          primary: t("text-primary"),
          secondary: t("text-secondary"),
          muted: t("text-muted"),
        },

        // ─── Borders & Interactive Backgrounds ───────────────────────────────
        border: t("border"),
        hover: t("hover"),

        // ─── Component: Button ───────────────────────────────────────────────
        button: {
          primary: {
            DEFAULT: t("primary"),
            hover: t("primary-hover"),
            text: t("button-primary-text"),
          },
          secondary: {
            DEFAULT: t("button-secondary-bg"),
            hover: t("button-secondary-hover-bg"),
          },
          danger: {
            DEFAULT: t("button-danger-bg"),
            hover: t("button-danger-hover-bg"),
          },
        },

        // ─── Component: Badge ────────────────────────────────────────────────
        badge: {
          success: { bg: t("badge-success-bg"), text: t("badge-success-text") },
          warning: { bg: t("badge-warning-bg"), text: t("badge-warning-text") },
          error: { bg: t("badge-error-bg"), text: t("badge-error-text") },
          info: { bg: t("badge-info-bg"), text: t("badge-info-text") },
          neutral: { bg: t("badge-neutral-bg"), text: t("badge-neutral-text") },
        },

        // ─── Component: Input / Select ───────────────────────────────────────
        input: {
          bg: t("input-bg"),
          border: t("input-border"),
        },

        // ─── Component: Sidebar ──────────────────────────────────────────────
        sidebar: {
          bg: t("sidebar-bg"),
          item: { active: t("sidebar-item-active-bg") },
          badge: {
            active: t("sidebar-badge-active-bg"),
            inactive: t("sidebar-badge-inactive-bg"),
          },
        },

        // ─── Component: Table ────────────────────────────────────────────────
        table: {
          header: {
            DEFAULT: t("table-header-bg"),
            "toggle-bg": t("table-header-toggle-bg"),
            "toggle-active-bg": t("table-header-toggle-active-bg"),
          },
          row: {
            DEFAULT: t("table-row-bg"),
            hover: t("table-row-hover-bg"),
          },
        },

        // ─── Component: StatCard ─────────────────────────────────────────────
        statcard: {
          bg: t("statcard-bg"),
          "icon-bg": t("statcard-icon-bg"),
        },

        // ─── Component: DashboardHeader ──────────────────────────────────────
        browser: {
          header: t("browser-header-bg"),
        },
      },

      // ─── Shape ────────────────────────────────────────────────────────────
      // Overrides Tailwind's own steps on purpose: containers are `lg`, controls
      // and overlays `md`, pills `full`. One decision instead of one per file.
      borderRadius: RADIUS,

      // ─── Motion ───────────────────────────────────────────────────────────
      transitionDuration: DURATION,

      // ─── Layering ─────────────────────────────────────────────────────────
      // One scale for the whole library, so a dropdown can never end up behind
      // the bottom nav just because it was declared earlier in the DOM.
      zIndex: {
        sticky: "10",
        header: "30",
        bottomnav: "40",
        dropdown: "50",
        overlay: "60",
        modal: "70",
      },

      // ─── Shadows ──────────────────────────────────────────────────────────
      boxShadow: {
        "glow-accent": `0 0 15px ${t("primary").replace("<alpha-value>", "0.3")}`,
        // Derived from the token, not a fixed green: the literal it replaced
        // was not even the success colour, and it stayed the same in dark mode
        // while everything around it changed.
        "glow-success": `0 0 12px ${t("success")}`,
        // The one shadow that points upwards, for a bar docked to the bottom.
        "nav-top": "0 -4px 12px rgb(0 0 0 / 0.05)",
        premium:
          "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.05)",
        "premium-hover":
          "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
      },

      // ─── Animations ───────────────────────────────────────────────────────
      animation: {
        "pulse-soft": "pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "pulse-glow": "pulse-glow 2s infinite",
        "slide-in-from-top": "slide-in-from-top 0.2s ease-out forwards",
        "slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-out forwards",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        },
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: 1, transform: "scale(1)" },
          "50%": { opacity: 0.7, transform: "scale(1.1)" },
        },
        "slide-in-from-top": {
          "0%": { opacity: 0, transform: "translateY(-8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          "0%": { opacity: 0, transform: "translateY(100%)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [
    function ({ addBase, addUtilities }) {
      // The token declarations themselves. Emitting them here rather than
      // shipping a stylesheet keeps the package CSS-free: the consumer's own
      // Tailwind build produces them, so there is no import step to forget.
      addBase(baseDeclarations());

      addUtilities({
        ".scrollbar-none": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        // Animations are decoration; honour the OS setting in one place instead
        // of prefixing every usage with motion-safe:.
        "@media (prefers-reduced-motion: reduce)": {
          ".animate-pulse-soft, .animate-fade-in, .animate-pulse-glow, .animate-slide-in-from-top, .animate-slide-in-from-bottom":
            {
              animation: "none",
              opacity: "1",
              transform: "none",
            },
        },
      });
    },
  ],
};
