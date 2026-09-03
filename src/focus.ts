/**
 * The focus ring, defined once.
 *
 * Two things went wrong while every component spelled its own: the gap between
 * the control and the ring came in four widths (0, 1, 2 and -2px), and half the
 * components used `focus:` where the other half used `focus-visible:`, so the
 * same library drew a ring on mouse clicks in some places and not in others.
 *
 * Every focusable element uses one of these constants. A hand-written
 * `outline-*` class is caught by `conventions.test.ts`.
 *
 * The classes are written out in full on purpose: Tailwind finds classes by
 * scanning the built files as text, so an offset composed at runtime
 * (`` `outline-offset-${n}` ``) produces no CSS at all. The gap is 2px
 * everywhere -- changing it means editing all four strings below.
 */

/**
 * The default: a ring 2px outside the control.
 *
 * `focus-visible`, never `focus`. The ring is a keyboard affordance, and a
 * button that keeps it after a mouse click just looks stuck.
 */
export const FOCUS_RING =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/**
 * The same ring drawn *inside* the control.
 *
 * For elements with nothing but neighbours around them -- table rows, tabs, the
 * bottom nav -- where an outward ring is clipped by the neighbour or the scroll
 * container and shows up with one edge missing.
 */
export const FOCUS_RING_INSET =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary";

/**
 * The ring for a control whose visible box is a sibling `<span>` rather than
 * the focused element itself -- Checkbox and Radio, where the real input is
 * `appearance-none` and only carries the state.
 *
 * The input itself must also carry `FOCUS_RING_NONE`, or the browser draws its
 * own ring around the invisible input, outside this one.
 */
export const FOCUS_RING_PEER =
    "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary";

/**
 * The ring for a composite control: a bordered wrapper holding a bare input and
 * its own buttons, where the ring belongs to the wrapper rather than to the
 * input inside it -- the search pill in `DataMultiView`.
 *
 * `focus-within` and not `focus-visible-within`, which Tailwind v3 has no
 * variant for. It makes no practical difference here: a text input always
 * matches `:focus-visible`, however it was focused.
 *
 * The input inside must carry `FOCUS_RING_NONE`, or it draws a second ring
 * inside this one.
 */
export const FOCUS_RING_WITHIN =
    "focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary";

/** Danger surfaces: the same ring in the error colour. */
export const FOCUS_RING_ERROR =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error";

/**
 * Suppresses the browser's own ring.
 *
 * Chrome draws `outline: auto` as two strokes -- a dark one and a white
 * contrast one outside it -- so on a dark surface an unsuppressed ring reads as
 * a white halo around whatever ring we drew ourselves. Needed on the hidden
 * inputs behind Checkbox and Radio, and on containers that are focusable only
 * to receive the initial focus (dialogs, menus, sheets).
 */
export const FOCUS_RING_NONE = "focus:outline-none";
