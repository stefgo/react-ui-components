import type { SidebarBadgeTone } from '../Sidebar';
import { cn } from '../utils';

/**
 * Dot size and colour per tone; an untoned dot keeps the red it always had.
 * The ring in the surface colour (passed by the caller) sets the dot off from
 * an icon it overlaps and from the item background.
 */
export const badgeDotClass = (tone?: SidebarBadgeTone) =>
    cn('w-2.5 h-2.5 rounded-full ring-2', tone === 'warning' ? 'bg-badge-dot-warning' : 'bg-badge-dot-error');

/** Pill colours per tone, or `undefined` for the surface's own neutral style. */
export const badgeToneClass = (tone?: SidebarBadgeTone) =>
    tone === 'warning'
        ? 'bg-badge-warning-bg text-badge-warning-text ring-1 ring-inset ring-badge-ring'
        : tone === 'error'
            ? 'bg-badge-error-bg text-badge-error-text ring-1 ring-inset ring-badge-ring'
            : undefined;
