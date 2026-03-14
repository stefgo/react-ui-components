import { Sun, Moon } from 'lucide-react';
import { cn } from './utils';

export interface ThemeToggleClassNames {
    root?: string;
    icon?: string;
}

interface ThemeToggleProps {
    theme: string;
    onToggle: () => void;
    className?: string; // Standard root className
    classNames?: ThemeToggleClassNames;
}

export const ThemeToggle = ({
    theme,
    onToggle,
    className = '',
    classNames
}: ThemeToggleProps) => {
    return (
        <button
            onClick={onToggle}
            className={cn(
                "p-2 flex items-center justify-center rounded-lg text-gray-500 dark:text-[#888] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-hover-dark transition-colors",
                className,
                classNames?.root
            )}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {theme === 'dark' 
                ? <Sun size={20} className={cn(classNames?.icon)} /> 
                : <Moon size={20} className={cn(classNames?.icon)} />
            }
        </button>
    );
};
