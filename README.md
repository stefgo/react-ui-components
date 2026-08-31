# @stefgo/react-ui-components

A React 19 component library for dashboards, built with TypeScript and Tailwind CSS.

It is a design system rather than a component collection: one token per role,
one size scale, one way to pass an icon, one way to hold state, and one
`FormField` behind every control. The differences between components are the
ones that matter; the rest is decided once.

## Features

- **One decision per concern** — colour, radius, motion, layering and control
  sizes each come from a single scale, not from whatever the file needed.
- **Accessible by construction** — dialogs trap focus and return it, menus follow
  the WAI-ARIA pattern, every control is labelled and describable, and
  animations honour `prefers-reduced-motion`.
- **Themeable without a build step** — every colour is a CSS custom property with
  a default; override the ones you care about.
- **No stylesheet to import** — the Tailwind preset emits the tokens itself.
- **Type-safe** — TypeScript strict mode, exhaustive prop and slot types.
- **A workbench** — Storybook with a light/dark side-by-side mode and axe
  running on every story.

---

## Installation

```bash
npm install @stefgo/react-ui-components
```

### Peer dependencies

- `react` ≥ 19.0.0
- `react-dom` ≥ 19.0.0
- `lucide-react`
- `tailwindcss` ≥ 3.4

---

## Setup

### Tailwind

Add the preset. It maps the tokens onto utilities, adds the library's `dist`
files to `content` scanning, and emits the token declarations as base styles.

```javascript
const path = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@stefgo/react-ui-components/tailwind-preset")],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    path.join(
      path.dirname(require.resolve("@stefgo/react-ui-components")),
      "**/*.js",
    ),
  ],
};
```

Without the preset, Tailwind purges the library's classes and nothing is themed.

### Stylesheet

There is none, and none is needed. The preset injects `:root` and `.dark` through
Tailwind's `addBase`, so the tokens arrive through your own Tailwind build. There
is no import step to forget.

[`src/index.css`](./src/index.css) in this repository is generated from
`tokens.js` and exists as a readable reference — it is not shipped.

### Dark mode

The preset sets `darkMode: "class"`. Put `dark` on `<html>` (or any ancestor) and
every token switches. Override it in your own config if you need something else.

---

## Conventions

Four rules hold across the whole library. They are what makes it a system.

### Icons are components, never elements

```tsx
<Button icon={Save}>Save</Button>          // yes
<Button icon={<Save size={16} />}>…</Button>  // no
```

Only the component form lets the surface decide the size and set `aria-hidden`
itself. With elements every caller has to know both, and every caller answers
differently.

The type is `IconComponent` (`ComponentType<IconProps>`), a deliberate subset of
`lucide-react`'s `LucideProps` — every lucide icon satisfies it, and so does a
hand-written SVG component.

### Sizes are `sm | md | lg`

`Button`, `ActionButton` and `Badge` take the same three steps. `ICON_SIZE` maps
each step to the icon edge length that goes with it.

Navigation and display surfaces (`Sidebar`, `BottomNav`, `StatCard`) size their
icons from their own layout instead. They are not sized controls, and a prop
with one sensible value is worse than no prop.

### `className`, not `classNames.root`

`className` goes on the root element. `classNames` addresses the named slots
*inside* it — `label`, `icon`, `header`, and so on. There is no `root` slot,
because that is what `className` already is.

### State is `value` / `defaultValue` / `onChange`

Pass `value` and the state is yours: the component reads it and reports every
change through `onChange`, but never writes it. Pass neither and the component
keeps the state itself, seeded from `defaultValue`.

```tsx
<Collapsible title="Details" defaultValue>…</Collapsible>          // it owns the state
<Collapsible title="Details" value={open} onChange={setOpen}>…</Collapsible>  // you do
```

Where a component has exactly one such state the three props sit flat on it.
Where it has several they are grouped under the state's own name:

```tsx
<DataMultiView
    search={{ value: query, onChange: setQuery }}
    viewMode={{ value: view, onChange: setView }}
    pagination={{ defaultValue: { pageSize: 25 } }}
/>
```

