import { Sun, Moon } from 'lucide-react';
import { cn } from './utils';

export interface ThemeToggleClassNames {
    icon?: string;
}

export interface ThemeToggleProps {
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
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                className
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
