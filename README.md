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

Import the library's base styles in your main entry point (e.g., `main.tsx` or `App.tsx`):

```tsx
import "@stefgo/react-ui-components/dist/index.css";
```

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

The library uses component-specific tokens defined in `tailwind-preset.js`, which match CSS variables in `index.css`. This allows for central control of the library's appearance.

#### 1. Atomic Components

| Component  | Variant   | Light Token Class     | HEX (Light) | Dark Token Class           | HEX (Dark)  | Refers to    |
| :--------- | :-------- | :-------------------- | :---------- | :------------------------- | :---------- | :----------- |
| **Button** | Primary   | `bg-button-primary`   | `#E54D0D`   | `bg-button-primary`        | `#E54D0D`   | 🔗 `Primary` |
|            | Secondary | `bg-button-secondary` | `#e5e7eb`   | `bg-button-secondary-dark` | `#333333`   | -            |
|            | Danger    | `bg-button-danger`    | `#dc2626`   | `bg-button-danger`         | `#dc2626`   | -            |
| **Badge**  | success   | `bg-badge-success-bg` | `#dcfce7`   | `bg-badge-success-bg-dark` | `#14532d`\* | -            |
|            | warning   | `bg-badge-warning-bg` | `#ffedd5`   | `bg-badge-warning-bg-dark` | `#7c2d12`\* | -            |
|            | info      | `bg-badge-info-bg`    | `#dbeafe`   | `bg-badge-info-bg-dark`    | `#1e3a8a`\* | -            |
| **Input**  | Field     | `bg-input-bg`         | `#f9fafb`   | `bg-input-bg-dark`         | `#111111`   | 🔗 `App Bg`  |
|            | Border    | `border-input-border` | `#e2e8f0`   | `border-input-border-dark` | `#2a2a2a`   | 🔗 `Border`  |
| **Select** | Field     | `bg-input-bg`         | `#f9fafb`   | `bg-input-bg-dark`         | `#111111`   | 🔗 `App Bg`  |

> \* _Dark Badge backgrounds use 30% opacity of the respective color._

#### 2. Layout & Containers

| Component      | Part          | Light Token Class        | HEX (Light) | Dark Token Class              | HEX (Dark)  | Refers to         |
| :------------- | :------------ | :----------------------- | :---------- | :---------------------------- | :---------- | :---------------- |
| **Card**       | Root          | ``                       | `#ffffff`   | `-dark`                       | `#1e1e1e`   | 🔗 `Card Bg`      |
| **CardHeader** | Root          | `header`                 | `#f9fafb`\* | `header-dark`                 | `#252525`\* | 🔗 `App Bg`       |
| **Sidebar**    | Root          | `bg-sidebar-bg`          | `#f9fafb`   | `bg-sidebar-bg-dark`          | `#1a1a1a`   | 🔗 `App Bg`       |
|                | Item (Active) | `bg-sidebar-item-active` | `#ffffff`   | `bg-sidebar-item-active-dark` | `#252525`   | 🔗 `Hover` (Dark) |
| **DashHeader** | Root          | `bg-browser-header`      | `#ffffff`   | `bg-browser-header-dark`      | `#1e1e1e`   | 🔗 `Card Bg`      |

> \* _CardHeader backgrounds use 80% opacity._

#### 3. Data & Utility Components

| Component       | Part    | Light Token Class     | HEX (Light) | Dark Token Class           | HEX (Dark) | Refers to    |
| :-------------- | :------ | :-------------------- | :---------- | :------------------------- | :--------- | :----------- |
| **DataTable**   | Header  | `bg-table-header`     | `#f8fafc`   | `bg-table-header-dark`     | `#252525`  | 🔗 `Surface` |
| **StatCard**    | Root    | `bg-statcard-bg`      | `#ffffff`   | `bg-statcard-bg-dark`      | `#1e1e1e`  | 🔗 `Card Bg` |
|                 | Icon Bg | `bg-statcard-icon-bg` | `#f8fafc`   | `bg-statcard-icon-bg-dark` | `#252525`  | 🔗 `Surface` |
| **FileBrowser** | Content | `bg-input-bg`         | `#f9fafb`   | `bg-input-bg-dark`         | `#111111`  | 🔗 `App Bg`  |
|                 | Header  | `bg-browser-header`   | `#ffffff`   | `bg-browser-header-dark`   | `#1e1e1e`  | 🔗 `Card Bg` |
| **Pagination**  | Root    | `bg-table-header`     | `#f8fafc`   | `bg-table-header-dark`     | `#252525`  | 🔗 `Surface` |

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

**Props:**

- `currentPage`, `totalPages`, `totalItems`
- `onPageChange`: (page) => void
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
- `listDef`: Field definitions for the list.
- `pagination`: Standard pagination object.
- `classNames`: `DataMultiViewClassNames` (includes sub-slots for `card`, `header`, `table`, `list`, `toggleRoot`, `toggleButton`)

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

The top-level shell for your application. Handles Sidebar, Header, and Bottom Navigation automatically.

**Key Props:**

- `pages`: `DashboardPage[]` (Defines navigation and content)
- `username`: string
- `onLogout`: () => void
- `theme`: 'light' | 'dark'
- `onToggleTheme`: () => void
- `isSidebarCollapsed`: boolean
- `classNames`: `DashboardClassNames` (Exhaustive slots for every part of the dashboard layout)

---

## 🛠 Development & Contribution

### Available Scripts

- `npm run build`: Compiles the library using Vite (outputs to `dist/`).
- `npm run lint`: Runs ESLint for code quality.

### Code Style

- Use **TypeScript** for everything.
- Follow the **Feature-First** architecture.
- Use `cn()` utility from `./utils` for all class merging.

---

## 📄 License

MIT © Stefan
