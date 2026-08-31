import { ReactNode } from 'react';
import { cn } from './utils';

export interface BottomNavItem {
    id: string;
    icon: ReactNode;
    label?: string;
    active: boolean;
    onClick: () => void;
}

export interface BottomNavClassNames {
    root?: string;
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

const NavTab = ({ icon, label, active, onClick, classNames }: BottomNavItem & { classNames?: BottomNavClassNames }) => (
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
        <span aria-hidden="true">{icon}</span>
    </button>
);

export const BottomNav = ({ items, ariaLabel = "Main", className = "", classNames }: BottomNavProps) => {
    return (
        <nav
            aria-label={ariaLabel}
            className={cn(
                "md:hidden fixed bottom-0 left-0 right-0 bg-sidebar-bg/95 backdrop-blur-md border-t border-border z-bottomnav flex justify-around items-center px-2 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)]",
                className,
                classNames?.root
            )}
        >
            {items.map((item) => (
                <NavTab key={item.id} {...item} classNames={classNames} />
            ))}
        </nav>
    );
};
