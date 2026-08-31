# @stefgo/react-ui-components

A premium, modern React UI component library designed for the development of high-quality dashboards and web applications. Built with **React 19**, **TypeScript**, and **Tailwind CSS**, it offers a seamless blend of aesthetics, performance, and extreme customizability.

## ✨ Features

- 🎨 **Modern Aesthetics**: Vibrant colors, native dark mode support, and sleek typography.
- 🧩 **Modular & Reusable**: Atomic components built for high-performance dashboards.
- 🚀 **Extreme Customizability**: Three-tier customization system (Backgrounds, Borders, Typography) using CSS Variables and Slot-based `classNames`.
- ⚡ **Type-Safe**: Developed entirely in TypeScript with exhaustive prop and slot definitions.
- 📱 **Responsive**: Mobile-first design. Complex data views (like `DataMultiView`) automatically adapt to screen sizes.
- 🛠 **Internal Utilities**: Leverages `tailwind-merge` and `clsx` for intelligent class resolution.

---

## 🚀 Installation

```bash
npm install @stefgo/react-ui-components
```

### Peer Dependencies

Ensure you have the following peer dependencies installed:

- `react` >= 19.0.0
- `react-dom` >= 19.0.0
- `lucide-react` (for icons)
- `tailwindcss` >= 3.0.0

---

## 🛠 Setup & Integration

### 1. Tailwind CSS Configuration

The library uses a custom Tailwind preset to ensure consistent branding and utility class generation. Add the preset to your `tailwind.config.js`:

```javascript
const path = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Use the library's preset for branding and themes
  presets: [require("@stefgo/react-ui-components/tailwind-preset")],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Essential: Scan library files for utility classes
    path.join(
      path.dirname(require.resolve("@stefgo/react-ui-components")),
      "**/*.js",
    ),
  ],
  // ... your config
};
```

### 2. Global Styles

The package ships no stylesheet — all styling comes from Tailwind via the preset
above. The design tokens (`--ruic-*`) are generated into `src/index.css` of this
repository; copy the `:root` block into your own global stylesheet and change the
values you want. You only need the tokens you actually override — every one has a
built-in default.

---

## 🎨 Customization System

This library is designed to be fully themeable without requiring complex configuration.

### Tier 1: Global Theming (CSS Variables)

Override the core look and feel by redefining internal CSS variables. These are mapped to Tailwind colors (e.g., `bg-primary`, `border-dark`).

| Variable                | Description              | Light Default | Dark Default |
| :---------------------- | :----------------------- | :------------ | :----------- |
| `--ruic-primary`        | Main accent color        | `#E54D0D`     | `#E54D0D`    |
| `--ruic-primary-hover`  | Hover state for primary  | `#ff5f1f`     | `#ff5f1f`    |
| `--ruic-bg-app`         | Main app background      | `#f9fafb`     | `#111111`    |
| `--ruic-bg-card`        | Background for cards     | `#ffffff`     | `#1e1e1e`    |
| `--ruic-surface`        | Sidebar/Nested surfaces  | `#f8fafc`     | `#1a1a1a`    |
| `--ruic-border`         | Global border color      | `#e2e8f0`     | `#2a2a2a`    |
| `--ruic-hover`          | Global hover background  | `#f3f4f6`     | `#252525`    |
| `--ruic-text-primary`   | Headings/Emphasized text | `#111827`     | `#f9fafb`    |
| `--ruic-text-secondary` | Body/Standard text       | `#4b5563`     | `#d1d5db`    |
| `--ruic-text-muted`     | Labels/Inactive text     | `#9ca3af`     | `#71717a`    |

**Example Overriding:**

```css
:root {
  --ruic-primary: #3b82f6; /* Change to Blue */
  --ruic-text-primary: #1e293b; /* Slate-900 */
}
```

### Tier 2: Granular Slot-based Customization

Every component accepts a `classNames` prop. This allows you to inject classes into specific internal elements ("slots"). We use `tailwind-merge` internally, so your classes will intelligently override defaults.

```tsx
<Button
  classNames={{
    root: "rounded-none",
    icon: "text-blue-500",
  }}
>
  Click Me
</Button>
```

---

## 🎨 Component Style Overview

This section provides a comprehensive overview of the components within the library, detailing their centralized background colors and token mappings across light and dark themes.

### Centralized Theme Tokens

Every colour in the library comes from a token defined in **`tokens.js`** — that
file is the single source of truth. It feeds two consumers:

- `tailwind-preset.js` builds its colour scale from it, which is what actually
  renders.
- `scripts/generate-tokens-css.js` generates `src/index.css` from it, which
  documents the defaults for copy-and-paste theming.

`npm run tokens:check` fails the build if the generated CSS is out of date, so
the two can no longer disagree.

**For the current values, read [`src/index.css`](./src/index.css)** — it is
generated, always accurate, and grouped by concern. Overriding is a matter of
redefining the variables you care about:

```css
:root {
  /* RGB triple – Tailwind needs it raw for opacity utilities like bg-primary/20 */
  --ruic-primary: 12 34 56;
  --ruic-primary-hover: 20 50 80;

  --ruic-bg-card: #ffffff;
  --ruic-bg-card-dark: #141414;
}
```

