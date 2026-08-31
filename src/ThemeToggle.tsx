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
    const label = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';

    return (
        <button
            type="button"
            onClick={onToggle}
            className={cn(
                "p-2 flex items-center justify-center rounded-md text-text-muted hover:text-text-primary hover:bg-hover transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                className,
                classNames?.root
            )}
            title={label}
            aria-label={label}
        >
            {theme === 'dark'
                ? <Sun size={20} className={cn(classNames?.icon)} aria-hidden="true" />
                : <Moon size={20} className={cn(classNames?.icon)} aria-hidden="true" />
            }
        </button>
    );
};
