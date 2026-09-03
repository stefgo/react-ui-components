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
npx commitlint --from origin/main --to HEAD   # the commit messages CI will check
```

Node 22 (`.nvmrc`) and npm 11 (`packageManager` in `package.json`) — both workflows
read those two fields, so the toolchain is declared once. **The npm major matters:**
npm 10 writes the optional peers of `@commitlint/read` into `package-lock.json` and
npm 11 leaves them out, so a lockfile written by one makes `npm ci` fail under the
other. CI installs the pinned npm before `npm ci` for exactly that reason.

Storybook has a **side-by-side** theme mode that renders a story in light and
dark at once. Judge colour changes there, never in a consumer.

`.github/workflows/ci.yml` runs commitlint, `tokens:check`, lint, test, build and
Storybook — on every pull request, and again via `workflow_call` from the release
workflow. The checks live in one file so the two paths cannot drift apart.

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
| `form/FormField.tsx` + `form/useFieldIds.ts` + `form/FieldMessages.tsx` | label, hint, error and the ARIA wiring between them. |

`FormField` encodes one rule worth knowing: an error replaces the hint on screen
**and** in `aria-describedby`, so nothing is announced that is not visible. It
has two layouts — `stacked` for text inputs, `inline` for checkbox, radio and
switch.

Every *single* control sits in a `FormField`. `RadioGroup` is the exception and
has to be: a group is a `<fieldset>` with a `<legend>`, which is what ties the
question to each option's answer — a label above a control cannot do that. It
still shares the wiring (`useFieldIds`) and the two message paragraphs
(`FieldMessages`), so only the layout differs, not the rule.

Form controls are **restyled native elements**, not divs with ARIA. Arrow-key
navigation in a radio group, the roving tab stop, the checkbox's third state:
all of it is browser behaviour that a reimplementation gets subtly wrong while
still looking fine to a mouse.

`Dashboard` renders navigation, not routing. It highlights the entry matching `currentPath` and renders `children` — deciding what is on screen is the consumer router's job.

### The five conventions

These are the point of the library. A change that breaks one of them is a
regression even if it compiles and the tests pass.

**1. One token per role.** A colour is one class: `bg-card`, not
`bg-card dark:bg-card-dark`. The `.dark` block redefines the variable, so the
class resolves per theme by itself. There should be no `dark:` prefix in `src/`
except for a decoration that genuinely has no light counterpart — there is
exactly one, in `LoginPage`.

The rule covers the case where *no* class is written at all: Tailwind's
preflight paints `border-color` on every element from `borderColor.DEFAULT`,
whose stock value is `gray-200`. A bare `border` therefore drew a near-white
line — invisible on a light page, a bright frame in dark mode. The preset points
`borderColor.DEFAULT` at the `border` token, so the untyped case follows the
theme like every typed one.

**2. Icons are components.** `icon: IconComponent`, never `ReactNode`. Only then
can the surface set the size and `aria-hidden` itself. Sizes on controls are
`'sm' | 'md' | 'lg'`, never a pixel number; `ICON_SIZE` maps the step to the
edge length.

**3. `className` for the root, `classNames` for the slots.** There is no `root`
slot and no `containerClassName` — both were removed because they duplicated
`className`.

**4. Focus is an `outline` from `focus.ts`, never a hand-written one.** The
ring is not a `ring`: `ring` is a `box-shadow`, so a surface that also carries
a *selection* ring cannot show both, and `box-shadow` is discarded in
forced-colours mode while an outline survives. `outline-2` alone sets only the
width; without the bare `outline` (`outline-style: solid`) nothing is drawn.

Four constants, and nothing else — a hand-written `outline-*` fails
`conventions.test.ts`:

- `FOCUS_RING` — the default, `focus-visible:` at `outline-offset-2`.
- `FOCUS_RING_INSET` — the same at `outline-offset-[-2px]`, for elements with
  no room around them, where an outward ring is clipped by the neighbour or the
  scroll container (`BottomNav`, `DashboardHeader`, `DataMultiView`,
  `useDataView`).
- `FOCUS_RING_PEER` — the `peer-focus-visible:` form, for `Checkbox` and
  `Radio`, whose visible box is a sibling `<span>`.
- `FOCUS_RING_WITHIN` — the `focus-within:` form, for a composite control where
  the ring belongs to the wrapper rather than to the input inside it (the search
  pill in `DataMultiView`). The input inside carries `FOCUS_RING_NONE`.
- `FOCUS_RING_ERROR` — the same ring in the error colour, for `Button`'s
  `danger` and `outline-danger` variants.

`FOCUS_RING_NONE` (`focus:outline-none`) suppresses the *browser's* ring, and
it is not cosmetic: Chrome draws `outline: auto` as two strokes, a dark one and
a white contrast one outside it, so on a dark surface an unsuppressed ring
reads as a white halo around ours. It belongs on a container that takes focus
programmatically and must not show it (`Modal`, `ActionMenu`, `UserMenu`,
`MobileMoreSheet`), on a menu entry that marks focus with its background, and —
this is the one that is easy to miss — on the `appearance-none` inputs behind
`Checkbox` and `Radio`, which are invisible but still focusable. A second
convention test checks for exactly that.

The ring rule is checked **per element**, not per file: the first version asked
only whether a file mentioned a focus constant somewhere, and `DataMultiView`
passed it while its search input and clear button had none — the constant it
named belonged to the view toggle further up. The test resolves one level of
indirection (a `const` the className names), which is where it stops: it cannot
see that *every* entry of a variant table has a ring, so `Button` is covered by
a rendering test in `focus.test.tsx` instead.

**The ring must not be transitioned.** `transition-all` is literally
`transition-property: all`, and `all` includes `outline-color`, `outline-width`
and `outline-offset`. The ring then animates into place: its colour starts at
the inherited `currentColor` — near-white on a dark surface — and sweeps to
orange while the ring grows out of the element's edge, so clicking a field made
it flash. Focusable elements use Tailwind's default `transition`, whose
property list is explicit and contains no outline; only wrappers that animate
their own size and take no focus (`Collapsible`, the sidebar) keep
`transition-all`. A convention test enforces this per element.

The trigger is `focus-visible:` everywhere, including the form controls: the
ring is a keyboard affordance, and a field that keeps it after a mouse click
just looks stuck. The gap is 2px everywhere; changing it means editing the
strings in `focus.ts`, which are written out in full because Tailwind finds
classes by scanning the built files as text.

**`cn` had to be taught what `outline` means.** `tailwind-merge` 3.x is built
for Tailwind v4, where a bare `outline` is a *width*; on Tailwind v3 it is
`outline-style: solid`. So `cn` read it as a conflict with `outline-2` and
dropped it — in every component, for as long as the ring has existed. Nothing
failed: the CSS rule was emitted, the class just never reached the DOM, and
`outline-style` stayed at the user-agent default `auto`. `auto` is not "no
outline" — it hands the drawing to the browser, which paints its own two-stroke
ring, tinted with our `outline-color` and wrapped in a white contrast stroke.
That was the white frame around the orange ring in dark mode. `utils.ts` moves
the bare `outline` into the style group; `focus.test.ts` asserts each constant
survives `cn` whole. If tailwind-merge or Tailwind is upgraded, check that test
first — it is where the two versions' disagreement shows up.

**Variant tables are module constants, not locals.** Every entry ends in a
`cn()` call, so a table built inside the component runs one tailwind-merge pass
per variant on every render — and `Button` and `ActionButton` are the two
components this library renders most, three of them per row of a data table.
Nothing in those tables depends on a prop, so they are computed once at module
level (`VARIANTS`, `SIZES`, `COLOR_CLASSES`, `PADDINGS`).

There is one place where the same hoist is deliberately *not* done:
`DataMultiView`'s `toggleButtonClass` names `FOCUS_RING_INSET` inline. The
conventions test resolves one level of indirection, so moving the ring into a
module constant puts it out of reach and the button silently stops being
covered — the test proves this by failing the moment you try. Three merges per
render is the cheaper side of that trade.

**`Button` has six variants,** and the two bordered ones exist because two
different apps were building them by hand out of `ghost` plus a border:
`outline` (primary-tinted, for an action that is offered rather than
recommended) and `outline-danger` (neutral at rest, error-coloured on hover,
for a destructive action that must not shout). A caller reaching for
`variant="ghost" className="border …"` is describing a variant that belongs
here instead.

**5. Controllable state is `value` / `defaultValue` / `onChange`,** built on
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

**The whole folder is internal.** `index.ts` re-exports only `data/types` and
the two option interfaces a caller actually passes as props (`SortOptions`,
`TreeExpansionOptions` with `TreeKey`). The views are the API; the pipeline
behind them is not, so it can be reshaped without a breaking change. Nothing in
`src/data/` has a story either — it is covered by vitest, not by eye.

**The invariant:** in client mode `data` is always the *complete* set. The view
filters, sorts and only then takes the current page. A caller that hands over a
pre-sliced page gets a sort that covers that page alone — the defect 2.16.0
shipped and 2.16.1 only half-corrected. The single exception is `pagination.mode: 'server'`, where the
view skips all three stages and the caller supplies `totalItems`.

Counts always come from the stage *after* filtering and *before* slicing, which
is why filtering belongs inside the view rather than in front of it.

**Everything a mouse can do in a data view, a keyboard can do too.** A sortable
column header is a `<button>` inside the `<th>`, and the `<th>` carries
`aria-sort` — a click handler on the `<th>` itself is not reachable by Tab and
announces nothing. Shift is what makes a sort additive, from `Shift+click` and
`Shift+Enter` alike, which is why `handleSortClick` takes a `SortActivation`
(`{ shiftKey }`) rather than a `MouseEvent`. The tree chevrons are buttons with
`aria-expanded`; a leaf renders an inert span, not a disabled button, so it does
not appear in the accessibility tree saying nothing.

`onRowClick` comes from `useDataView`'s `rowActivationProps(item)`, spread onto
the row — once, for all three views. It makes the row focusable and fires on
Enter or Space, and it ignores both clicks and keystrokes that started on a
control *inside* the row: a row action, a link, a checkbox in a cell. The row
deliberately keeps its `row` role instead of taking `role="button"`, which would
cost the reader the column a cell belongs to.

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
- `src/conventions.test.ts` greps the source for violations of the rules
  above. It is not decoration: it has already caught a stale `-dark` class that
  a codemod missed, a `root` slot reintroduced in a new component, and a prop
  that was declared but no longer read. Extend it when you add a rule.

  It also greps for interaction: a `div`, `span`, `th`, `tr`, `td` or `li` with
  an `onClick` and no keyboard path fails the run. An element is genuinely
  mouse-only only when the same action is already on the keyboard elsewhere —
  a backdrop whose dialog closes on Escape. Say so with a
  `// conventions: mouse-only — <reason>` comment on the element; there are two,
  in `Modal` and `MobileMoreSheet`. And no colour literal may appear in `src/`
  or in `tailwind-preset.js`, beyond a neutral black or white shadow.

### Release

`semantic-release` publishes automatically from two branches: `main` gives a stable
release, `dev` gives a prerelease on the `beta` dist-tag (`3.0.0-beta.1`, installed
with `npm i @stefgo/react-ui-components@beta`). Breaking work goes to `dev` first so
a consumer can migrate against a real published version instead of against `main`.
PRs merge to `dev` → `main`.

**The commit message is the only input the version comes from,** so it is checked
like code: commitlint (`@commitlint/config-conventional`) fails a PR whose commits
are not Conventional Commits. A `Fix:` instead of `fix:` produces no release at all
and nothing else would go red. `subject-case` is deliberately off — the subjects are
German and capitalise nouns; the *type* is what decides a release, not the spelling
behind it.

Two details worth keeping:

- `concurrency: release-${{ github.ref }}` with `cancel-in-progress: false`. Two runs
  at once would read the same last tag and compute the same next version; and a run
  cancelled mid-flight leaves a tag without a publish.
- `fetch-depth: 0` on both checkouts. semantic-release needs the full history and all
  tags to find the last release, and commitlint needs the PR's commit range.

The release job has no build step of its own — `prepublishOnly` builds the tarball,
and the `checks` job already built once as a check.
