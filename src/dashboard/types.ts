import type { IconComponent } from '../types';
import type { SidebarBadgeTone } from '../Sidebar';

export interface DashboardNavGroup {
    id: string;
    title?: string;
}

export interface DashboardPageNav {
    label: string;
    /** Icon component, e.g. any icon exported by lucide-react. The surface picks its size. */
    icon: IconComponent;
    badge?: string;
    /**
     * Show a dot indicator. Collapsed, it sits on the icon; expanded, it takes the
     * badge's place when there is no `badge` text.
     */
    badgeDot?: boolean;
    /** Colours the badge and the dot. Without it the badge is neutral and the dot red. */
    badgeTone?: SidebarBadgeTone;
    /** References DashboardNavGroup.id */
    groupId?: string;
    /** Where the entry appears on small screens. Default: 'sidebar'. */
    placement?: 'sidebar' | 'mobile-more';
    onClick: () => void;
}

/**
 * A navigable destination. `Dashboard` uses this to render navigation and to
 * highlight the current entry — it does not render page content. Put the content
 * in your own router and pass it as `children`.
 */
export interface DashboardPage {
    id: string;
    /** Path or paths this entry covers. Supports `:param` segments. */
    path?: string | string[];
    /** Explicit override. Wins over `path` matching. */
    active?: boolean;
    nav?: DashboardPageNav;
}
