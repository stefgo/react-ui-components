# @stefgo/react-ui-components

A premium, modern React UI component library designed for the my projects. Built with React 19, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Modern Aesthetics**: Vibrant colors, dark mode support, and sleek glassmorphism.
- 🧩 **Modular & Reusable**: Atomic components built for high-performance dashboards.
- 🚀 **Automated Releases**: Versioning and publishing via `semantic-release` and Conventional Commits.
- ⚡ **Type-Safe**: Developed entirely in TypeScript with full prop definitions.
- 📱 **Responsive**: Mobile-first design with complex data views that adapt to any screen size.

## Installation

```bash
npm install @stefgo/react-ui-components
```

Note: This package requires `react`, `react-dom` (v19+), and `lucide-react` as peer dependencies.

## Tailwind CSS Integration

To ensure the library's styles are correctly generated in your project, add the library's files to your `tailwind.config.js` content array. The recommended way is using `require.resolve` to handle different environments (Docker/CI):

```javascript
const path = require("path");

// Resolve the UI library's dist path
const uiLibDist = path.join(
  path.dirname(require.resolve("@stefgo/react-ui-components/tailwind-preset")),
  "dist/**/*.{js,mjs}",
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    uiLibDist, // Add library dist files to scanning
  ],
  // ... rest of your config
};
```

## Components

### 🟢 Basic Components

#### `Button`

A versatile button component with loading states and icon support.

- **Variants**: `primary`, `secondary`, `danger`, `ghost`
- **Sizes**: `sm`, `md`, `lg`
- **Props**: Supports all HTML button attributes plus `isLoading` and `icon`.

#### `Input` & `Select`

Form elements designed for consistency and accessibility.

- **Features**: Labels, error states, and icon integration.
- **Select**: Requires an `options` array with `value` and `label`.

#### `Card` & `CardHeader`

Container components for grouping related information.

- **Card**: Provides the consistent rounded, bordered, and shadowed container.
- **CardHeader**: Standard header with optional actions.

#### `StatCard`

A specialized card for displaying key metrics.

- **Props**: `label`, `value`, `sub` (optional), and `icon`.

---

### 📊 Data Visualization

#### `DataTable`

A high-performance table view for structured data.

- **Features**: Sticky headers, row interaction, and custom cell rendering.
- **Config**: Defined via `itemDef` which maps keys to headers and renderers.

#### `DataList`

A mobile-friendly list view that can also be displayed in multiple columns.

- **Features**: Flexible field layout and automatic labeling.

#### `DataMultiView`

The ultimate data grid! Automatically switches between **Table** and **List** mode based on screen size or user preference.

- **Features**: LocalStorage persistence for view mode, built-in search/pagination support.

---

### 📂 Specialized Components

#### `FileBrowser`

A navigation component for browsing remote file systems.

- **Features**: Real-time navigation, breadcrumbs, and directory/file type icons.
- **Type**: Uses the `FsFile` interface for data consistency.

---

### 🛠 Hooks

#### `useActionMenu`

A utility hook for managing the state and positioning of complex dropdown menus or action triggers.

## Design Principles

This library follows a strict design aesthetic:

- **Primary Color**: Proxmox Orange `#E54D0D`.
- **Backgrounds**: Soft grays in light mode, deep charcoals/blacks in dark mode.
- **Interactions**: Subtle scale effects and smooth transitions on hover/click.

## License

MIT
