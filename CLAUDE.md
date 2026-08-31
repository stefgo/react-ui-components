# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@stefgo/react-ui-components` is a React 19 component library built with TypeScript and Tailwind CSS. It ships as a dual-format (CJS + ESM) npm package published to GitHub Packages. Correctness rests on TypeScript strict mode and ESLint; the pure logic under `src/data/` is covered by vitest, the components are not.

## Commands

```bash
npm run build   # Production build (tsup: CJS, ESM, .d.ts, minified)
npm run dev     # Watch mode build
npm run lint    # tsc --noEmit + eslint (incl. react-hooks/exhaustive-deps)
npm test        # vitest, pure logic under src/data/
```

CI runs lint, test and build before `semantic-release`.

## Architecture

### Output & Exports

All components are exported as named exports from `src/index.ts`. The build produces `dist/index.js` (CJS), `dist/index.mjs` (ESM) and `dist/index.d.ts`. Only files directly under `src/` become entry points — `src/data/**` is bundled into the components that import it. No CSS is bundled — consumers must run Tailwind themselves.

### Tailwind Integration

`tailwind-preset.js` (at repo root) is exported alongside the JS bundle. Consuming apps must include it:

```js
// tailwind.config.js in consumer
presets: [require("@stefgo/react-ui-components/tailwind-preset")],
```

The preset does two things: adds the library's dist files to Tailwind's `content` scanning, and extends the theme with 40+ CSS-variable-backed color tokens (`primary`, `button-primary`, `badge-success-bg`, etc.). Without this preset, Tailwind will purge library classes and theming won't work.

### Component Pattern

Every component follows this structure:

```typescript
interface ComponentClassNames {
    root?: string;
    // named slots...
}

interface ComponentProps extends HTMLAttributes<HTMLElement> {
    variant?: 'primary' | 'secondary';
    classNames?: ComponentClassNames;
}

export const Component = ({ classNames, ...props }: ComponentProps) => {
    return <div className={cn(baseStyles, classNames?.root)} />;
};
```

Key points:
- **`classNames` prop** — slot-based customization on every component; slot names correspond to meaningful sub-elements (e.g. `root`, `icon`, `label`, `header`)
- **`cn()` utility** from `src/utils.ts` — wraps `clsx` + `tailwind-merge`; always use it to compose class strings to avoid Tailwind conflicts
- **CSS variables** control theming (`--color-primary`, etc.); dark mode is handled via `dark:` Tailwind prefix automatically

### Data Views

`DataTable`, `DataList`, `DataTreeTable` and `DataMultiView` share one pipeline
instead of a base class. The pieces live in `src/data/`:

| Module | Role |
| --- | --- |
| `pipeline.ts` | pure: filter → sort → slice, plus the resulting counts |
| `sorting.ts` | pure: comparator, click transition, persisted sort |
| `tree.ts` | pure: flatten a tree, following the expanded set |
| `useDataView.ts` | props → rows to render + everything the bar needs |
| `usePaginationState.ts` | resolves controlled vs. uncontrolled page state |
| `useSortColumns.ts`, `useTreeExpansion.ts` | the views' own state |
| `DataViewFrame.tsx` | container, scroll area, pagination bar |

**The invariant:** in client mode `data` is always the *complete* set. The view
filters, sorts and only then takes the current page. A caller that hands over a
pre-sliced page gets a sort that covers that page alone — the defect 2.16.0
shipped and 2.16.1 only half-corrected. The single exception is `pagination.mode: 'server'`, where the
view skips all three stages and the caller supplies `totalItems`.

Counts always come from the stage *after* filtering and *before* slicing, which
is why filtering belongs inside the view rather than in front of it.

### Theming (Three-Tier System)

1. **CSS variables** — override in `:root` / `.dark` for global theme changes
2. **Tailwind preset** — extends theme tokens consumed by all components
3. **`classNames` prop** — per-instance slot overrides via arbitrary Tailwind classes

### Release

`semantic-release` publishes automatically on push to `main`. Commit messages must follow Conventional Commits (`feat:`, `fix:`, `BREAKING CHANGE:`) to trigger version bumps and CHANGELOG updates. The `dev` branch is for development; PRs merge to `dev` → `main`.
