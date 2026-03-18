import { ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { cn } from './utils';

export interface DashboardHeaderClassNames {
    root?: string;
    leftSection?: string;
    rightSection?: string;
    branding?: string;
    title?: string;
    sidebarToggle?: string;
}

interface DashboardHeaderProps {
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
                                <h1 className={cn("text-xl font-bold text-text-primary dark:text-text-primary-dark leading-tight", classNames?.title)}>{title}</h1>
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
            "px-5 py-3 border-b border-border dark:border-border-dark bg-browser-header dark:bg-browser-header-dark sticky top-0 z-40 shadow-sm flex items-center justify-between",
            className,
            classNames?.root
        )}>
            <div className={cn("flex items-center gap-3 overflow-hidden", classNames?.leftSection)}>
                {showSidebarToggle && onToggleSidebar && (
                    <button
                        onClick={onToggleSidebar}
                        className={cn(
                            "p-2 -ml-2 mr-2 text-text-muted dark:text-text-muted-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors md:flex hidden",
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
