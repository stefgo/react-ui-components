import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
    theme: string;
    onToggle: () => void;
    className?: string;
}

export const ThemeToggle = ({
    theme,
    onToggle,
    className = ''
}: ThemeToggleProps) => {
    return (
        <button
            onClick={onToggle}
            className={`p-2 flex items-center justify-center rounded-lg text-gray-500 dark:text-[#888] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors ${className}`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
};
