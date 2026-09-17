import { useState, type ReactNode } from 'react';
import type { UseTabsResult } from './hooks/useTabs';
import { cn } from './utils';

export interface TabListProps {
    tabs: UseTabsResult;
    /** Names the group for a screen reader -- "Project views", not "Tabs". */
    'aria-label': string;
    className?: string;
    children: ReactNode;
}

/**
 * The strip a set of tabs sits in: the tablist role and the arrow keys.
 *
 * It brings no look of its own, only the layout the caller gives it, because
 * what a tab looks like is the caller's business -- a row of `StatCard`s, a row
 * of pills, a column of labels.
 */
export const TabList = ({ tabs, 'aria-label': label, className, children }: TabListProps) => (
    <div {...tabs.listProps} aria-label={label} className={className}>
        {children}
    </div>
);

/**
 * How long a panel's content stays alive.
 *
 * This is the decision that `{active && <Panel/>}` makes silently, and the
 * reason a list came back sorted by its default after a tab switch: the view
 * holding that state had been unmounted and built again. Naming the policy is
 * most of the point of this component.
 */
export type TabMountPolicy =
    /** Only the open panel exists. Its state dies on every switch. For content too heavy to keep. */
    | 'active'
    /** Built when first opened, kept afterwards. The default: coming back shows what you left. */
    | 'visited'
    /** Built for every tab at once, before anyone asks. For content that must be measured or prefetched. */
    | 'eager';

export interface TabPanelProps {
    tabs: UseTabsResult;
    /** Which tab this panel belongs to. Must be one of the tabs passed to `useTabs`. */
    value: string;
    /** Default `'visited'`. */
    mount?: TabMountPolicy;
    className?: string;
    children: ReactNode;
}

/**
 * One tab's panel, and the lifetime of what is inside it.
 *
 * The panel element is always rendered, whatever the mount policy: it carries
 * the id that its tab's `aria-controls` points at, and a dangling reference
 * there is a broken tab list to anything that reads the page structure. The
 * policy governs the *content*, which is the part that costs something and the
 * part that holds state.
 */
export const TabPanel = ({ tabs, value, mount = 'visited', className, children }: TabPanelProps) => {
    const attributes = tabs.panelProps(value);
    const active = !attributes.hidden;

    const [visited, setVisited] = useState(active);
    // Derived from the selection, so it is caught up while rendering rather
    // than in an effect -- an effect would paint one empty frame on the switch.
    if (active && !visited) setVisited(true);

    const show = mount === 'eager' || (mount === 'visited' ? visited : active);

    return (
        // The `hidden` attribute rather than a class: it takes the subtree out
        // of the accessibility tree too. But it only sets a *default* display,
        // so a `flex` or `grid` in `className` would win and show the closed
        // panel -- the class goes last, where tailwind-merge settles the
        // conflict in favour of staying hidden.
        <div {...attributes} className={cn(className, attributes.hidden && 'hidden')}>
            {show ? children : null}
        </div>
    );
};
