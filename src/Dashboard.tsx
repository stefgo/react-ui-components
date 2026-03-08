import { ReactNode, useState, useRef, useEffect, useMemo } from "react";
import { User, LogOut, ChevronDown, X, Shield } from "lucide-react";
import { DashboardHeader } from "./DashboardHeader";
import { Sidebar, SidebarGroup } from "./Sidebar";
import { BottomNav, BottomNavItem } from "./BottomNav";
import { DashboardLayout } from "./DashboardLayout";
import { ThemeToggle } from "./ThemeToggle";

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
    className?: string;
    mainClassName?: string;
    contentContainerClassName?: string;
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
    contentContainerClassName = ""
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
    }, [pages, legacySidebarGroups]);

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
    }, [pages, legacyNavItems]);

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
    }, [pages, legacyMobileMoreMenu]);

    const children = useMemo<ReactNode>(() => {
        if (!pages) return legacyChildren;

        const activePage = pages.find(p => p.id === effectiveActiveId);
        return activePage?.content || legacyChildren;
    }, [pages, effectiveActiveId, legacyChildren]);


    // ------------------------------------------------------------------------
    // Render Functions
    // ------------------------------------------------------------------------

    const userActions = (
        <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 text-gray-700 dark:text-[#ccc] hover:text-gray-900 dark:hover:text-white transition-colors p-1 pr-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                >
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#333] flex items-center justify-center text-gray-600 dark:text-[#aaa]">
                        <User size={18} />
                    </div>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#252525] rounded-xl shadow-xl border border-gray-200 dark:border-[#333] py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-[#333]">
                            <p className="text-xs text-gray-500 dark:text-[#888] font-medium uppercase tracking-wider mb-1">Signed in as</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{username}</p>
                        </div>

                        <div className="py-1">
                            <button
                                onClick={onLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 transition-colors"
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
            <div className="md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-white dark:bg-[#1a1a1a] rounded-t-2xl p-6 pb-24 animate-in slide-in-from-bottom duration-300 shadow-2xl">
                    <div className="flex justify-between items-center mb-6 sticky top-0 bg-white dark:bg-[#1a1a1a] z-10 py-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {mobileMoreMenu.icon || <Shield className="text-gray-500" size={24} />}
                            {mobileMoreMenu.title || "More"}
                        </h2>
                        <button
                            onClick={() => setIsMobileMoreMenuOpen(false)}
                            className="p-2 rounded-full bg-gray-100 dark:bg-[#2a2a2a] text-gray-500 hover:bg-gray-200 dark:hover:bg-[#333] transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-6">
                        {mobileMoreMenu.groups.map((group: SidebarGroup, groupIdx: number) => (
                            <div key={groupIdx} className="space-y-3">
                                {group.title && (
                                    <div className="text-gray-500 dark:text-[#666] text-xs font-bold uppercase tracking-wider px-2">
                                        {group.title}
                                    </div>
                                )}
                                <div className="grid grid-cols-1 gap-2">
                                    {group.items.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleMobileMenuItemClick(item.onClick)}
                                            className={`flex items-center gap-4 p-4 rounded-xl transition-colors w-full text-left ${item.active
                                                ? "bg-gray-100 dark:bg-[#333] text-gray-900 dark:text-white ring-1 ring-gray-200 dark:ring-[#444]"
                                                : "bg-gray-50 dark:bg-[#222] text-gray-700 dark:text-[#ccc] hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                                                }`}
                                        >
                                            <div className={`${item.active ? "text-primary" : ""}`}>
                                                {item.icon}
                                            </div>
                                            <span className="font-semibold text-lg flex-1">{item.label}</span>
                                            {item.badge && (
                                                <span className={`text-xs px-2 py-1 rounded-full ${item.active
                                                    ? "bg-gray-200 dark:bg-[#444] text-gray-900 dark:text-white"
                                                    : "bg-gray-200 dark:bg-[#333] text-gray-600 dark:text-[#aaa]"
                                                    }`}>
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
            className={className}
            mainClassName={mainClassName}
            contentContainerClassName={contentContainerClassName}
            header={
                <DashboardHeader
                    branding={branding}
                    logo={logo}
                    title={title}
                    rightActions={userActions}
                    onToggleSidebar={onToggleSidebar}
                />
            }
            sidebar={
                <Sidebar
                    groups={sidebarGroups}
                    isCollapsed={isSidebarCollapsed}
                />
            }
            bottomNav={<BottomNav items={effectiveNavItems} />}
        >
            {children}
            {mobileMenuOverlay}
            {renderMobileMoreMenuOverlay()}
        </DashboardLayout>
    );
};