`useControllableState` implements this and is exported, so consumer components
can follow the same convention.

---

## Theming

### Tokens

Every colour comes from a token in **`tokens.js`**, the single source of truth.
It feeds the Tailwind preset (which renders) and
`scripts/generate-tokens-css.js` (which documents). `npm run tokens:check` fails
the build if the two disagree.

**One token carries both themes.** There are no `-dark` variants and no `dark:`
classes at the call site:

```css
:root { --ruic-text-secondary: #4b5563; }
.dark { --ruic-text-secondary: #d1d5db; }
```

```tsx
<p className="text-text-secondary">…</p>   // resolves per theme by itself
```

Override by redefining the variables you care about. Only what actually differs
needs a `.dark` entry:

```css
:root {
  /* Raw RGB triple — Tailwind needs it for opacity utilities like bg-primary/20 */
  --ruic-primary: 12 34 56;
  --ruic-bg-card: #ffffff;
}
.dark {
  --ruic-bg-card: #0b0b0b;
}
```

Many tokens are **aliases**: `--ruic-input-bg` defaults to `var(--ruic-bg-app)`,
so moving the app background moves every input with it. Override the specific
token to break that link.

#### Brand

| Token | Light | Dark |
| :--- | :--- | :--- |
| `--ruic-primary` | `229 77 13` | same |
| `--ruic-primary-hover` | `255 95 31` | same |

#### Semantic state

| Token | Light | Dark |
| :--- | :--- | :--- |
| `--ruic-error` | `#dc2626` | `#f87171` |
| `--ruic-error-hover` | `#b91c1c` | same |
| `--ruic-error-bg` | `#fef2f2` | `rgba(127, 29, 29, 0.3)` |
| `--ruic-success` | `#16a34a` | `#4ade80` |
| `--ruic-success-hover` | `#15803d` | same |
| `--ruic-warning` | `#ea580c` | `#fb923c` |
| `--ruic-warning-hover` | `#c2410c` | same |
| `--ruic-warning-bg` | `#ffedd5` | `rgba(124, 45, 18, 0.3)` |
| `--ruic-info` | `#2563eb` | `#60a5fa` |
| `--ruic-info-hover` | `#1d4ed8` | `#93c5fd` |
| `--ruic-accent` | `#4f46e5` | `#818cf8` |
| `--ruic-accent-hover` | `#4338ca` | same |
| `--ruic-accent-bg` | `#eef2ff` | `rgba(49, 46, 129, 0.3)` |

#### Surfaces and typography

| Token | Light | Dark |
| :--- | :--- | :--- |
| `--ruic-bg-app` | `#f9fafb` | `#111111` |
| `--ruic-bg-card` | `#ffffff` | `#141414` |
| `--ruic-bg-card-header` | `#f3f4f6` | `#181818` |
| `--ruic-overlay` | `rgba(0, 0, 0, 0.6)` | same |
| `--ruic-text-primary` | `#111827` | `#f9fafb` |
| `--ruic-text-secondary` | `#4b5563` | `#d1d5db` |
| `--ruic-text-muted` | `#808080` | same |
| `--ruic-border` | `#e2e8f0` | `#2a2a2a` |
| `--ruic-hover` | `#f3f4f6` | `#252525` |

#### Component tokens

Buttons, badges, inputs, sidebar, tables, `StatCard` and `DashboardHeader` each
have their own group, most of them aliases onto the surfaces above.
**[`src/index.css`](./src/index.css) is generated and therefore always
accurate** — read it for the full list.

### Shape and motion

| Scale | Values | Applies to |
| :--- | :--- | :--- |
| `rounded-*` | `sm` `md` `lg` `xl` `full` | containers `lg`, controls and overlays `md`, pills `full` |
| `duration-*` | `fast` 150 · `base` 200 · `slow` 300 | every transition |

These override Tailwind's own steps on purpose, so `rounded-lg` means the same
thing everywhere.

### Layering

