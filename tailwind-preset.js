const plugin = require("tailwindcss/plugin");
const path = require("path");

/**
 * Tailwind CSS preset for @stefgo/react-ui-components.
 * Adds the library's dist files to Tailwind's content list so all
 * utility classes used by the components are included in the CSS output.
 */
module.exports = {
  content: [path.join(__dirname, "dist/**/*.{js,mjs}")],
  plugins: [
    plugin(function ({ addComponents, theme }) {
      // Optional: Add custom components or theme extensions here if needed
    }),
  ],
};
