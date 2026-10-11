import { createContext } from 'react';

/**
 * `field` -- a control of a form. `pill` -- a control in a row of filters, shaped
 * like the search it sits next to.
 */
export type FieldVariant = 'field' | 'pill';

/**
 * The variant a control takes where it is given none. `DataMultiView` sets it
 * around `searchActions`, so a filter in the search bar matches the search
 * without the caller styling it.
 */
export const FieldVariantContext = createContext<FieldVariant>('field');

/**
 * Shape, border and background of a pill: the search of `DataMultiView` and the
 * `pill` variant read it from here, so the two cannot drift apart. Written out
 * in full, because Tailwind finds classes by scanning the built files as text.
 */
export const PILL_SURFACE = "rounded-full border border-border bg-app-bg";
