const path = require("path");
const { themeValue: t } = require("./tokens");

/**
 * Tailwind CSS preset for @stefgo/react-ui-components.
 *
 * Adds the library's dist files to Tailwind's content list and maps the design
 * tokens from `tokens.js` onto Tailwind colour utilities. Defaults live in
 * `tokens.js` only – never repeat a colour literal here.
 *
 * Consumers override tokens via CSS variables in their own :root / .dark rules:
 *   :root { --ruic-primary: 12 34 56; }
 */
module.exports = {
  content: [path.join(__dirname, "dist/**/*.{js,mjs}")],
  safelist: [
    "group-hover:bg-table-row-hover",
    "dark:group-hover:bg-table-row-hover-dark",
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
          dark: t("error-dark"),
          bg: t("error-bg"),
          "bg-dark": t("error-bg-dark"),
        },
        success: {
          DEFAULT: t("success"),
          hover: t("success-hover"),
          dark: t("success-dark"),
        },
        warning: {
          DEFAULT: t("warning"),
          hover: t("warning-hover"),
          dark: t("warning-dark"),
          bg: t("warning-bg"),
          "bg-dark": t("warning-bg-dark"),
        },
        info: {
          DEFAULT: t("info"),
          hover: t("info-hover"),
          dark: t("info-dark"),
          light: t("info-light"),
        },
        accent: {
          DEFAULT: t("accent"),
          hover: t("accent-hover"),
          dark: t("accent-dark"),
          bg: t("accent-bg"),
          "bg-dark": t("accent-bg-dark"),
        },

        // ─── Surfaces & Backgrounds ──────────────────────────────────────────
        card: {
          DEFAULT: t("bg-card"),
          dark: t("bg-card-dark"),
          header: t("bg-card-header"),
          "header-dark": t("bg-card-header-dark"),
        },
        app: {
          bg: {
            DEFAULT: t("bg-app"),
            dark: t("bg-app-dark"),
          },
        },
        overlay: t("overlay"),

        // ─── Typography ──────────────────────────────────────────────────────
        text: {
          primary: {
            DEFAULT: t("text-primary"),
            dark: t("text-primary-dark"),
          },
          secondary: {
            DEFAULT: t("text-secondary"),
            dark: t("text-secondary-dark"),
          },
          muted: {
            DEFAULT: t("text-muted"),
            dark: t("text-muted-dark"),
          },
        },

        // ─── Borders & Dividers ──────────────────────────────────────────────
        // Enables: border-border, dark:border-border-dark,
        //          divide-border, ring-border, …
        border: {
          DEFAULT: t("border"),
          dark: t("border-dark"),
        },

        // ─── Interactive Hover Backgrounds ───────────────────────────────────
        hover: {
          DEFAULT: t("hover"),
          dark: t("hover-dark"),
        },

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
            dark: t("button-secondary-bg-dark"),
            "dark-hover": t("button-secondary-hover-bg-dark"),
          },
          danger: {
            DEFAULT: t("button-danger-bg"),
            hover: t("button-danger-hover-bg"),
          },
        },

        // ─── Component: Badge ────────────────────────────────────────────────
        badge: {
          success: {
            bg: t("badge-success-bg"),
            text: t("badge-success-text"),
            "bg-dark": t("badge-success-bg-dark"),
            "text-dark": t("badge-success-text-dark"),
          },
          warning: {
            bg: t("badge-warning-bg"),
            text: t("badge-warning-text"),
            "bg-dark": t("badge-warning-bg-dark"),
            "text-dark": t("badge-warning-text-dark"),
          },
          error: {
            bg: t("badge-error-bg"),
            text: t("badge-error-text"),
            "bg-dark": t("badge-error-bg-dark"),
            "text-dark": t("badge-error-text-dark"),
          },
          info: {
            bg: t("badge-info-bg"),
            text: t("badge-info-text"),
            "bg-dark": t("badge-info-bg-dark"),
            "text-dark": t("badge-info-text-dark"),
          },
        },

        // ─── Component: Input / Select ───────────────────────────────────────
        input: {
          bg: {
            DEFAULT: t("input-bg"),
            dark: t("input-bg-dark"),
          },
          border: {
            DEFAULT: t("input-border"),
            dark: t("input-border-dark"),
          },
        },

        // ─── Component: Sidebar ──────────────────────────────────────────────
        sidebar: {
          bg: {
            DEFAULT: t("sidebar-bg"),
            dark: t("sidebar-bg-dark"),
          },
          item: {
            active: {
              DEFAULT: t("sidebar-item-active-bg"),
              dark: t("sidebar-item-active-bg-dark"),
            },
          },
          badge: {
            active: {
              DEFAULT: t("sidebar-badge-active-bg"),
              dark: t("sidebar-badge-active-bg-dark"),
            },
            inactive: {
              DEFAULT: t("sidebar-badge-inactive-bg"),
              dark: t("sidebar-badge-inactive-bg-dark"),
            },
          },
        },

        // ─── Component: Table ────────────────────────────────────────────────
        table: {
          header: {
            DEFAULT: t("table-header-bg"),
            dark: t("table-header-bg-dark"),
            "toggle-bg": t("table-header-toggle-bg"),
            "toggle-bg-dark": t("table-header-toggle-bg-dark"),
            "toggle-active-bg": t("table-header-toggle-active-bg"),
            "toggle-active-bg-dark": t("table-header-toggle-active-bg-dark"),
          },
          row: {
            DEFAULT: t("table-row-bg"),
            dark: t("table-row-bg-dark"),
            hover: t("table-row-hover-bg"),
            "hover-dark": t("table-row-hover-bg-dark"),
          },
        },

        // ─── Component: StatCard ─────────────────────────────────────────────
        statcard: {
          bg: {
            DEFAULT: t("statcard-bg"),
            dark: t("statcard-bg-dark"),
          },
          "icon-bg": {
            DEFAULT: t("statcard-icon-bg"),
            dark: t("statcard-icon-bg-dark"),
          },
        },

        // ─── Component: DashboardHeader ──────────────────────────────────────
        browser: {
          header: {
            DEFAULT: t("browser-header-bg"),
            dark: t("browser-header-bg-dark"),
          },
        },
      },

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
        "glow-success": "0 0 12px rgba(34, 197, 94, 0.4)",
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
    function ({ addUtilities }) {
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
