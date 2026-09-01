import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

/**
 * The four conventions, checked mechanically.
 *
 * Documentation asks; a test enforces. This file exists because a stale
 * `dark:hover:bg-table-row-hover-dark` survived the token migration for three
 * commits — the codemod matched `dark:bg-…`, and nobody was looking for the
 * compound-variant form. A grep would have found it instantly.
 */

const SRC = join(__dirname);

const sourceFiles = (): string[] => {
    const found: string[] = [];
    const walk = (dir: string) => {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
            const path = join(dir, entry.name);
            if (entry.isDirectory()) walk(path);
            else if (/\.tsx?$/.test(entry.name) && !/\.(test|stories)\./.test(entry.name)) {
                found.push(path);
            }
        }
    };
    walk(SRC);
    return found;
};

const matches = (pattern: RegExp) =>
    sourceFiles().flatMap((file) => {
        const lines = readFileSync(file, 'utf8').split('\n');
        return lines
            .map((line, i) => ({ line, i }))
            .filter(({ line }) => pattern.test(line))
            .map(({ line, i }) => `${relative(SRC, file)}:${i + 1}  ${line.trim()}`);
    });

/**
 * The opening tag of every JSX element of one of `tags`, as raw text.
 *
 * Not a regex over the line: an attribute value holds arrow functions, so the
 * first `>` after the tag name is usually the one in `() =>`, not the end of
 * the tag. This walks the text instead, ignoring anything inside braces or
 * quotes, and stops at the `>` that actually closes the tag.
 */
const openingTags = (source: string, tags: string[]): string[] => {
    const found: string[] = [];
    const lines = source.split('\n');
    const start = new RegExp(`<(${tags.join('|')})[\\s>]`, 'g');
    let match: RegExpExecArray | null;

    while ((match = start.exec(source)) !== null) {
        let depth = 0;
        let quote = '';
        let i = match.index + match[0].length - 1;

        for (; i < source.length; i++) {
            const ch = source[i];
            if (quote) {
                if (ch === quote) quote = '';
                continue;
            }
            if (ch === '"' || ch === "'" || ch === '`') quote = ch;
            else if (ch === '{') depth++;
            else if (ch === '}') depth--;
            else if (ch === '>' && depth === 0) break;
        }
        // An element may be mouse-only when the same action is already on the
        // keyboard elsewhere — a backdrop whose dialog closes on Escape. That
        // has to be stated next to the element, not assumed by the rule.
        const tag = source.slice(match.index, i + 1);
        const lineNo = source.slice(0, match.index).split('\n').length - 1;
        const before = lines.slice(Math.max(0, lineNo - 3), lineNo).join('\n');
        if (!/conventions: mouse-only/.test(tag + before)) found.push(tag);
    }
    return found;
};

/** Drops comments, so an example colour written for a reader is not read as code. */
const withoutComments = (source: string): string =>
    source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

/** A colour literal that is not plain black or white — `rgb(0 0 0 / .05)` is a shadow, `rgba(34,197,94,…)` is a role. */
const chromaticLiterals = (raw: string): string[] => {
    const source = withoutComments(raw);
    const hits: string[] = [];
    for (const [literal] of source.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) hits.push(literal);
    for (const m of source.matchAll(/rgba?\(([^)]*)\)/g)) {
        const channels = m[1].split(/[\s,/]+/).filter(Boolean).slice(0, 3);
        if (new Set(channels).size > 1) hits.push(m[0]);
    }
    return hits;
};

describe('conventions', () => {
    it('has no source files missing from the scan', () => {
        // Guards the guard: a broken walk would make every test below pass.
        expect(sourceFiles().length).toBeGreaterThan(30);
    });

    it('uses one token per role, not a -dark twin', () => {
        // `bg-card`, never `bg-card dark:bg-card-dark`. The `.dark` block
        // redefines the variable, so one class covers both themes.
        expect(matches(/\b(?:bg|text|border|ring|from|to|via)-[\w-]+-dark\b/)).toEqual([]);
    });

    it('carries exactly one dark: prefix, and it is the one with no light counterpart', () => {
        const found = matches(/\bdark:/);
        expect(found).toHaveLength(1);
        expect(found[0]).toContain('LoginPage.tsx');
    });

    it('has no classNames.root slot', () => {
        // `className` already addresses the root element; a `root` slot was a
        // second name for the same thing.
        expect(matches(/classNames\?\.root\b|^\s*root\?: string;/)).toEqual([]);
    });

    it('exports every Props interface', () => {
        // A consumer that needs to name a prop's type -- to key a lookup table
        // by Badge's variant, say -- has no way to reach an unexported one, and
        // ends up re-declaring the union by hand. It then drifts silently the
        // next time a variant is added here.
        expect(matches(/^interface [A-Za-z]+Props\b/)).toEqual([]);
    });

    it('has no containerClassName', () => {
        expect(matches(/\bcontainerClassName\b/)).toEqual([]);
    });

    it('declares components as plain functions, not React.FC', () => {
        expect(matches(/:\s*React\.FC<|:\s*FC</)).toEqual([]);
    });

    it('keeps icon props as components, not elements', () => {
        // `icon: ReactNode` is the element form, which forces every caller to
        // decide the size and `aria-hidden` for themselves.
        expect(matches(/^\s*icon\??:\s*(React\.)?ReactNode/)).toEqual([]);
    });

    it('names controllable state value/defaultValue/onChange', () => {
        // The four pre-4.0 spellings, matched as prop *declarations* only — the
        // same words are fine as local variables.
        const legacy = /^\s*(initiallyExpanded|onExpandedChange|defaultSearchValue|onSearchChange|viewModeStorageKey|defaultSort|sortStorageKey|defaultExpanded)\??:/;
        expect(matches(legacy)).toEqual([]);
    });

    it('gives every clickable element a keyboard path', () => {
        // A `<th onClick>` or `<tr onClick>` is a mouse-only control: not
        // reachable by Tab, not activated by Enter. Sortable headers and the
        // tree chevrons were exactly this until they became real buttons, and
        // nothing in the type system or the render output said so.
        const offenders = sourceFiles().flatMap((file) => {
            const tags = openingTags(readFileSync(file, 'utf8'), ['div', 'span', 'th', 'tr', 'td', 'li']);
            return tags
                .filter((tag) => /\bonClick\b/.test(tag))
                .filter((tag) => !/\bonKeyDown\b|\brole=|\btabIndex\b/.test(tag))
                .map((tag) => `${relative(SRC, file)}  ${tag.split('\n')[0].trim()}`);
        });
        expect(offenders).toEqual([]);
    });

    it('keeps colour literals out of the components', () => {
        // Every colour is a token. A literal in a component cannot follow the
        // theme, so it silently stays put when everything around it switches.
        const offenders = sourceFiles().flatMap((file) => {
            const source = readFileSync(file, 'utf8');
            return chromaticLiterals(source).map((hit) => `${relative(SRC, file)}  ${hit}`);
        });
        expect(offenders).toEqual([]);
    });

    it('keeps colour literals out of the tailwind preset', () => {
        // tokens.js is the single source of every colour default; the preset
        // derives. Neutral black/white shadows are not a role and stay allowed.
        const preset = readFileSync(join(SRC, '..', 'tailwind-preset.js'), 'utf8');
        expect(chromaticLiterals(preset)).toEqual([]);
    });
});