| Class | Value | Used by |
| :--- | :--- | :--- |
| `z-sticky` | 10 | sticky table headers |
| `z-header` | 30 | `DashboardHeader` |
| `z-bottomnav` | 40 | `BottomNav` |
| `z-dropdown` | 50 | `ActionMenu`, `UserMenu`, `Tooltip` |
| `z-overlay` | 60 | `MobileMoreSheet` |
| `z-modal` | 70 | `Modal`, `ConfirmDialog`, toasts |

### Slot overrides

Every component takes `classNames` for its named inner elements.
`tailwind-merge` runs internally, so your classes win over the defaults.

```tsx
<Input
  className="max-w-xs"
  classNames={{ label: "normal-case", input: "font-mono" }}
/>
```

---

## Component reference

### Foundational

#### `Button`

- `variant`: `primary` | `secondary` | `danger` | `ghost`
- `size`: `sm` | `md` | `lg`
- `isLoading`: shows a spinner and disables the button
- `icon`: `IconComponent`
- `classNames`: `icon`, `spinner`

#### `Badge`

- `variant`: `success` | `warning` | `error` | `info` | `neutral`
- `size`: `sm` | `md` | `lg`

#### `Card`

- `title`, `action` (rendered right), `titleAs` (heading level, or `div` to stay
  out of the document outline)
- `classNames`: `header`, `headerTitle`, `headerAction`

#### `StatCard`

- `label`, `value`, `sub`, `icon`: `IconComponent`, `onClick`
- Renders a real `<button>` when `onClick` is given, so it is reachable by keyboard.

#### `ActionButton`

An icon-only button. `tooltip` does two jobs: it becomes the accessible name and
the visible `Tooltip`. Pass `aria-label` to name it differently.

- `icon`: `IconComponent`, `size`: `sm` | `md` | `lg`
- `color`: `green` | `blue` | `red` | `orange` | `gray` | `indigo` | `error`
- `variant`: `solid` | `ghost`
- `disabled`: `boolean | (() => boolean)`
- `tooltip`: `string | { enabled, disabled }`

#### `ActionMenu`

A portalled dropdown following the WAI-ARIA menu pattern.

- `isOpen`, `onClose`, `anchor`: `AnchorRect` — use `useActionMenu` to produce it
- `triggerRef`: focus returns here on close

---

### Forms

All of them are built on `FormField`, which owns the label, the hint, the error
message and the ARIA wiring that ties them together. They therefore behave and
align identically.

#### `FormField`

- `label`, `hint`, `error`, `required`, `id`, `describedBy`
- `layout`: `stacked` (label above) | `inline` (label beside, for checkbox/radio/switch)
- `children`: a render prop receiving `{ id, describedBy, invalid, … }`

Use it directly to wrap a control the library does not have:

```tsx
<FormField label="Cron expression" hint="Five fields, UTC." error={error}>
  {(ids) => (
    <input id={ids.id} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />
  )}
</FormField>
```

The rule it encodes: an error replaces the hint on screen **and** in
`aria-describedby`, so nothing is announced that is not visible.

#### `Input`

- `label`, `hint`, `error`, `icon`: `IconComponent`, `fullWidth`
- `classNames`: `label`, `control`, `input`, `icon`, `error`, `hint`

#### `Select`

- `label`, `hint`, `error`, `options`: `{ value, label, disabled? }[]`, `fullWidth`
- `classNames`: `label`, `control`, `select`, `error`, `hint`

#### `Textarea`

- `label`, `hint`, `error`, `rows` (default 4), `fullWidth`
- Resizes vertically only — horizontal resizing breaks the form it sits in.

#### `Checkbox`

- `label`, `hint`, `error`, `indeterminate`
- A restyled native `<input type="checkbox">`, so keyboard and form behaviour are
  the browser's. `indeterminate` is the third state, for a "select all" box over
  a partial selection.

#### `Radio` and `RadioGroup`

```tsx
<RadioGroup label="Schedule" value={schedule} onChange={setSchedule}>
  <Radio value="daily" label="Daily" />
  <Radio value="weekly" label="Weekly" />
</RadioGroup>
```

- `RadioGroup`: `label`, `hint`, `error`, `required`, `disabled`, `name`,
  `orientation`, plus `value` / `defaultValue` / `onChange`
