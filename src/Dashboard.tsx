import { ReactNode, useState, useRef, useEffect, useMemo } from "react";
import { User, LogOut, ChevronDown, X, Shield } from "lucide-react";
import { DashboardHeader, DashboardHeaderClassNames } from "./DashboardHeader";
import { Sidebar, SidebarGroup, SidebarClassNames } from "./Sidebar";
import { BottomNav, BottomNavItem, BottomNavClassNames } from "./BottomNav";
import { DashboardLayout, DashboardLayoutClassNames } from "./DashboardLayout";
import { ThemeToggle, ThemeToggleClassNames } from "./ThemeToggle";
import { cn } from './utils';

export interface MobileMoreMenuConfig {
    icon?: ReactNode;
    title?: ReactNode;
    groups: SidebarGroup[];
}

export interface DashboardPage {
    id: string;
    group?: string; // Optional group for sidebar categorization
    label: string;
    icon: any; // Icon component (e.g. from lucide-react)
    badge?: string;
    active?: boolean;
    onClick: () => void;
    isMobileMoreMenu?: boolean; // If true, it goes into the mobile 'More' menu instead of bottom nav
    content?: ReactNode; // The content to render when this page is active
}

export interface DashboardClassNames {
    root?: string;
    layout?: DashboardLayoutClassNames;
    header?: DashboardHeaderClassNames;
    sidebar?: SidebarClassNames;
    bottomNav?: BottomNavClassNames;
    userActions?: string;
    themeToggle?: ThemeToggleClassNames;
    userMenuTrigger?: string;
    userMenuIconWrapper?: string;
    userMenuDropdown?: string;
    userMenuInfo?: string;
    userMenuLogout?: string;
    mobileMoreOverlay?: string;
    mobileMoreSheet?: string;
    mobileMoreHeader?: string;
    mobileMoreTitle?: string;
    mobileMoreClose?: string;
    mobileMoreGroupTitle?: string;
    mobileMoreItem?: string;
    mobileMoreItemActive?: string;
}

export interface DashboardProps {
    branding?: ReactNode;
    logo?: ReactNode;
    title?: ReactNode;
    username: string;
    onLogout: () => void;
    theme: string;
    onToggleTheme: () => void;

    // Legacy Explicit Props (kept for backwards compatibility)
    sidebarGroups?: SidebarGroup[];
    navItems?: BottomNavItem[];
    children?: ReactNode;
    mobileMoreMenu?: MobileMoreMenuConfig;

    // New Unified Page Prop
    pages?: DashboardPage[];

    isSidebarCollapsed: boolean;
    onToggleSidebar: () => void;

    mobileMenuOverlay?: ReactNode; // Kept for backwards compatibility during transition
    className?: string; // Root className
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

    // Legacy Explicit Props
    sidebarGroups: legacySidebarGroups = [],
    navItems: legacyNavItems = [],
    children: legacyChildren,
    mobileMoreMenu: legacyMobileMoreMenu,

    // New Page Prop
    pages,

