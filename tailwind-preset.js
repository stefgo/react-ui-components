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
        app: {
          accent: "#E54D0D",
          card: "#1e1e1e",
        },
      },
      boxShadow: {
        "glow-accent": "0 0 15px rgba(229, 77, 13, 0.3)",
      },
    },
  },
  plugins: [],
};
