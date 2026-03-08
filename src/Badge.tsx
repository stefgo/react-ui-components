import { ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'success' | 'warning' | 'error' | 'info' | 'gray';
    size?: 'sm' | 'md';
    className?: string;
}

export const Badge = ({
    children,
    variant = 'info',
    size = 'md',
    className = ''
}: BadgeProps) => {
    const baseStyles = "inline-flex items-center font-medium rounded-full transition-colors";

    const variants = {
        success: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
        warning: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
        error: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
        info: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
        gray: "bg-gray-100 dark:bg-[#333] text-gray-600 dark:text-[#aaa]"
    };

    const sizes = {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-1 text-xs"
    };

    return (
        <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </span>
    );
};