    isSidebarCollapsed,
    onToggleSidebar,
    mobileMenuOverlay,
    className = "",
    mainClassName = "",
    contentContainerClassName = "",
    classNames
}: DashboardProps) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMoreMenuOpen, setIsMobileMoreMenuOpen] = useState(false);
    const [internalActiveId, setInternalActiveId] = useState<string | null>(() => {
        if (!pages || pages.length === 0) return null;
        const explicitlyActive = pages.find(p => p.active);
        return explicitlyActive ? explicitlyActive.id : pages[0].id;
    });
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // ------------------------------------------------------------------------
    // Derive UI from Pages (if provided), otherwise use legacy props
    // ------------------------------------------------------------------------

    const effectiveActiveId = useMemo(() => {
        if (!pages) return null;
        const controlledActive = pages.find(p => p.active);
        if (controlledActive) return controlledActive.id;
        return internalActiveId;
    }, [pages, internalActiveId]);

    const sidebarGroups = useMemo<SidebarGroup[]>(() => {
        if (!pages) return legacySidebarGroups;

        // Group pages by their 'group' property
        const groupsMap = new Map<string, DashboardPage[]>();
        const defaultGroupKey = "Main";

        pages.forEach(page => {
            const groupName = page.group || defaultGroupKey;
            if (!groupsMap.has(groupName)) {
                groupsMap.set(groupName, []);
            }
            groupsMap.get(groupName)!.push(page);
        });

        const generatedGroups: SidebarGroup[] = [];
        groupsMap.forEach((groupPages, groupTitle) => {
            generatedGroups.push({
                title: groupTitle === defaultGroupKey && groupsMap.size === 1 ? undefined : groupTitle,
                items: groupPages.map(p => ({
                    id: p.id,
                    label: p.label,
                    icon: <p.icon size={18} />,
                    active: p.id === effectiveActiveId,
                    onClick: () => {
                        setInternalActiveId(p.id);
                        p.onClick();
                    },
                    badge: p.badge
                }))
            });
        });
        return generatedGroups;
    }, [pages, legacySidebarGroups, effectiveActiveId]);

    const navItems = useMemo<BottomNavItem[]>(() => {
        if (!pages) return legacyNavItems;

        return pages
            .filter(p => !p.isMobileMoreMenu)
            .map(p => ({
                id: p.id,
                icon: <p.icon size={24} />,
                active: p.id === effectiveActiveId,
                onClick: () => {
                    setInternalActiveId(p.id);
                    p.onClick();
                }
            }));
    }, [pages, legacyNavItems, effectiveActiveId]);

    const mobileMoreMenu = useMemo<MobileMoreMenuConfig | undefined>(() => {
        if (!pages) return legacyMobileMoreMenu;

        const moreMenuPages = pages.filter(p => p.isMobileMoreMenu);
        if (moreMenuPages.length === 0) return undefined;

        return {
            title: "More",
            groups: (() => {
                const groupsMap = new Map<string, DashboardPage[]>();
                moreMenuPages.forEach(page => {
                    const groupName = page.group || "Settings";
                    if (!groupsMap.has(groupName)) {
                        groupsMap.set(groupName, []);
                    }
                    groupsMap.get(groupName)!.push(page);
                });

                const generatedGroups: SidebarGroup[] = [];
                groupsMap.forEach((groupPages, groupTitle) => {
                    generatedGroups.push({
                        title: groupTitle,
                        items: groupPages.map(p => ({
                            id: p.id,
                            label: p.label,
                            icon: <p.icon size={18} />,
                            active: p.id === effectiveActiveId,
                            onClick: () => {
                                setInternalActiveId(p.id);
                                p.onClick();
                            },
                            badge: p.badge
                        }))
                    });
                });
                return generatedGroups;
            })()
        };
    }, [pages, legacyMobileMoreMenu, effectiveActiveId]);

    const children = useMemo<ReactNode>(() => {
        if (!pages) return legacyChildren;

        const activePage = pages.find(p => p.id === effectiveActiveId);
        return activePage?.content || legacyChildren;
    }, [pages, effectiveActiveId, legacyChildren]);


    // ------------------------------------------------------------------------
    // Render Functions
    // ------------------------------------------------------------------------

    const userActions = (
        <div className={cn("flex items-center gap-4", classNames?.userActions)}>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} classNames={classNames?.themeToggle} />

            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={cn(
                        "flex items-center gap-2 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors p-1 pr-2 rounded-lg hover:bg-hover dark:hover:bg-hover-dark",
                        classNames?.userMenuTrigger
                    )}
                >
                    <div className={cn("w-8 h-8 rounded-full bg-hover dark:bg-hover-dark flex items-center justify-center text-text-secondary dark:text-text-muted-dark", classNames?.userMenuIconWrapper)}>
                        <User size={18} />
                    </div>
                    <ChevronDown size={14} className={cn("transition-transform duration-200", isUserMenuOpen ? 'rotate-180' : '')} />
                </button>

                {isUserMenuOpen && (
                    <div className={cn(
                        "absolute right-0 mt-2 w-56 bg-card dark:bg-card-dark rounded-xl shadow-xl border border-border dark:border-border-dark py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50",
                        classNames?.userMenuDropdown
                    )}>
                        <div className={cn("px-4 py-3 border-b border-border dark:border-border-dark", classNames?.userMenuInfo)}>
                            <p className="text-xs text-text-muted dark:text-text-muted-dark font-medium uppercase tracking-wider mb-1">Signed in as</p>
                            <p className="text-sm font-semibold text-text-primary dark:text-text-primary-dark truncate">{username}</p>
                        </div>

                        <div className="py-1">
                            <button
                                onClick={onLogout}
                                className={cn(
                                    "w-full text-left px-4 py-2 text-sm text-error hover:bg-error-bg dark:hover:bg-error-bg-dark flex items-center gap-2 transition-colors",
                                    classNames?.userMenuLogout
                                )}
                            >
                                <LogOut size={16} />
                                Sign out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Handle Mobile More Menu Navigation
    let effectiveNavItems = navItems;
    if (mobileMoreMenu) {
        effectiveNavItems = [
            ...navItems,
            {
                id: "more-menu-trigger",
                icon: mobileMoreMenu.icon || <Shield size={24} />, // Default to Shield for generic admin/more
                active: isMobileMoreMenuOpen,
                onClick: () => setIsMobileMoreMenuOpen(!isMobileMoreMenuOpen)
            }
        ];
    }

    const handleMobileMenuItemClick = (onClick: () => void) => {
        onClick();
        setIsMobileMoreMenuOpen(false);
    };

    const renderMobileMoreMenuOverlay = () => {
        if (!mobileMoreMenu || !isMobileMoreMenuOpen) return null;

        return (
            <div className={cn("md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200", classNames?.mobileMoreOverlay)}>
                <div className={cn("absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-card dark:bg-card-dark rounded-t-2xl p-6 pb-24 animate-in slide-in-from-bottom duration-300 shadow-2xl", classNames?.mobileMoreSheet)}>
                    <div className={cn("flex justify-between items-center mb-6 sticky top-0 bg-card dark:bg-card-dark z-10 py-2", classNames?.mobileMoreHeader)}>
                        <h2 className={cn("text-xl font-bold text-text-primary dark:text-text-primary-dark flex items-center gap-2", classNames?.mobileMoreTitle)}>
                            {mobileMoreMenu.icon || <Shield className="text-text-muted" size={24} />}
                            {mobileMoreMenu.title || "More"}
                        </h2>
                        <button
                            onClick={() => setIsMobileMoreMenuOpen(false)}
                            className={cn("p-2 rounded-full bg-hover dark:bg-hover-dark text-text-muted hover:bg-border dark:hover:bg-hover-dark transition-colors", classNames?.mobileMoreClose)}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-6">
                        {mobileMoreMenu.groups.map((group: SidebarGroup, groupIdx: number) => (
                            <div key={groupIdx} className="space-y-3">
                                {group.title && (
                                    <div className={cn("text-text-muted dark:text-text-muted-dark text-xs font-bold uppercase tracking-wider px-2", classNames?.mobileMoreGroupTitle)}>
                                        {group.title}
                                    </div>
                                )}
                                <div className="grid grid-cols-1 gap-2">
                                    {group.items.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleMobileMenuItemClick(item.onClick)}
                                            className={cn(
                                                "flex items-center gap-4 p-4 rounded-xl transition-colors w-full text-left",
                                                item.active
                                                    ? "bg-hover dark:bg-hover-dark text-text-primary dark:text-text-primary-dark ring-1 ring-border dark:ring-border-dark"
                                                    : "bg-app-bg dark:bg-black text-text-secondary dark:text-text-secondary-dark hover:bg-hover dark:hover:bg-hover-dark",
                                                classNames?.mobileMoreItem,
                                                item.active ? classNames?.mobileMoreItemActive : ''
                                            )}
                                        >
                                            <div className={cn(item.active ? "text-primary" : "")}>
                                                {item.icon}
                                            </div>
                                            <span className="font-semibold text-lg flex-1">{item.label}</span>
                                            {item.badge && (
                                                <span className={cn(
                                                    "text-xs px-2 py-1 rounded-full",
                                                    item.active
                                                        ? "bg-border dark:bg-hover-dark text-text-primary dark:text-text-primary-dark"
                                                        : "bg-border dark:bg-hover-dark text-text-muted dark:text-text-muted-dark"
                                                )}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

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
            bottomNav={<BottomNav items={effectiveNavItems} classNames={classNames?.bottomNav} />}
        >
            {children}
            {mobileMenuOverlay}
            {renderMobileMoreMenuOverlay()}
        </DashboardLayout>
    );
};
