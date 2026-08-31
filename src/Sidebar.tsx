import { ReactNode } from 'react';
import { cn } from './utils';


export interface SidebarItem {
    id: string;
    label: string;
    icon: ReactNode;
    badge?: string;
    badgeDot?: boolean; // If true, show a dot indicator when sidebar is collapsed
    active?: boolean;
    onClick: () => void;
}

export interface SidebarGroup {
    title?: string;
    items: SidebarItem[];
}

export interface SidebarClassNames {
    root?: string;
    content?: string;
    group?: string;
    groupTitle?: string;
    item?: string;
    itemActive?: string;
    itemInactive?: string;
    itemContent?: string;
    itemIcon?: string;
    itemLabel?: string;
    itemBadge?: string;
    itemBadgeActive?: string;
    itemBadgeInactive?: string;
}

interface SidebarProps {
    groups: SidebarGroup[];
    isCollapsed?: boolean;
    /** Accessible name of the navigation landmark. */
    ariaLabel?: string;
    className?: string;
    classNames?: SidebarClassNames;
}

const NavItem = ({
    icon,
    label,
    active,
    onClick,
    badge,
    badgeDot,
    isCollapsed,
    classNames
}: SidebarItem & { isCollapsed?: boolean; classNames?: SidebarClassNames }) => (
    <button
        type="button"
        onClick={onClick}
        title={isCollapsed ? label : ""}
        // Collapsed items hide their label, so it has to come through ARIA.
        aria-label={isCollapsed ? label : undefined}
        aria-current={active ? 'page' : undefined}
        className={cn(
            "w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-base",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            isCollapsed ? "justify-center" : "justify-between",
            active
                ? "bg-sidebar-item-active text-text-primary shadow-sm ring-1 ring-border"
                : "text-text-muted hover:bg-sidebar-item-active hover:text-text-primary",
            classNames?.item,
            active ? classNames?.itemActive : classNames?.itemInactive
        )}
    >
        <div className={cn("flex items-center gap-3", classNames?.itemContent)}>
            <div className={cn("flex-shrink-0 relative", classNames?.itemIcon)} aria-hidden="true">
                {icon}
                {isCollapsed && badgeDot && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-error" />
                )}
            </div>
            {!isCollapsed && <span className={cn("truncate", classNames?.itemLabel)}>{label}</span>}
        </div>
        {!isCollapsed && badge && (
            <span
                className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    active
                        ? "bg-sidebar-badge-active"
                        : "bg-sidebar-badge-inactive",
                    classNames?.itemBadge,
                    active ? classNames?.itemBadgeActive : classNames?.itemBadgeInactive
                )}
            >
                {badge}
            </span>
        )}
    </button>
);

export const Sidebar = ({
    groups,
    isCollapsed = false,
    ariaLabel = "Main",
    className = "",
    classNames,
}: SidebarProps) => {
    return (
        <aside className={cn(
            isCollapsed ? "w-16" : "w-64",
            "h-full bg-sidebar-bg border-r border-border hidden md:flex flex-col transition-all duration-slow relative",
            className,
            classNames?.root
        )}>
            <nav
                aria-label={ariaLabel}
                className={cn(
                    "p-4 flex flex-1 flex-col overflow-y-auto scrollbar-none",
                    isCollapsed ? "pt-8 items-center" : "pt-8",
                    classNames?.content
                )}
            >
                {groups.map((group, groupIdx) => (
                    <div key={groupIdx} className={cn("space-y-1 w-full", groupIdx > 0 && (group.title ? "mt-8" : "mt-6"), classNames?.group)}>
                        {!isCollapsed && group.title && (
                            <div className={cn(
                                "text-text-muted text-xs font-bold uppercase tracking-wider px-3 mb-2",
                                classNames?.groupTitle
                            )}>
                                {group.title}
                            </div>
                        )}
                        {group.items.map((item) => (
                            <NavItem
                                key={item.id}
                                {...item}
                                isCollapsed={isCollapsed}
                                classNames={classNames}
                            />
                        ))}
                    </div>
                ))}
            </nav>
        </aside>
    );
};
