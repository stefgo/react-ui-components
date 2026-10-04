import { ReactNode } from 'react';
import type { UseTabsResult } from './hooks/useTabs';
import type { IconComponent } from './types';
import { cn } from './utils';
import { FOCUS_RING_INSET } from './focus';

export interface SideTabClassNames {
    icon?: string;
    label?: string;
}

export interface SideTabProps {
    tabs: UseTabsResult;
    /** Which tab this is. Must be one of the tabs passed to `useTabs`. */
    value: string;
    icon?: IconComponent;
    /** The tab's name. */
    children: ReactNode;
    /** After the name: a marker for unsaved changes, a count. */
    trailing?: ReactNode;
    className?: string;
    classNames?: SideTabClassNames;
}

/*
 * Module-level, like every variant table here: each is a `cn()` pass, and a
 * settings page renders one of these per section on every keystroke in a field.
 */
const BASE = cn(
    "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left transition duration-200 cursor-pointer border-l-4 border-transparent hover:bg-hover",
    FOCUS_RING_INSET
);

const SELECTED = "bg-primary/10 text-primary border-l-primary shadow-[inset_0_1px_1px_rgba(0,0,0,0.05)] hover:bg-primary/10";

/**
 * One tab of a column of them: the sections of a settings page, down the left
 * edge of the card.
 *
 * `useTabs` leaves the look of a tab to the caller, and three apps drew this
 * one identically, each with the same two class constants in its settings
 * page. The ring is the inset one: the column has no room around a tab, and an
 * outward ring would be clipped by its neighbours.
 *
 * Sits in a `TabList`; pass `orientation: 'vertical'` to `useTabs`, so the
 * arrow keys that walk the tabs are the ones the column suggests.
 */
export const SideTab = ({ tabs, value, icon: Icon, children, trailing, className, classNames }: SideTabProps) => {
    const { selected, ...attributes } = tabs.tabProps(value);

    return (
        <button type="button" {...attributes} className={cn(BASE, selected && SELECTED, className)}>
            {/* Sized by the column, not by a control size: this is navigation, like the sidebar. */}
            {Icon && <Icon size={18} aria-hidden className={cn("shrink-0", classNames?.icon)} />}
            <span className={cn("flex-1 min-w-0", classNames?.label)}>{children}</span>
            {trailing}
        </button>
    );
};
