#!/usr/bin/env node
/**
 * Generates src/index.css from tokens.js.
 *
 * The package ships no stylesheet – this file documents the defaults so
 * consumers can copy the :root block and re-theme the library. It is generated
 * rather than maintained so it can never disagree with the Tailwind preset
 * again. Run `npm run tokens:build`; CI runs `npm run tokens:check`.
 */

const fs = require("fs");
const path = require("path");
const { GROUPS, cssValue } = require("../tokens");

const OUT = path.join(__dirname, "..", "src", "index.css");
const RULE_WIDTH = 78;

const heading = (title) => {
    const prefix = `  /* ─── ${title} `;
    const dashes = Math.max(3, RULE_WIDTH - prefix.length - 3);
    return `${prefix}${"─".repeat(dashes)} */`;
};

const declarations = (tokens) => {
    const width = Math.max(...tokens.map(t => t.name.length)) + 9; // "--ruic-" + ":"
    return tokens.map(token => {
        const key = `  --ruic-${token.name}:`;
        const padded = key.padEnd(width + 2);
        const comment = token.comment ? ` /* ${token.comment} */` : "";
        return `${padded}${cssValue(token)};${comment}`;
    });
};

const body = GROUPS
    .map(group => [heading(group.title), ...declarations(group.tokens)].join("\n"))
    .join("\n\n");

const css = `@tailwind base;
@tailwind components;
@tailwind utilities;

/*
 * GENERATED FILE – do not edit.
 * Source: tokens.js  ·  Regenerate: npm run tokens:build
 *
 * Copy the :root block into your own global stylesheet to re-theme the library.
 */
:root {
${body}
}
`;

const previous = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : null;
fs.writeFileSync(OUT, css);

if (previous !== css) {
    console.log(`tokens: wrote ${path.relative(process.cwd(), OUT)}`);
} else {
    console.log("tokens: up to date");
}
