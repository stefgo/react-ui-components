import type { SidebarBadgeTone } from '../Sidebar';

/** Dot colour per tone; an untoned dot keeps the red it always had. */
export const badgeDotClass = (tone?: SidebarBadgeTone) =>
    tone === 'warning' ? 'bg-warning' : 'bg-error';

/** Pill colours per tone, or `undefined` for the surface's own neutral style. */
export const badgeToneClass = (tone?: SidebarBadgeTone) =>
    tone === 'warning'
        ? 'bg-badge-warning-bg text-badge-warning-text'
        : tone === 'error'
            ? 'bg-badge-error-bg text-badge-error-text'
            : undefined;
