import { ReactNode } from 'react';
import { Menu } from 'lucide-react';

interface AppHeaderProps {
    branding?: ReactNode;
    leftActions?: ReactNode;
    rightActions?: ReactNode;
    onToggleSidebar?: () => void;
    showSidebarToggle?: boolean;
    className?: string;
}

export const AppHeader = ({
    branding,
    leftActions,
    rightActions,
    onToggleSidebar,
    showSidebarToggle = true,
    className = ""
}: AppHeaderProps) => {
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
                {branding}
                {leftActions}
            </div>

            <div className="flex items-center gap-4">
                {rightActions}
            </div>
        </header>
    );
};
