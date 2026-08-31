import type { IconComponent } from './types';
import { cn } from './utils';

/** Edge length of a bottom-nav icon — larger than the sidebar's, it is a touch target. */
const BOTTOM_NAV_ICON_SIZE = 24;

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
}

interface BottomNavProps {
    items: BottomNavItem[];
    /** Accessible name of the landmark, e.g. when several navs coexist. */
    ariaLabel?: string;
    className?: string; // Standard root className
    classNames?: BottomNavClassNames;
}

const NavTab = ({ icon: Icon, label, active, onClick, classNames }: BottomNavItem & { classNames?: BottomNavClassNames }) => (
    <button
        type="button"
        onClick={onClick}
        // The tab shows an icon only, so `label` carries the accessible name.
        aria-label={label}
        aria-current={active ? 'page' : undefined}
        className={cn(
            "flex-1 flex flex-col items-center justify-center py-3 transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
            active ? "text-primary" : "text-text-muted hover:text-text-primary",
            classNames?.item,
            active ? classNames?.itemActive : classNames?.itemInactive
        )}
    >
        <Icon size={BOTTOM_NAV_ICON_SIZE} aria-hidden />
    </button>
);

export const BottomNav = ({ items, ariaLabel = "Main", className = "", classNames }: BottomNavProps) => {
    return (
        <nav
            aria-label={ariaLabel}
            className={cn(
                "md:hidden fixed bottom-0 left-0 right-0 bg-sidebar-bg/95 backdrop-blur-md border-t border-border z-bottomnav flex justify-around items-center px-2 pb-safe shadow-nav-top",
                className
            )}
        >
            {items.map((item) => (
                <NavTab key={item.id} {...item} classNames={classNames} />
            ))}
        </nav>
    );
};
