import { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';

export interface DashboardNavGroup {
    id: string;
    title?: string;
}

export interface DashboardPageNav {
    label: string;
    /** Icon component, e.g. any icon exported by lucide-react. Rendered with a `size` prop. */
    icon: ComponentType<LucideProps>;
    badge?: string;
    /** Show a dot indicator when the sidebar is collapsed and the label is hidden. */
    badgeDot?: boolean;
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
