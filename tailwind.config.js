/**
 * Tailwind config for the library's own workbench (Storybook).
 *
 * It consumes `tailwind-preset.js` exactly the way a consuming app does, so the
 * workbench doubles as a test of the preset itself: if a token is missing from
 * the preset, it is missing here too.
 */
module.exports = {
    darkMode: "class",
    presets: [require("./tailwind-preset")],
    content: ["./src/**/*.{ts,tsx}", "./.storybook/**/*.{ts,tsx}"],
};
