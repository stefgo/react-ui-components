const plugin = require("tailwindcss/plugin");
const path = require("path");

/**
 * Tailwind CSS preset for @stefgo/react-ui-components.
 * Adds the library's dist files to Tailwind's content list so all
 * utility classes used by the components are included in the CSS output.
 */
module.exports = {
  content: [path.join(__dirname, "dist/**/*.{js,mjs}")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--ruic-primary, #e54d0d)",
          hover: "var(--ruic-primary-hover, #ff5f1f)",
        },
        dark: {
          DEFAULT: "var(--ruic-bg-app-dark, #111111)",
          surface: "var(--ruic-surface-dark, #1a1a1a)",
          border: "var(--ruic-border-dark, #2a2a2a)",
        },
        app: {
          accent: "var(--ruic-primary, #e54d0d)",
          bg: {
            DEFAULT: "var(--ruic-bg-app, #f9fafb)",
            dark: "var(--ruic-bg-app-dark, #111111)",
          },
        },
        card: {
          DEFAULT: "var(--ruic-card-bg, #f9fafb)",
          dark: "var(--ruic-card-bg-dark, #1e1e1e)",
        },
        text: {
          primary: {
            DEFAULT: "var(--ruic-text-primary, #111827)",
            dark: "var(--ruic-text-primary-dark, #f9fafb)",
          },
          secondary: {
            DEFAULT: "var(--ruic-text-secondary, #4b5563)",
            dark: "var(--ruic-text-secondary-dark, #d1d5db)",
          },
          muted: {
            DEFAULT: "var(--ruic-text-muted, #758599)",
            dark: "var(--ruic-text-muted-dark, #888888)",
          },
        },
        // Component-specific tokens
        button: {
          primary: {
            DEFAULT: "var(--ruic-button-primary-bg, #e54d0d)",
            hover: "var(--ruic-button-primary-hover-bg, #ff5f1f)",
            text: "var(--ruic-button-primary-text, #ffffff)",
          },
          secondary: {
            DEFAULT: "var(--ruic-button-secondary-bg, #e5e7eb)",
            hover: "var(--ruic-button-secondary-hover-bg, #d1d5db)",
            dark: "var(--ruic-button-secondary-bg-dark, #333333)",
            "dark-hover": "var(--ruic-button-secondary-hover-bg-dark, #444444)",
          },
          danger: {
            DEFAULT: "var(--ruic-button-danger-bg, #dc2626)",
            hover: "var(--ruic-button-danger-hover-bg, #b91c1c)",
          },
        },
        badge: {
          success: {
            bg: "var(--ruic-badge-success-bg, #dcfce7)",
            text: "var(--ruic-badge-success-text, #15803d)",
            "bg-dark":
              "var(--ruic-badge-success-bg-dark, rgba(20, 83, 45, 0.3))",
            "text-dark": "var(--ruic-badge-success-text-dark, #4ade80)",
          },
          warning: {
            bg: "var(--ruic-badge-warning-bg, #ffedd5)",
            text: "var(--ruic-badge-warning-text, #c2410c)",
            "bg-dark":
              "var(--ruic-badge-warning-bg-dark, rgba(124, 45, 18, 0.3))",
            "text-dark": "var(--ruic-badge-warning-text-dark, #fb923c)",
          },
          error: {
            bg: "var(--ruic-badge-error-bg, #fef2f2)",
            text: "var(--ruic-badge-error-text, #b91c1c)",
            "bg-dark":
              "var(--ruic-badge-error-bg-dark, rgba(127, 29, 29, 0.3))",
            "text-dark": "var(--ruic-badge-error-text-dark, #f87171)",
          },
          info: {
            bg: "var(--ruic-badge-info-bg, #dbeafe)",
            text: "var(--ruic-badge-info-text, #1d4ed8)",
            "bg-dark": "var(--ruic-badge-info-bg-dark, rgba(30, 58, 138, 0.3))",
            "text-dark": "var(--ruic-badge-info-text-dark, #60a5fa)",
          },
        },
        input: {
          bg: {
            DEFAULT: "var(--ruic-input-bg, #f9fafb)",
            dark: "var(--ruic-input-bg-dark, #111111)",
          },
          border: {
            DEFAULT: "var(--ruic-input-border, #e2e8f0)",
            dark: "var(--ruic-input-border-dark, #2a2a2a)",
          },
        },
        sidebar: {
          bg: {
            DEFAULT: "var(--ruic-sidebar-bg, #f9fafb)",
            dark: "var(--ruic-sidebar-bg-dark, #1a1a1a)",
          },
          item: {
            active: {
              DEFAULT: "var(--ruic-sidebar-item-active-bg, #ffffff)",
              dark: "var(--ruic-sidebar-item-active-bg-dark, #252525)",
            },
          },
          badge: {
            active: {
              DEFAULT: "var(--ruic-sidebar-badge-active-bg, #f3f4f6)",
              dark: "var(--ruic-sidebar-badge-active-bg-dark, #333333)",
            },
          },
        },
        table: {
          header: {
            DEFAULT: "var(--ruic-table-header-bg, #f3f4f6)",
            dark: "var(--ruic-table-header-bg-dark, #252525)",
          },
          row: {
            DEFAULT: "var(--ruic-table-row-bg, #f9fafb)",
            dark: "var(--ruic-table-row-bg-dark, #181818)",
          },
          hover: {
            DEFAULT: "var(--ruic-table-row-hover-bg, #f3f4f6)",
            dark: "var(--ruic-table-row-hover-bg-dark, #252525)",
          },
        },
        statcard: {
          bg: {
            DEFAULT: "var(--ruic-statcard-bg, #ffffff)",
            dark: "var(--ruic-statcard-bg-dark, #1e1e1e)",
          },
          icon: {
            DEFAULT: "var(--ruic-statcard-icon-bg, #f9fafb)",
            dark: "var(--ruic-statcard-icon-bg-dark, #252525)",
          },
        },
        browser: {
          header: {
            DEFAULT: "var(--ruic-browser-header-bg, #ffffff)",
            dark: "var(--ruic-browser-header-bg-dark, #1e1e1e)",
          },
        },
      },
      borderColor: {
        DEFAULT: "var(--ruic-border, #e2e8f0)",
        dark: "var(--ruic-border-dark, #2a2a2a)",
      },
      backgroundColor: {
        hover: {
          DEFAULT: "var(--ruic-hover, #f3f4f6)",
          dark: "var(--ruic-hover-dark, #252525)",
        },
      },
      boxShadow: {
        "glow-accent": "0 0 15px #e54d0d4c",
      },
    },
  },
  plugins: [],
};