Many tokens are *aliases*: `--ruic-input-bg` defaults to
`var(--ruic-bg-app, #f9fafb)`, so overriding `--ruic-bg-app` also moves every
input. Override the specific token instead when you want to break that link.

### Layering

The library ships one z-index scale so overlays cannot end up behind each other:

| Class          | Value | Used by                          |
| :------------- | :---- | :------------------------------- |
| `z-sticky`     | 10    | sticky table headers             |
| `z-header`     | 30    | `DashboardHeader`                |
| `z-bottomnav`  | 40    | `BottomNav`                      |
| `z-dropdown`   | 50    | `ActionMenu`, `UserMenu`         |
| `z-overlay`    | 60    | modal backdrops                  |
| `z-modal`      | 70    | reserved for consumer dialogs    |

### Reduced motion

All library animations are disabled under
`@media (prefers-reduced-motion: reduce)` by the preset — no `motion-safe:`
prefixes needed at the call site.

---

## 📚 Component Reference

### 🟢 Foundational Components

#### `Button`

A versatile button with loading states and icon support.

**Props:**

- `variant`: `primary` | `secondary` | `danger` | `ghost`
- `size`: `sm` | `md` | `lg`
- `isLoading`: boolean (shows a spinner)
- `icon`: ReactNode
- `classNames`: `ButtonClassNames` (`root`, `icon`, `spinner`)

#### `Badge`

Compact label for status or counts.

**Props:**

- `variant`: `success` | `warning` | `error` | `info` | `gray`
- `size`: `sm` | `md`
- `classNames`: `BadgeClassNames` (`root`)

#### `Card` & `CardHeader`

Standard containers for dashboard widgets.

**Card Props:**

- `classNames`: `CardClassNames` (`root`)

**CardHeader Props:**

- `title`: ReactNode
- `action`: ReactNode (rendered on the right)
- `classNames`: `CardHeaderClassNames` (`root`, `title`, `action`)

#### `Input` & `Select`

Standard form elements with full Tailwind integration and error handling.

**Input Props:**

- `label`: string
- `error`: string
- `icon`: ReactNode
- `fullWidth`: boolean (default: true)
- `classNames`: `InputClassNames` (`root`, `label`, `inputWrapper`, `input`, `icon`, `error`)

**Select Props:**

- `label`: string
- `error`: string
- `options`: `{ value, label, disabled }[]`
- `classNames`: `SelectClassNames` (`root`, `label`, `selectWrapper`, `select`, `error`)

#### `StatCard`

A specialized card for displaying key metrics with an icon.

**Props:**

- `label`: string
- `value`: string
- `sub`: string (optional)
- `icon`: ReactNode
- `classNames`: `StatCardClassNames` (`root`, `labelWrapper`, `label`, `value`, `iconWrapper`, `icon`, `sub`)

#### `ActionButton` & `ActionMenu`

Internal components used for row actions but available for standalone use.

**ActionButton Props:**

- `icon`: ComponentType
- `color`: `green` | `blue` | `red` | `orange` | `gray` | `indigo`
- `variant`: `solid` | `ghost`
- `classNames`: `ActionButtonClassNames` (`root`, `icon`)

**ActionMenu Props:**

- `isOpen`: boolean
- `position`: `{ x, y }`
- `classNames`: `ActionMenuClassNames` (`overlay`, `root`)

---

### 🗺 Layout & Navigation

#### `BottomNav`

Mobile navigation bar.

**Props:**

- `items`: `{ id, icon, active, onClick }[]`
- `classNames`: `BottomNavClassNames` (`root`, `item`, `itemActive`, `itemInactive`)

#### `Collapsible`

Animated disclosure component.

**Props:**

- `title`: ReactNode
- `initiallyExpanded`: boolean
- `classNames`: `CollapsibleClassNames` (`root`, `header`, `titleWrapper`, `icon`, `content`)

#### `PaginationControls`

Standard pagination bar for data views.

Rendered automatically by every data view that gets a `pagination` prop — you
rarely need it directly.

**Props:**

- `page` (1-based), `totalPages`, `pageSize`, `totalItems` — `-1` for an unknown total
- `onPageChange`: (page) => void
- `onPageSizeChange`: (size) => void
- `pageSizeOptions`: number[] — default `[10, 20, 50]`
- `hideOnSinglePage`: boolean — default `false`
- `classNames`: `PaginationControlsClassNames` (`root`, `infoWrapper`, `select`, `pageInfo`, `controlsWrapper`, `button`, `pageText`)

---

### 📊 Data Visualization

#### `DataTable<T>`

High-performance table with sticky headers.

**Slots (`DataTableClassNames`):**
`root`, `table`, `thead`, `headerRow`, `th`, `tbody`, `tr`, `td`, `placeholderTd`

#### `DataList<T>`

A responsive list view that can be displayed as a single column or multiple columns.

