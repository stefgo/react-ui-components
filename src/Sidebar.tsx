import { ReactNode } from 'react';

export interface SidebarItem {
    id: string;
    label: string;
    icon: ReactNode;
    badge?: string;
    active?: boolean;
    onClick: () => void;
}

export interface SidebarGroup {
    title?: string;
    items: SidebarItem[];
}

interface SidebarProps {
    groups: SidebarGroup[];
    isCollapsed?: boolean;
    className?: string;
}

const NavItem = ({ icon, label, active, onClick, badge, isCollapsed }: SidebarItem & { isCollapsed?: boolean }) => (
    <button
        onClick={onClick}
        title={isCollapsed ? label : ""}
        className={`w-full flex items-center ${isCollapsed ? "justify-center" : "justify-between"} px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${active
            ? "bg-white dark:bg-[#252525] text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-[#333]"
            : "text-gray-500 dark:text-[#888] hover:bg-gray-100 dark:hover:bg-[#222] hover:text-gray-900 dark:hover:text-white"
            }`}
    >
        <div className="flex items-center gap-3">
            {icon}
            {!isCollapsed && <span className="truncate">{label}</span>}
        </div>
        {!isCollapsed && badge && (
            <span
                className={`text-xs px-2 py-0.5 rounded-full ${active
                    ? "bg-gray-100 dark:bg-[#333] text-gray-900 dark:text-white"
                    : "bg-gray-200 dark:bg-[#333] text-gray-600 dark:text-[#aaa]"
                    }`}
            >
                {badge}
            </span>
        )}
    </button>
);

export const Sidebar = ({
    groups,
    isCollapsed = false,
    className = "",
}: SidebarProps) => {
    return (
        <aside className={`${isCollapsed ? "w-16" : "w-64"} bg-gray-50 dark:bg-[#161616] border-r border-gray-200 dark:border-[#222] hidden md:flex flex-col transition-all duration-300 relative ${className}`}>
            <div className={`p-4 ${isCollapsed ? "pt-8 items-center" : "pt-8"} flex flex-1 flex-col gap-8 overflow-y-auto`}>
                {groups.map((group, groupIdx) => (
                    <div key={groupIdx} className="space-y-1 w-full">
                        {!isCollapsed && group.title && (
                            <div className="text-gray-500 dark:text-[#666] text-xs font-bold uppercase tracking-wider px-3 mb-2">
                                {group.title}
                            </div>
                        )}
                        {group.items.map((item) => (
                            <NavItem
                                key={item.id}
                                {...item}
                                isCollapsed={isCollapsed}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </aside>
    );
};
