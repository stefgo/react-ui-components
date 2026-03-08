import { ReactNode } from 'react';

export interface BottomNavItem {
    id: string;
    icon: ReactNode;
    label?: string;
    active: boolean;
    onClick: () => void;
}

interface BottomNavProps {
    items: BottomNavItem[];
    className?: string;
}

const NavTab = ({ icon, active, onClick }: BottomNavItem) => (
    <button
        onClick={onClick}
        className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${active
            ? "text-[#E54D0D]"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
    >
        {icon}
    </button>
);

export const BottomNav = ({ items, className = "" }: BottomNavProps) => {
    return (
        <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#161616]/95 backdrop-blur-md border-t border-gray-200 dark:border-[#222] z-50 flex justify-around items-center px-2 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)] ${className}`}>
            {items.map((item) => (
                <NavTab key={item.id} {...item} />
            ))}
        </div>
    );
};
