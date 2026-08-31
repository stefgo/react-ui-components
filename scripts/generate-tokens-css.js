#!/usr/bin/env node
/**
 * Generates src/index.css from tokens.js.
 *
 * The package ships no stylesheet and needs none: the Tailwind preset emits the
 * declarations below through `addBase`. This file exists so the defaults are
 * readable in one place, and so the workbench has something to import. It is
 * generated rather than maintained so it can never disagree with the preset.
 *
 * Run `npm run tokens:build`; CI runs `npm run tokens:check`.
 */

const fs = require("fs");
const path = require("path");
const { GROUPS, lightValue, darkValue } = require("../tokens");

const OUT = path.join(__dirname, "..", "src", "index.css");
const RULE_WIDTH = 78;

const heading = (title) => {
    const prefix = `  /* ─── ${title} `;
    const dashes = Math.max(3, RULE_WIDTH - prefix.length - 3);
    return `${prefix}${"─".repeat(dashes)} */`;
};

const declarations = (tokens, pick) => {
    const rows = tokens
        .map((token) => ({ token, value: pick(token) }))
        .filter((row) => row.value !== null);

    if (rows.length === 0) return [];

    const width = Math.max(...rows.map((r) => r.token.name.length)) + 9;
    return rows.map(({ token, value }) => {
        const key = `  --ruic-${token.name}:`;
        const comment = token.comment ? ` /* ${token.comment} */` : "";
        return `${key.padEnd(width + 2)}${value};${comment}`;
    });
};

const block = (pick, { withComments }) =>
    GROUPS
        .map((group) => {
            const lines = declarations(group.tokens, pick);
            if (lines.length === 0) return null;
            return [withComments ? heading(group.title) : `  /* ${group.title} */`, ...lines].join("\n");
        })
        .filter(Boolean)
        .join("\n\n");

const css = `@tailwind base;
@tailwind components;
@tailwind utilities;

/*
 * GENERATED FILE – do not edit.
 * Source: tokens.js  ·  Regenerate: npm run tokens:build
 *
 * You do not need to import this: the Tailwind preset emits the same
 * declarations via addBase. It is here as a readable reference and as the
 * stylesheet the workbench loads. Override any token in your own :root / .dark.
 */
:root {
${block((t) => lightValue(t), { withComments: true })}
}

/*
 * Only what actually changes. A token missing here is either identical in both
 * themes or an alias, and an alias follows the token it points at by itself.
 */
.dark {
${block((t) => darkValue(t), { withComments: false })}
}
`;

const previous = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : null;
fs.writeFileSync(OUT, css);

console.log(previous === css ? "tokens: up to date" : `tokens: wrote ${path.relative(process.cwd(), OUT)}`);