- A real `<fieldset>` with a `<legend>`. Without it a screen reader announces
  "Daily, radio button" and never says what is being chosen.
- One tab stop for the group, arrow keys within it — native behaviour, kept.

#### `Switch`

- `label`, `hint`, `error`, plus `value` / `defaultValue` / `onChange`
- `role="switch"`, not a checkbox: a switch *is* the action, a checkbox states an
  intention that a later submit carries out. Screen readers announce them
  differently.

---

### Overlays and feedback

#### `Modal`

Focus is trapped inside, Escape closes it, the page behind does not scroll, and
focus returns to whatever opened it.

- `isOpen`, `onClose`, `title` (required — an unnamed dialog is unusable)
- `description` — wired to `aria-describedby`
- `footer` — actions, pinned below the body
- `size`: `sm` | `md` | `lg` | `xl` | `full`
- `closeOnOverlayClick` (default `true`) — turn it off for a form with unsaved input
- `hideCloseButton`, `closeLabel`

#### `ConfirmDialog`

A `Modal` with the two buttons every confirmation needs.

- `onConfirm`, `confirmLabel`, `cancelLabel`
- `variant`: `primary` | `danger`
- `isConfirming` — spinner on confirm, both buttons blocked

#### `Toast`

The one component that needs a provider: toasts are raised from event handlers
and request callbacks, i.e. from outside the tree that shows them.

```tsx
<ToastProvider placement="bottom-right" duration={5000} limit={4}>
  <App />
</ToastProvider>

const { show, dismiss, dismissAll } = useToast();
show({ title: "Backup started", description: "pbs-node-01", variant: "success" });
```

- `variant`: `info` | `success` | `warning` | `error` — errors interrupt
  (`role="alert"`); everything else waits politely
- `duration`: milliseconds, `0` keeps it until dismissed
- `action`: `{ label, onClick }` — runs, then dismisses
- The countdown pauses on hover and focus and resumes with the time that was
  left, not a fresh one.

#### `Tooltip`

Replaces the native `title`, which cannot be styled, does not exist on touch
devices and is announced inconsistently.

- `content`, `placement`: `top` | `bottom` | `left` | `right`, `delay`, `disabled`
- Takes exactly one element as its child and describes it via
  `aria-describedby` — it never renames it. A control with no visible label still
  needs an `aria-label`, because a tooltip that fails to open leaves it unnamed.
- Opens immediately on focus, after `delay` on hover, and closes on Escape.

---

### Layout and navigation

#### `Collapsible`

- `title`, plus `value` / `defaultValue` / `onChange`
- Animates `grid-template-rows` from `0fr` to `1fr`, so arbitrarily tall content
  is never cut off. Collapsed content is `inert` — out of the tab order and off
  the accessibility tree.

#### `Sidebar` and `BottomNav`

- `Sidebar`: `groups` — `{ title?, items }`, each item with `icon: IconComponent`
- `BottomNav`: `items` — the same item shape, flat
- Each surface picks its own icon size; there is no `size` prop to get wrong.

#### `Dashboard`

The top-level shell: header, sidebar, bottom nav and the mobile overflow sheet.

It renders **navigation, not routing**. It highlights the entry matching
`currentPath` and leaves what is on screen to your router.

```tsx
<Dashboard pages={pages} navGroups={navGroups} currentPath={location.pathname} /* … */>
  <Routes>
    <Route path="/clients" element={<Clients />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</Dashboard>
```

- `pages`: `DashboardPage[]` — `id`, `path`, `active?`, `nav`
- `navGroups`, `currentPath`, `mobileMore`: `{ title?, icon? }`
- `username`, `onLogout`, `theme`, `onToggleTheme`, `isSidebarCollapsed`, `onToggleSidebar`

#### `PaginationControls`

Rendered automatically by every data view with a `pagination` prop; rarely needed
directly.

---

### Data views

`DataTable`, `DataList`, `DataTreeTable` and `DataMultiView` share one pipeline.

#### Sorting and expansion

```tsx
<DataTable sort={{ defaultValue: [{ colIndex: 0, direction: 'asc' }], storageKey: 'clients' }} />
<DataTreeTable expanded={{ all: true }} />
```

