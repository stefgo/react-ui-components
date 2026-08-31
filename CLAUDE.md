# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@stefgo/react-ui-components` is a React 19 component library built with TypeScript and Tailwind CSS. It ships as a dual-format (CJS + ESM) npm package published to GitHub Packages. Correctness rests on TypeScript strict mode and ESLint; vitest covers both the pure logic under `src/data/` and the accessible behaviour of the components (labels, ARIA state, keyboard interaction) via Testing Library.

## Commands

```bash
npm run storybook       # the workbench — every visual judgement is made here
npm run build-storybook # static docs
npm run build           # Production build (tsup: CJS, ESM, .d.ts, minified)
npm run dev             # Watch mode build
npm run lint            # tsc --noEmit + eslint
npm test                # vitest (jsdom), pure logic + component behaviour
npm run tokens:build    # regenerate src/index.css from tokens.js
npm run tokens:check    # fails if it is stale
```

Storybook has a **side-by-side** theme mode that renders a story in light and
dark at once. Judge colour changes there, never in a consumer.

CI runs lint, test and build before `semantic-release`.

## Architecture

### Output & Exports

All components are exported as named exports from `src/index.ts`. The build produces `dist/index.js` (CJS), `dist/index.mjs` (ESM) and `dist/index.d.ts`. Only files directly under `src/` become entry points — `src/data/**` and `src/dashboard/**` are bundled into the components that import them. No CSS is bundled — consumers must run Tailwind themselves.

### Tailwind Integration

`tailwind-preset.js` (at repo root) is exported alongside the JS bundle. Consuming apps must include it:

```js
// tailwind.config.js in consumer
presets: [require("@stefgo/react-ui-components/tailwind-preset")],
```

The preset does three things: adds the library's dist files to Tailwind's `content` scanning; extends the theme with the CSS-variable-backed tokens (`primary`, `button-primary`, `badge-success-bg`, …) plus the radius, duration and z-index scales; and emits the token declarations themselves (`:root` and `.dark`) via `addBase`, so consumers need no stylesheet import. It also sets `darkMode: "class"`, matching the `.dark` selector it emits. Without this preset, Tailwind will purge library classes and theming won't work.

**`tokens.js` at the repo root is the single source of truth for every colour default.** The preset builds its colour scale from it, and `scripts/generate-tokens-css.js` generates `src/index.css` from it. Never hard-code a colour literal in the preset or edit `src/index.css` by hand — change `tokens.js` and run `npm run tokens:build`. CI runs `npm run tokens:check`, which fails if the generated file is stale. `tokens.js` must stay in `package.json`'s `files` array, since the published preset requires it.

### Shared behaviour — do not hand-roll a second copy

| Module | Owns |
| --- | --- |
| `hooks/useMenuBehavior.ts` | outside click, Escape, focus movement, focus trap, focus restoration, scroll lock. Used by `ActionMenu`, `UserMenu`, `MobileMoreSheet` and `Modal`. |
| `hooks/usePopoverPosition.ts` | measuring a floating element and keeping it in the viewport, before paint. Used by `ActionMenu` and `Tooltip`. |
| `hooks/useControllableState.ts` | controlled vs. uncontrolled, for every such state. |
| `form/FormField.tsx` + `form/useFieldIds.ts` | label, hint, error and the ARIA wiring between them. Every control sits in one. |

`FormField` encodes one rule worth knowing: an error replaces the hint on screen
**and** in `aria-describedby`, so nothing is announced that is not visible. It
has two layouts — `stacked` for text inputs, `inline` for checkbox, radio and
switch.

Form controls are **restyled native elements**, not divs with ARIA. Arrow-key
navigation in a radio group, the roving tab stop, the checkbox's third state:
all of it is browser behaviour that a reimplementation gets subtly wrong while
still looking fine to a mouse.

`Dashboard` renders navigation, not routing. It highlights the entry matching `currentPath` and renders `children` — deciding what is on screen is the consumer router's job.

### The four conventions

These are the point of the library. A change that breaks one of them is a
regression even if it compiles and the tests pass.

**1. One token per role.** A colour is one class: `bg-card`, not
`bg-card dark:bg-card-dark`. The `.dark` block redefines the variable, so the
class resolves per theme by itself. There should be no `dark:` prefix in `src/`
except for a decoration that genuinely has no light counterpart — there is
exactly one, in `LoginPage`.

**2. Icons are components.** `icon: IconComponent`, never `ReactNode`. Only then
can the surface set the size and `aria-hidden` itself. Sizes on controls are
`'sm' | 'md' | 'lg'`, never a pixel number; `ICON_SIZE` maps the step to the
edge length.

**3. `className` for the root, `classNames` for the slots.** There is no `root`
slot and no `containerClassName` — both were removed because they duplicated
`className`.

**4. Controllable state is `value` / `defaultValue` / `onChange`,** built on
`useControllableState`. Flat on the props when a component has one such state,
grouped under the state's name when it has several. Persistence (localStorage)
is the *default of the uncontrolled variant*, never the only mode.

```typescript
interface ComponentClassNames {
    label?: string;   // named slots only
}

interface ComponentProps extends HTMLAttributes<HTMLElement>, Controllable<boolean> {
    variant?: 'primary' | 'secondary';
    icon?: IconComponent;
    size?: ControlSize;
    className?: string;
    classNames?: ComponentClassNames;
}
```

Always compose classes with **`cn()`** from `src/utils.ts` (`clsx` +
`tailwind-merge`), so a caller's class can override a default instead of
colliding with it.

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

### Theming (three tiers)

1. **CSS variables** — override in `:root` / `.dark` for global theme changes
2. **Tailwind preset** — extends theme tokens consumed by all components
3. **`className` / `classNames`** — per-instance overrides

### Testing

Tests check **behaviour, not structure**: an accessible name, an ARIA state, a
keyboard interaction, a focus destination. That is what let the 3.0 refactors
rename props across the whole library while touching only the prop names inside
the tests — never an assertion.

Three habits worth keeping:

- When a test guards something subtle, **break the implementation once** to
  confirm the test actually fails. A test never seen red proves nothing.
- Prefer a test on the shared module (`FormField`, `useControllableState`) over
  the same test repeated per component.
- `src/conventions.test.ts` greps the source for violations of the four rules
  above. It is not decoration: it has already caught a stale `-dark` class that
  a codemod missed, a `root` slot reintroduced in a new component, and a prop
  that was declared but no longer read. Extend it when you add a rule.

### Release

`semantic-release` publishes automatically on push to `main`. Commit messages must follow Conventional Commits (`feat:`, `fix:`, `BREAKING CHANGE:`) to trigger version bumps and CHANGELOG updates. The `dev` branch is for development; PRs merge to `dev` → `main`.
