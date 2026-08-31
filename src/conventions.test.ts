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
});
