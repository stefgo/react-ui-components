#!/usr/bin/env node

/**
 * Checks that every path package.json promises to the outside also exists in the
 * build. Runs after `npm run build`.
 *
 * This class of bug has occurred twice here -- `fix(build): main und module auf
 * die tatsaechlich gebauten Dateien zeigen` and the fix/package-entry-points
 * branch -- and both times it was found by a consumer rather than by a run. The
 * reason is structural: tsup names its outputs from the input globs, package.json
 * spells them out by hand, and lint, test and build all import from src/ instead
 * of dist/. Nothing else ties the two together.
 *
 * Only existence is checked, not content -- but that is exactly what was wrong
 * both times.
 */

const { existsSync, readFileSync, readdirSync } = require("node:fs");
const { join } = require("node:path");

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const errors = [];

const check = (relPath, origin) => {
    const clean = relPath.replace(/^\.\//, "");
    if (!existsSync(clean)) {
        errors.push(`${origin} -> ${relPath} does not exist`);
    }
};

// main, module, types: the fields older bundlers and TypeScript read when they
// do not evaluate exports.
for (const field of ["main", "module", "types"]) {
    if (pkg[field]) check(pkg[field], field);
}

// files: what actually ends up in the tarball. An entry pointing nowhere
// silently publishes less than intended -- tokens.js, for one, is needed at
// runtime by the published preset.
for (const entry of pkg.files ?? []) {
    check(entry, "files");
}

// The public module names -- that is, what `@stefgo/react-ui-components/Button`
// has to resolve to. Derived from tsup's *input* (src/*.ts, src/*.tsx without
// tests and stories) rather than from dist/: the output also contains the
// chunk-* files of code splitting, which nobody imports, and a module that was
// never built in the first place only shows up against the input.
const publicModules = readdirSync("src")
    .filter((f) => /\.tsx?$/.test(f) && !/\.(test|stories)\./.test(f))
    .map((f) => f.replace(/\.tsx?$/, ""));

// exports: the map modern resolvers use. Literal targets are checked directly;
// the wildcard pattern "./*" is resolved against every public module, because
// that is where a missing format or declaration shows up (tsup writes .js, .mjs,
// .d.ts and .d.mts, and the four come from separate options).
const walkExports = (node, path) => {
    if (typeof node === "string") {
        if (!node.includes("*")) return check(node, `exports${path}`);

        const [prefix, suffix] = node.split("*");
        const dir = prefix.replace(/^\.\//, "").replace(/\/[^/]*$/, "");
        if (!existsSync(dir)) {
            errors.push(`exports${path} -> ${dir}/ does not exist`);
            return;
        }
        const missing = publicModules.filter((m) => !existsSync(join(dir, m + suffix)));
        if (missing.length) {
            errors.push(
                `exports${path} -> ${node}: no match for ${missing.length} module(s), ` +
                    `e.g. ${missing.slice(0, 3).join(", ")}`,
            );
        }
        return;
    }
    for (const [key, value] of Object.entries(node)) {
        walkExports(value, `${path}["${key}"]`);
    }
};
walkExports(pkg.exports ?? {}, "");

if (errors.length) {
    for (const e of errors) console.error(`::error::${e}`);
    console.error(`\n${errors.length} entry/entries in package.json point nowhere.`);
    process.exit(1);
}

console.log("All entry points resolved: main, module, types, files, exports.");