Both follow the state convention. `storageKey` persists the choice **while
uncontrolled** — it is the default of that variant, not a second mode; a
controlled caller decides for itself.

#### Keyboard and screen readers

Sorting and expansion are not mouse-only:

| Action | Mouse | Keyboard |
| --- | --- | --- |
| Sort by a column | click the header | `Enter` / `Space` on the header button |
| Add a column to the sort | `Shift`+click | `Shift`+`Enter` |
| Expand or collapse a tree row | click the chevron | `Enter` on the chevron button |
| Expand or collapse everything | click the header chevron | `Enter` on it |
| `onRowClick` | click the row | `Enter` / `Space` on the focused row |

A sortable `<th>` carries `aria-sort`, the chevrons carry `aria-expanded`, and a
row with `onRowClick` is focusable. Clicks and keystrokes that start on a control
*inside* a row — a `DataAction` menu, a link, a checkbox in a cell — belong to
that control and no longer fire `onRowClick` as well.

New `classNames` slot on both tables: `sortButton`, for the header's button.

#### `DataMultiView<T>`

Switches between table, list and tree view.

- `tableDef`, `listColumns`, `treeTableDef`, `getChildren`
- `search`: `Controllable<string>` + `searchable` / `searchFilter`
- `viewMode`: `Controllable<'table' | 'list' | 'tree'>` + `storageKey`
- `treeExpanded`, `sort`, `pagination`

---

### Pagination

Every data view can page itself. **Pass the complete data set** — the view
filters, sorts and *then* takes the current page, which is the only order that
sorts the whole table rather than the rows that happen to be on screen.

```tsx
<DataTable data={rows} itemDef={cols} keyField="id" pagination />
```

Defaults: page 1, 10 rows per page, options `[10, 20, 50]`.

**Configured:**

```tsx
pagination={{ defaultValue: { pageSize: 25 }, pageSizeOptions: [25, 50, 100] }}
```

**State held outside** (URL sync, reset from elsewhere):

```tsx
const page = usePagination({ pageSize: 25 });
<DataTable data={rows} pagination={{ ...page.props }} />
```

**Server-side paging** — `data` is already the current page, so the view neither
sorts nor slices, and the total has to be supplied (`-1` if unknown):

```tsx
pagination={{
    mode: 'server',
    value: { page, pageSize },
    onChange: fetchPage,
    totalItems: total,
}}
```

| Prop | Default | Meaning |
| --- | --- | --- |
| `mode` | `'client'` | `'server'` when `data` is already one page |
| `value` / `onChange` | — | hold the state outside the view |
| `defaultValue` | `{ page: 1, pageSize: 10 }` | starting values while the view holds it |
| `pageSizeOptions` | `[10, 20, 50]` | choices in the dropdown |
| `totalItems` | — | required for `mode: 'server'`; `-1` = unknown |
| `hideOnSinglePage` | `false` | hide the bar while everything fits on one page |
| `autoResetPage` | `true` | back to page 1 when `data` or `filterKey` changes |

**Filtering.** Pass `filter` (a predicate) with `filterKey` (a stable value
identifying it, typically the query). The filter runs before the count, so the
numbers in the bar always describe the rows on screen. `DataMultiView` wires both
up from `searchFilter`.

**Trees.** `DataTreeTable` pages its **root nodes**: `totalItems` counts roots,
and the children of the roots on a page are shown with them. Counting rendered
rows would make a page's length depend on what is expanded.

---

## Migrating from 2.x to 3.0

Five groups of changes. Each is mechanical, and TypeScript points at every call
site — there is no silent behaviour change to hunt for.

### 1. Colour tokens

`-dark` tokens are gone. One token carries both values.

```diff
- <div className="bg-card dark:bg-card-dark text-text-primary dark:text-text-primary-dark">
+ <div className="bg-card text-text-primary">
```

If you overrode tokens, move the dark values into a `.dark` block:

```diff
  :root {
    --ruic-bg-card: #ffffff;
-   --ruic-bg-card-dark: #0b0b0b;
  }
+ .dark { --ruic-bg-card: #0b0b0b; }
```

