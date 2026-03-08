import { ReactNode } from 'react';
import { Menu } from 'lucide-react';

interface DashboardHeaderProps {
    branding?: ReactNode;
    logo?: ReactNode;
    title?: ReactNode;
    leftActions?: ReactNode;
    rightActions?: ReactNode;
    onToggleSidebar?: () => void;
    showSidebarToggle?: boolean;
    className?: string;
}

export const DashboardHeader = ({
    branding,
    logo,
    title,
    leftActions,
    rightActions,
    onToggleSidebar,
    showSidebarToggle = true,
    className = ""
}: DashboardHeaderProps) => {
    const renderBranding = () => {
        if (branding) return branding;
        if (logo || title) {
            return (
                <div className="flex items-center gap-3">
                    {logo}
                    {title && (
                        <div className="flex flex-col">
                            {typeof title === 'string' ? (
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{title}</h1>
                            ) : title}
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <header className={`px-5 py-3 border-b border-gray-200 dark:border-[#333] bg-white dark:bg-[#1e1e1e] sticky top-0 z-40 shadow-sm flex items-center justify-between ${className}`}>
            <div className="flex items-center gap-3 overflow-hidden">
                {showSidebarToggle && onToggleSidebar && (
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 -ml-2 mr-2 text-gray-500 dark:text-[#888] hover:text-gray-900 dark:hover:text-white transition-colors md:flex hidden"
                        title="Toggle Sidebar"
                    >
                        <Menu size={20} />
                    </button>
                )}
                {renderBranding()}
                {leftActions}
            </div>

            <div className="flex items-center gap-4">
                {rightActions}
            </div>
        </header>
    );
};