**Slots (`DataListClassNames`):**
`listRoot`, `placeholder`, `row`, `colWrapper`, `column`, `itemWrapper`, `labelWrapper`, `label`, `value`

#### `DataMultiView<T>`

The standard for dashboard data. It automatically switches between Table and List view based on screen size or user preference (persisted in SessionStorage).

**Key Props:**

- `tableDef`: Column definitions for the table.
- `listColumns`: Column definitions for the list view.
- `pagination`: See [Pagination](#-pagination).
- `searchable` / `searchFilter`: Built-in search; the filter runs inside the view,
  so the page count always matches what is on screen.
- `classNames`: `DataMultiViewClassNames` (includes sub-slots for `card`, `header`, `table`, `list`, `toggleRoot`, `toggleButton`)

---

### 🔢 Pagination

Every data view (`DataTable`, `DataList`, `DataTreeTable`, `DataMultiView`) can
page itself. **Pass the complete data set** — the view filters, sorts and *then*
takes the current page, which is the only order that sorts the whole table
rather than the rows that happen to be on screen.

```tsx
<DataTable data={rows} itemDef={cols} keyField="id" pagination />
```

Defaults: page 1, 10 rows per page, options `[10, 20, 50]`.

**Configured:**

```tsx
pagination={{ defaultValue: { pageSize: 25 }, pageSizeOptions: [25, 50, 100] }}
```

**State held outside** (URL sync, reset from elsewhere) — `value` + `onChange`:

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

**Options**

| Prop | Default | Meaning |
| --- | --- | --- |
| `mode` | `'client'` | `'server'` when `data` is already one page |
| `value` / `onChange` | — | hold the state outside the view |
| `defaultValue` | `{ page: 1, pageSize: 10 }` | starting values while the view holds it |
| `pageSizeOptions` | `[10, 20, 50]` | choices in the dropdown |
| `totalItems` | — | required for `mode: 'server'`; `-1` = unknown |
| `hideOnSinglePage` | `false` | hide the bar while everything fits on one page |
| `autoResetPage` | `true` | back to page 1 when `data` or `filterKey` changes |

**Filtering.** Pass `filter` (a predicate) together with `filterKey` (a stable
value identifying it, typically the search query). The filter runs before the
count, so the numbers in the bar always describe the rows on screen.
`DataMultiView` wires both up for you from `searchFilter`.

**Trees.** `DataTreeTable` pages its **root nodes**: `totalItems` counts roots,
and the children of the roots on a page are shown along with them. Counting
rendered rows instead would make a page's length depend on what is expanded.

---

### 📂 Specialized Components

#### `FileBrowser`

Navigate remote or local file structures.

**Props:**

- `currentPath`: string
- `files`: `FsFile[]`
- `isLoading`: boolean
- `onNavigate`: (path: string) => void
- `classNames`: `FileBrowserClassNames` (`root`, `header`, `backButton`, `pathDisplay`, `content`, `item`, `itemFolder`, `itemFile`, `folderIcon`, `fileIcon`, `loading`, `empty`)

#### `Dashboard`

The top-level shell: header, sidebar, bottom nav and the mobile overflow sheet.

`Dashboard` renders **navigation**, not routing. It highlights the entry matching
`currentPath` and leaves the question of what is on screen to your router — pass
the current page as `children`.

**Key Props:**

- `pages`: `DashboardPage[]` — navigation declaration (`id`, `path`, `active?`, `nav`)
- `children`: the current page's content, normally your router's outlet
- `navGroups`: `DashboardNavGroup[]` — optional grouping for the sidebar
- `currentPath`: string — used only to decide which entry is highlighted
- `mobileMore`: `{ title?, icon? }` — heading of the mobile overflow sheet
- `username`, `onLogout`, `theme`, `onToggleTheme`, `isSidebarCollapsed`, `onToggleSidebar`
- `classNames`: `DashboardClassNames`

```tsx
<Dashboard pages={pages} navGroups={navGroups} currentPath={location.pathname} /* … */>
  <Routes>
    <Route path="/clients" element={<Clients />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</Dashboard>
```

> **Migrating from 2.x** — `DashboardPage.content` is gone; move the content into
> your own routes and pass them as `children`. The legacy `mobileMoreMenu` and
> `mobileMenuOverlay` props are gone too; use `mobileMore` and
> `nav.placement: 'mobile-more'`. When no page matches, nothing is highlighted —
> 2.x silently fell back to the first page, which meant an unknown URL rendered
> page one. Give your router an explicit catch-all route.

---

## 🛠 Development & Contribution

### Available Scripts

- `npm run build`: Compiles the library with tsup (outputs to `dist/`).
- `npm run lint`: Type-checks with `tsc` and runs ESLint.
- `npm test`: Runs vitest (jsdom) over the pure logic and component behaviour.
- `npm run tokens:build`: Regenerates `src/index.css` from `tokens.js`.
- `npm run tokens:check`: Fails if the generated CSS is out of date.

### Code Style

- Use **TypeScript** for everything.
- Follow the **Feature-First** architecture.
- Use `cn()` utility from `./utils` for all class merging.

---

## 📄 License

MIT © Stefan
