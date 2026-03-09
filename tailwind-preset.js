const plugin = require("tailwindcss/plugin");

/**
 * Tailwind CSS preset for @stefgo/react-ui-components.
 * The library ships pre-built CSS via '@stefgo/react-ui-components/styles.css'.
 * This preset is optional and can be used for custom theme extensions.
 */
module.exports = {
  plugins: [
    plugin(function ({ addComponents, theme }) {
      // Optional: Add custom components or theme extensions here if needed
    }),
  ],
};
