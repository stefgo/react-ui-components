const path = require("path");

/**
 * Tailwind CSS preset for @stefgo/react-ui-components.
 *
 * Adds the library's dist files to Tailwind's content list and extends the
 * theme with all CSS-variable-backed design tokens used by the components.
 *
 * Consumers override tokens via CSS variables in their own :root / .dark rules:
 *   :root { --ruic-primary: #your-brand; }
 */
module.exports = {
  content: [path.join(__dirname, "dist/**/*.{js,mjs}")],
  theme: {
    extend: {
      colors: {
        // ─── Brand ────────────────────────────────────────────────────────────
        primary: {
          DEFAULT: "rgb(var(--ruic-primary, 229 77 13) / <alpha-value>)",
          hover:   "var(--ruic-primary-hover, #ff5f1f)",
        },

        // ─── Semantic State Colors ────────────────────────────────────────────
        // Used by ActionButton colors, Input/Select error states, DataAction menus.
        error: {
          DEFAULT:   "var(--ruic-error, #dc2626)",
          hover:     "var(--ruic-error-hover, #b91c1c)",
          dark:      "var(--ruic-error-dark, #f87171)",
          bg:        "var(--ruic-error-bg, #fef2f2)",
          "bg-dark": "var(--ruic-error-bg-dark, rgba(127, 29, 29, 0.3))",
        },
        success: {
          DEFAULT: "var(--ruic-success, #16a34a)",
          hover:   "var(--ruic-success-hover, #15803d)",
          dark:    "var(--ruic-success-dark, #4ade80)",
        },
        warning: {
          DEFAULT:   "var(--ruic-warning, #ea580c)",
          hover:     "var(--ruic-warning-hover, #c2410c)",
          dark:      "var(--ruic-warning-dark, #fb923c)",
          bg:        "var(--ruic-warning-bg, #ffedd5)",
          "bg-dark": "var(--ruic-warning-bg-dark, rgba(124, 45, 18, 0.3))",
        },
        info: {
          DEFAULT: "var(--ruic-info, #2563eb)",
          hover:   "var(--ruic-info-hover, #1d4ed8)",
          dark:    "var(--ruic-info-dark, #60a5fa)",
          light:   "var(--ruic-info-light, #93c5fd)",
        },
        accent: {
          DEFAULT:   "var(--ruic-accent, #4f46e5)",
          hover:     "var(--ruic-accent-hover, #4338ca)",
          dark:      "var(--ruic-accent-dark, #818cf8)",
          bg:        "var(--ruic-accent-bg, #eef2ff)",
          "bg-dark": "var(--ruic-accent-bg-dark, rgba(49, 46, 129, 0.3))",
        },

        // ─── Surfaces & Backgrounds ──────────────────────────────────────────
        card: {
          // White card surface (dropdowns, panels, modal sheets).
          DEFAULT: "var(--ruic-bg-card, #ffffff)",
          dark:    "var(--ruic-bg-card-dark, #141414)",
          header: "var(--ruic-bg-card-header, #f3f4f6)",
          "header-dark": "var(--ruic-bg-card-header-dark, #181818)",
        },
        app: {
          bg: {
            // Page / layout background.
            DEFAULT: "var(--ruic-bg-app, #f9fafb)",
            dark:    "var(--ruic-bg-app-dark, #111111)",
          },
        },

        // ─── Typography ──────────────────────────────────────────────────────
        text: {
          primary: {
            DEFAULT: "var(--ruic-text-primary, #111827)",
            dark:    "var(--ruic-text-primary-dark, #f9fafb)",
          },
          secondary: {
            DEFAULT: "var(--ruic-text-secondary, #4b5563)",
            dark:    "var(--ruic-text-secondary-dark, #d1d5db)",
          },
          muted: {
            DEFAULT: "var(--ruic-text-muted, #808080)",
            dark:    "var(--ruic-text-muted-dark, #808080)",
          },
        },

        // ─── Borders & Dividers ──────────────────────────────────────────────
        // Enables: border-border, dark:border-border-dark,
        //          divide-border, dark:divide-border-dark,
        //          ring-border, dark:ring-border-dark
        border: {
          DEFAULT: "var(--ruic-border, #e2e8f0)",
          dark:    "var(--ruic-border-dark, #2a2a2a)",
        },

        // ─── Interactive Hover Backgrounds ───────────────────────────────────
        // Enables: bg-hover / dark:bg-hover-dark
        hover: {
          DEFAULT: "var(--ruic-hover, #f3f4f6)",
          dark:    "var(--ruic-hover-dark, #252525)",
        },

        // ─── Component: Button ───────────────────────────────────────────────
        button: {
          primary: {
            DEFAULT: "var(--ruic-button-primary-bg, #e54d0d)",
            hover:   "var(--ruic-button-primary-hover-bg, #ff5f1f)",
            text:    "var(--ruic-button-primary-text, #ffffff)",
          },
          secondary: {
            DEFAULT:      "var(--ruic-button-secondary-bg, #e5e7eb)",
            hover:        "var(--ruic-button-secondary-hover-bg, #d1d5db)",
            dark:         "var(--ruic-button-secondary-bg-dark, #333333)",
            "dark-hover": "var(--ruic-button-secondary-hover-bg-dark, #444444)",
          },
          danger: {
            DEFAULT: "var(--ruic-button-danger-bg, #dc2626)",
            hover:   "var(--ruic-button-danger-hover-bg, #b91c1c)",
          },
        },

        // ─── Component: Badge ────────────────────────────────────────────────
        badge: {
          success: {
            bg:          "var(--ruic-badge-success-bg, #dcfce7)",
            text:        "var(--ruic-badge-success-text, #15803d)",
            "bg-dark":   "var(--ruic-badge-success-bg-dark, rgba(20, 83, 45, 0.3))",
            "text-dark": "var(--ruic-badge-success-text-dark, #4ade80)",
          },
          warning: {
            bg:          "var(--ruic-badge-warning-bg, #ffedd5)",
            text:        "var(--ruic-badge-warning-text, #c2410c)",
            "bg-dark":   "var(--ruic-badge-warning-bg-dark, rgba(124, 45, 18, 0.3))",
            "text-dark": "var(--ruic-badge-warning-text-dark, #fb923c)",
          },
          error: {
            bg:          "var(--ruic-badge-error-bg, #fef2f2)",
            text:        "var(--ruic-badge-error-text, #b91c1c)",
            "bg-dark":   "var(--ruic-badge-error-bg-dark, rgba(127, 29, 29, 0.3))",
            "text-dark": "var(--ruic-badge-error-text-dark, #f87171)",
          },
          info: {
            bg:          "var(--ruic-badge-info-bg, #dbeafe)",
            text:        "var(--ruic-badge-info-text, #1d4ed8)",
            "bg-dark":   "var(--ruic-badge-info-bg-dark, rgba(30, 58, 138, 0.3))",
            "text-dark": "var(--ruic-badge-info-text-dark, #60a5fa)",
          },
        },

        // ─── Component: Input / Select ───────────────────────────────────────
        input: {
          bg: {
            DEFAULT: "var(--ruic-input-bg, #f9fafb)",
            dark:    "var(--ruic-input-bg-dark, #111111)",
          },
          border: {
            DEFAULT: "var(--ruic-input-border, #e2e8f0)",
            dark:    "var(--ruic-input-border-dark, #2a2a2a)",
          },
        },

        // ─── Component: Sidebar ──────────────────────────────────────────────
        sidebar: {
          bg: {
            DEFAULT: "var(--ruic-sidebar-bg, #f9fafb)",
            dark:    "var(--ruic-sidebar-bg-dark, #1a1a1a)",
          },
          item: {
            active: {
              DEFAULT: "var(--ruic-sidebar-item-active-bg, #ffffff)",
              dark:    "var(--ruic-sidebar-item-active-bg-dark, #252525)",
            },
          },
          badge: {
            active: {
              DEFAULT: "var(--ruic-sidebar-badge-active-bg, #f3f4f6)",
              dark:    "var(--ruic-sidebar-badge-active-bg-dark, #333333)",
            },
          },
        },

        // ─── Component: Table ────────────────────────────────────────────────
        table: {
          header: {
            DEFAULT:                "var(--ruic-table-header-bg, #f3f4f6)",
            dark:                   "var(--ruic-table-header-bg-dark, #202020)",
            "toggle-bg":            "var(--ruic-table-header-toggle-bg, #e5e7eb)",
            "toggle-bg-dark":       "var(--ruic-table-header-toggle-bg-dark, #111111)",
            "toggle-active-bg":     "var(--ruic-table-header-toggle-active-bg, #ffffff)",
            "toggle-active-bg-dark":"var(--ruic-table-header-toggle-active-bg-dark, #444444)",
          },
          row: {
            DEFAULT:    "var(--ruic-table-row-bg, #f9fafb)",
            dark:       "var(--ruic-table-row-bg-dark, #181818)",
            hover:      "var(--ruic-table-row-hover-bg, #f3f4f6)",
            "hover-dark": "var(--ruic-table-row-hover-bg-dark, #202020)",
          },
        },

        // ─── Component: StatCard ─────────────────────────────────────────────
        statcard: {
          bg: {
            DEFAULT: "var(--ruic-statcard-bg, #f3f4f6)",
            dark:    "var(--ruic-statcard-bg-dark, #181818)",
          },
          "icon-bg": {
            DEFAULT: "var(--ruic-statcard-icon-bg, #f9fafb)",
            dark:    "var(--ruic-statcard-icon-bg-dark, #252525)",
          },
        },

        // ─── Component: DashboardHeader ────────────────────────
        browser: {
          header: {
            DEFAULT: "var(--ruic-browser-header-bg, #ffffff)",
            dark:    "var(--ruic-browser-header-bg-dark, #1e1e1e)",
          },
        },
      },

      // ─── Shadows ──────────────────────────────────────────────────────────
      boxShadow: {
        "glow-accent":   "0 0 15px #e54d0d4c",
        "glow-success":  "0 0 12px rgba(34, 197, 94, 0.4)",
        premium:         "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.05)",
        "premium-hover": "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
      },

      // ─── Animations ───────────────────────────────────────────────────────
      animation: {
        "pulse-soft": "pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in":    "fade-in 0.4s ease-out forwards",
        "pulse-glow": "pulse-glow 2s infinite",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: 1 },
          "50%":      { opacity: 0.7 },
        },
        "fade-in": {
          "0%":   { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: 1, transform: "scale(1)" },
          "50%":      { opacity: 0.7, transform: "scale(1.1)" },
        },
      },
    },
  },
  plugins: [],
};
