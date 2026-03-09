const plugin = require("tailwindcss/plugin");
const path = require("path");

/**
 * Tailwind CSS preset for @stefgo/react-ui-components
 * Automatically adds the library's dist files to the Tailwind content list.
 */
module.exports = {
  content: [path.join(__dirname, "dist/**/*.{js,mjs,jsx,tsx}")],
  plugins: [
    plugin(function ({ addComponents, theme }) {
      // Optional: Add custom components or theme extensions here if needed
    }),
  ],
};
