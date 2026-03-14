import { ReactNode } from 'react';
import { cn } from './utils';

export interface BadgeClassNames {
    root?: string;
}

interface BadgeProps {
    children: ReactNode;
    variant?: 'success' | 'warning' | 'error' | 'info' | 'gray';
    size?: 'sm' | 'md';
    className?: string;
    classNames?: BadgeClassNames;
}

export const Badge = ({
    children,
    variant = 'info',
    size = 'md',
    className = '',
    classNames
}: BadgeProps) => {
    const baseStyles = "inline-flex items-center font-medium rounded-full transition-colors";

    const variants = {
        success: "bg-badge-success-bg dark:bg-badge-success-bg-dark text-badge-success-text dark:text-badge-success-text-dark",
        warning: "bg-badge-warning-bg dark:bg-badge-warning-bg-dark text-badge-warning-text dark:text-badge-warning-text-dark",
        error: "bg-badge-error-bg dark:bg-badge-error-bg-dark text-badge-error-text dark:text-badge-error-text-dark",
        info: "bg-badge-info-bg dark:bg-badge-info-bg-dark text-badge-info-text dark:text-badge-info-text-dark",
        gray: "bg-gray-100 dark:bg-button-secondary-dark text-text-secondary dark:text-text-muted-dark"
    };

    const sizes = {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-1 text-xs"
    };

    return (
        <span className={cn(baseStyles, variants[variant], sizes[size], className, classNames?.root)}>
            {children}
        </span>
    );
};
