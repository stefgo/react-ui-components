import { ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { cn } from './utils';

export interface DashboardHeaderClassNames {
    leftSection?: string;
    rightSection?: string;
    branding?: string;
    title?: string;
    sidebarToggle?: string;
}

export interface DashboardHeaderProps {
    branding?: ReactNode;
    logo?: ReactNode;
    title?: ReactNode;
    leftActions?: ReactNode;
    rightActions?: ReactNode;
    onToggleSidebar?: () => void;
    showSidebarToggle?: boolean;
    className?: string;
    classNames?: DashboardHeaderClassNames;
}

export const DashboardHeader = ({
    branding,
    logo,
    title,
    leftActions,
    rightActions,
    onToggleSidebar,
    showSidebarToggle = true,
    className = "",
    classNames
}: DashboardHeaderProps) => {
    const renderBranding = () => {
        if (branding) return <div className={cn(classNames?.branding)}>{branding}</div>;
        if (logo || title) {
            return (
                <div className={cn("flex items-center gap-3", classNames?.branding)}>
                    {logo}
                    {title && (
                        <div className="flex flex-col">
                            {typeof title === 'string' ? (
                                <h1 className={cn("text-xl font-bold text-text-primary leading-tight", classNames?.title)}>{title}</h1>
                            ) : title}
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <header className={cn(
            "px-5 py-3 border-b border-border bg-browser-header sticky top-0 z-header shadow-sm flex items-center justify-between",
            className
        )}>
            <div className={cn("flex items-center gap-3 overflow-hidden", classNames?.leftSection)}>
                {showSidebarToggle && onToggleSidebar && (
                    <button
                        type="button"
                        onClick={onToggleSidebar}
                        aria-label="Toggle sidebar"
                        className={cn(
                            "p-2 -ml-2 mr-2 text-text-muted hover:text-text-primary transition-colors md:flex hidden",
                            classNames?.sidebarToggle
                        )}
                        title="Toggle Sidebar"
                    >
                        <Menu size={20} />
                    </button>
                )}
                {renderBranding()}
                {leftActions}
            </div>

            <div className={cn("flex items-center gap-4", classNames?.rightSection)}>
                {rightActions}
            </div>
        </header>
    );
};
