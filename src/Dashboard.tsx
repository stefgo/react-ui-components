import { ReactNode, useCallback, useMemo, useState } from "react";
import { Shield } from "lucide-react";
import { DashboardHeader, DashboardHeaderClassNames } from "./DashboardHeader";
import { Sidebar, SidebarClassNames } from "./Sidebar";
import { BottomNav, BottomNavItem, BottomNavClassNames } from "./BottomNav";
import { DashboardLayout, DashboardLayoutClassNames } from "./DashboardLayout";
import { ThemeToggle, ThemeToggleClassNames } from "./ThemeToggle";
import { UserMenu, UserMenuClassNames } from "./dashboard/UserMenu";
import { MobileMoreSheet, MobileMoreSheetClassNames } from "./dashboard/MobileMoreSheet";
import { useNavGroups } from "./dashboard/useNavGroups";
import { matchesPath } from "./dashboard/matchesPath";
import { cn } from './utils';

export type { DashboardNavGroup, DashboardPage, DashboardPageNav } from "./dashboard/types";
export type { UserMenuClassNames } from "./dashboard/UserMenu";
export type { MobileMoreSheetClassNames } from "./dashboard/MobileMoreSheet";
export { matchesPath, pathPatternToRegExp } from "./dashboard/matchesPath";
export { useNavGroups } from "./dashboard/useNavGroups";
export type { NavScope } from "./dashboard/useNavGroups";

import type { DashboardNavGroup, DashboardPage } from "./dashboard/types";

export interface DashboardClassNames {
    root?: string;
    layout?: DashboardLayoutClassNames;
    header?: DashboardHeaderClassNames;
    sidebar?: SidebarClassNames;
    bottomNav?: BottomNavClassNames;
    userActions?: string;
    themeToggle?: ThemeToggleClassNames;
    userMenu?: UserMenuClassNames;
    mobileMore?: MobileMoreSheetClassNames;
}

export interface MobileMoreConfig {
    icon?: ReactNode;
    title?: ReactNode;
}

export interface DashboardProps {
    branding?: ReactNode;
    logo?: ReactNode;
    title?: ReactNode;
    username: string;
    onLogout: () => void;
    theme: string;
    onToggleTheme: () => void;

    /**
     * Navigation declaration. `Dashboard` renders the nav and highlights the
     * active entry — it does not decide what is on screen. Render the page
     * content yourself and pass it as `children`.
     */
    pages?: DashboardPage[];
    navGroups?: DashboardNavGroup[];
    currentPath?: string;

    /** The current page's content, normally your router's outlet. */
    children?: ReactNode;

    /** Heading and icon of the mobile overflow sheet. */
    mobileMore?: MobileMoreConfig;

    isSidebarCollapsed: boolean;
    onToggleSidebar: () => void;

    headerLeftActions?: ReactNode;
    className?: string;
    mainClassName?: string;
    contentContainerClassName?: string;
    classNames?: DashboardClassNames;
}

export const Dashboard = ({
    branding,
    logo,
    title,
    username,
    onLogout,
    theme,
    onToggleTheme,
    pages,
    navGroups,
    currentPath,
    children,
    mobileMore,
    isSidebarCollapsed,
    onToggleSidebar,
    headerLeftActions,
    className = "",
    mainClassName = "",
    contentContainerClassName = "",
    classNames
}: DashboardProps) => {
    const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);

    // Purely derived: which nav entry is highlighted. When nothing matches,
    // nothing is highlighted — the consumer's router decides what that means.
    const activeId = useMemo(() => {
        if (!pages) return null;

        const explicit = pages.find(p => p.active);
        if (explicit) return explicit.id;

        const byPath = pages.find(p => matchesPath(p.path, currentPath));
        return byPath ? byPath.id : null;
    }, [pages, currentPath]);

    const closeSheet = useCallback(() => setIsMoreSheetOpen(false), []);

    const sidebarGroups = useNavGroups(pages, navGroups, {
        scope: 'all',
        iconSize: 18,
        activeId
    });

    const moreGroups = useNavGroups(pages, navGroups, {
        scope: 'mobile-more',
        iconSize: 18,
        activeId,
        onNavigate: closeSheet
    });

    const primaryGroups = useNavGroups(pages, navGroups, {
        scope: 'primary',
        iconSize: 24,
        activeId
    });

    const bottomNavItems = useMemo<BottomNavItem[]>(() => {
        const items = primaryGroups.flatMap(group => group.items).map(item => ({
            id: item.id,
            icon: item.icon,
            label: item.label,
            active: !!item.active,
            onClick: item.onClick
        }));

        if (moreGroups.length === 0) return items;

        return [
            ...items,
            {
                id: "more-menu-trigger",
                icon: mobileMore?.icon ?? <Shield size={24} />,
                label: typeof mobileMore?.title === 'string' ? mobileMore.title : "More",
                active: isMoreSheetOpen,
                onClick: () => setIsMoreSheetOpen(open => !open)
            }
        ];
    }, [primaryGroups, moreGroups, mobileMore, isMoreSheetOpen]);

    const userActions = (
        <div className={cn("flex items-center gap-4", classNames?.userActions)}>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} classNames={classNames?.themeToggle} />
            <UserMenu username={username} onLogout={onLogout} classNames={classNames?.userMenu} />
        </div>
    );

    return (
        <DashboardLayout
            className={cn(className, classNames?.root)}
            mainClassName={mainClassName}
            contentContainerClassName={contentContainerClassName}
            classNames={classNames?.layout}
            header={
                <DashboardHeader
                    branding={branding}
                    logo={logo}
                    title={title}
                    leftActions={headerLeftActions}
                    rightActions={userActions}
                    onToggleSidebar={onToggleSidebar}
                    classNames={classNames?.header}
                />
            }
            sidebar={
                <Sidebar
                    groups={sidebarGroups}
                    isCollapsed={isSidebarCollapsed}
                    classNames={classNames?.sidebar}
                />
            }
            bottomNav={<BottomNav items={bottomNavItems} classNames={classNames?.bottomNav} />}
        >
            {children}
            <MobileMoreSheet
                isOpen={isMoreSheetOpen}
                onClose={closeSheet}
                groups={moreGroups}
                title={mobileMore?.title}
                icon={mobileMore?.icon}
                classNames={classNames?.mobileMore}
            />
        </DashboardLayout>
    );
};
