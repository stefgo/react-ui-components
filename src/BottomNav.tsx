import type { IconComponent } from './types';
import { cn } from './utils';
import { FOCUS_RING_INSET } from './focus';

/** Edge length of a bottom-nav icon — larger than the sidebar's, it is a touch target. */
const BOTTOM_NAV_ICON_SIZE = 24;
/** The same with a label underneath: the tab is as tall, so the icon gives up the room. */
const BOTTOM_NAV_LABELLED_ICON_SIZE = 20;

export interface BottomNavItem {
    id: string;
    icon: IconComponent;
    label?: string;
    active: boolean;
    onClick: () => void;
}

export interface BottomNavClassNames {
    item?: string;
    itemActive?: string;
    itemInactive?: string;
    /** The text under the icon, with `showLabels`. */
    label?: string;
}

export interface BottomNavProps {
    items: BottomNavItem[];
    /**
     * Write each entry's `label` under its icon. Without it a tab is an icon
     * alone, which is only enough while every icon is one the reader already
     * knows. A label that does not fit its tab is cut off with an ellipsis,
     * so past five or six entries move the rest into a "more" sheet.
     */
    showLabels?: boolean;
    /** Accessible name of the landmark, e.g. when several navs coexist. */
    ariaLabel?: string;
    className?: string; // Standard root className
    classNames?: BottomNavClassNames;
}

const NavTab = ({ icon: Icon, label, active, onClick, showLabels, classNames }: BottomNavItem & Pick<BottomNavProps, 'showLabels' | 'classNames'>) => {
    const labelled = showLabels && !!label;
    return (
        <button
            type="button"
            onClick={onClick}
            // A tab that shows an icon only takes its accessible name from
            // `label`; one that shows the label is named by that text.
            aria-label={labelled ? undefined : label}
            aria-current={active ? 'page' : undefined}
            className={cn(
                // min-w-0 lets a tab shrink below its label's width, so seven
                // tabs share a narrow screen instead of pushing the last one out.
                "flex-1 min-w-0 flex flex-col items-center justify-center transition-colors",
                labelled ? "gap-1 py-2" : "py-3",
                FOCUS_RING_INSET,
                active ? "text-primary" : "text-text-muted hover:text-text-primary",
                classNames?.item,
                active ? classNames?.itemActive : classNames?.itemInactive
            )}
        >
            <Icon size={labelled ? BOTTOM_NAV_LABELLED_ICON_SIZE : BOTTOM_NAV_ICON_SIZE} aria-hidden />
            {labelled && (
                <span className={cn("max-w-full truncate px-0.5 text-[10px] font-medium leading-none", classNames?.label)}>
                    {label}
                </span>
            )}
        </button>
    );
};

export const BottomNav = ({ items, showLabels = false, ariaLabel = "Main", className = "", classNames }: BottomNavProps) => {
    return (
        <nav
            aria-label={ariaLabel}
            className={cn(
                "md:hidden fixed bottom-0 left-0 right-0 bg-sidebar-bg/95 backdrop-blur-md border-t border-border z-bottomnav flex justify-around items-center px-2 pb-safe shadow-nav-top",
                className
            )}
        >
            {items.map((item) => (
                <NavTab key={item.id} {...item} showLabels={showLabels} classNames={classNames} />
            ))}
        </nav>
    );
};
