import { useMemo, createElement } from 'react';
import type { SidebarGroup } from '../Sidebar';
import type { DashboardNavGroup, DashboardPage } from './types';

/**
 * Which entries a surface shows:
 * - `all` – the desktop sidebar, which has room for everything.
 * - `primary` – the mobile bottom nav: everything *except* the entries pushed
 *   into the "more" sheet.
 * - `mobile-more` – only those pushed-out entries.
 */
export type NavScope = 'all' | 'primary' | 'mobile-more';

interface UseNavGroupsOptions {
    scope: NavScope;
    iconSize: number;
    activeId: string | null;
    /** Runs after an entry's own onClick, e.g. to close the sheet. */
    onNavigate?: () => void;
}

const inScope = (page: DashboardPage, scope: NavScope) => {
    if (!page.nav) return false;
    const placement = page.nav.placement ?? 'sidebar';
    if (scope === 'all') return true;
    if (scope === 'primary') return placement !== 'mobile-more';
    return placement === 'mobile-more';
};

/**
 * Turns the page declarations into navigation groups for one surface.
 *
 * The sidebar and the mobile "more" sheet used to derive this separately, with
 * two nearly identical copies of the same mapping code; they share this instead.
 */
export const useNavGroups = (
    pages: DashboardPage[] | undefined,
    navGroups: DashboardNavGroup[] | undefined,
    { scope, iconSize, activeId, onNavigate }: UseNavGroupsOptions
): SidebarGroup[] => useMemo(() => {
    if (!pages) return [];

    const relevant = pages.filter(p => inScope(p, scope));

    const toItems = (groupPages: DashboardPage[]) => groupPages.map(p => ({
        id: p.id,
        label: p.nav!.label,
        icon: createElement(p.nav!.icon, { size: iconSize }),
        active: p.id === activeId,
        badge: p.nav!.badge,
        badgeDot: p.nav!.badgeDot,
        onClick: () => {
            p.nav!.onClick();
            onNavigate?.();
        }
    }));

    if (navGroups) {
        return navGroups
            .map(g => ({
                title: g.title,
                items: toItems(relevant.filter(p => p.nav!.groupId === g.id))
            }))
            .filter(g => g.items.length > 0);
    }

    // An empty surface returns no groups at all, so callers can test length.
    if (relevant.length === 0) return [];
    return [{ title: undefined, items: toItems(relevant) }];
}, [pages, navGroups, scope, iconSize, activeId, onNavigate]);