Also gone: `--ruic-info-light`, whose value is now the dark value of
`--ruic-info-hover`. New: `--ruic-badge-neutral-bg` and
`--ruic-badge-neutral-text`.

The preset now sets `darkMode: "class"` itself — remove yours unless it differs.

### 2. Icons, sizes and class names

```diff
- <Button icon={<Save size={16} />}>Save</Button>
+ <Button icon={Save}>Save</Button>

- <ActionButton icon={Play} size={20} />
+ <ActionButton icon={Play} size="lg" />

- <Card classNames={{ root: "rounded-none" }} />
+ <Card className="rounded-none" />

- <DataTable containerClassName="flex-1" />
+ <DataTable className="flex-1" />
```

Affects `icon` on `Button`, `Input`, `Sidebar`, `BottomNav`, `StatCard`,
`Dashboard.mobileMore` and `MobileMoreSheet`.

`Badge.variant="gray"` is now `"neutral"`. `BadgeClassNames`,
`ActionMenuClassNames` and `DataActionClassNames.menu` are gone — `root` was
their only live slot. `InputClassNames.inputWrapper` and
`SelectClassNames.selectWrapper` are both `control` now.

### 3. State props

```diff
- <Collapsible initiallyExpanded expanded={open} onExpandedChange={setOpen} />
+ <Collapsible defaultValue value={open} onChange={setOpen} />

- <DataTable defaultSort={{ colIndex: 0, direction: 'asc' }} sortStorageKey="clients" />
+ <DataTable sort={{ defaultValue: [{ colIndex: 0, direction: 'asc' }], storageKey: 'clients' }} />

- <DataTreeTable defaultExpanded />
+ <DataTreeTable expanded={{ all: true }} />

- <DataMultiView viewModeStorageKey="clients" defaultSearchValue="" onSearchChange={setQuery} />
+ <DataMultiView viewMode={{ storageKey: 'clients' }} search={{ onChange: setQuery }} />
```

`useSortColumns` and `useTreeExpansion` take their options in the same shape.

### 4. Dashboard renders navigation, not routing

`DashboardPage.content` is gone: move the content into your own routes and pass
them as `children`. `mobileMoreMenu` and `mobileMenuOverlay` are gone too — use
`mobileMore` and `nav.placement: 'mobile-more'`.

When no page matches `currentPath`, **nothing** is highlighted. 2.x silently fell
back to the first page, which meant an unknown URL rendered page one. Give your
router an explicit catch-all route.

`usePagination` no longer returns a slice of the data. Handing a view one page
and letting it sort is what produced sorts covering only the current page; the
view now filters, sorts and slices itself, in that order.

### 5. Menus

`ActionMenu` takes an anchor rectangle instead of a coordinate pair, and
`useActionMenu` supplies it:

```diff
- <ActionMenu position={{ x: menuState.x, y: menuState.y, top: menuState.top }} />
+ <ActionMenu anchor={menuState?.anchor ?? null} />
```

`ActionButton` no longer sets a native `title`; the visible hint comes from a
real `Tooltip` and the accessible name from `aria-label`. Nothing to change
unless you were styling `[title]`.

### What you can now delete

Hand-built modals, confirmation dialogs, toasts, checkboxes, radio groups,
switches and textareas. See the reference above.

---

## Development

```bash
npm run storybook       # the workbench; the a11y panel must be clean per story
npm run build-storybook # static docs
npm run lint            # tsc --noEmit + eslint
npm test                # vitest (jsdom)
npm run tokens:build    # regenerate src/index.css from tokens.js
npm run tokens:check    # fails if it is stale
npm run build           # tsup: CJS, ESM, .d.ts
```

Storybook has a **side-by-side** theme mode that renders a story in light and
dark next to each other. That is where colour changes are judged.

### Code style

- TypeScript everywhere, 4-space indentation.
- Compose classes with `cn()` from `src/utils.ts` — never string concatenation.
- Follow the four conventions above. A new component that invents a fifth way to
  pass an icon or hold state is the thing this library exists to prevent.

---

## License

MIT © Stefan
