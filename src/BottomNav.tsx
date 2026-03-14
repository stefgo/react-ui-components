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
    className?: string; // Standard root className
    classNames?: BottomNavClassNames;
}

const NavTab = ({ icon, active, onClick, classNames }: BottomNavItem & { classNames?: BottomNavClassNames }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex-1 flex flex-col items-center justify-center py-3 transition-colors",
            active ? "text-primary" : "text-text-muted dark:text-text-muted-dark hover:text-text-primary dark:hover:text-text-primary-dark",
            classNames?.item,
            active ? classNames?.itemActive : classNames?.itemInactive
        )}
    >
        {icon}
    </button>
);

export const BottomNav = ({ items, className = "", classNames }: BottomNavProps) => {
    return (
        <div className={cn(
            "md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-sidebar-bg-dark/95 backdrop-blur-md border-t dark:border-dark z-50 flex justify-around items-center px-2 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)]",
            className,
            classNames?.root
        )}>
            {items.map((item) => (
                <NavTab key={item.id} {...item} classNames={classNames} />
            ))}
        </div>
    );
};
