import React from 'react';
import { cn } from './utils';

export type ActionButtonColor = 'green' | 'blue' | 'red' | 'orange' | 'gray' | 'indigo';
export type ActionButtonVariant = 'solid' | 'ghost';

export interface ActionButtonClassNames {
    root?: string;
    icon?: string;
}

interface ActionButtonProps {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    onClick: (e: React.MouseEvent) => void;
    disabled?: boolean | (() => boolean);
    tooltip?: string | { enabled: string; disabled: string };
    color?: ActionButtonColor;
    variant?: ActionButtonVariant;
    className?: string;
    classNames?: ActionButtonClassNames;
    size?: number;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
    icon: Icon,
    onClick,
    disabled = false,
    tooltip,
    color = 'gray',
    variant = 'ghost',
    className = '',
    classNames,
    size = 16,
}) => {
    const isDisabled = typeof disabled === 'function' ? disabled() : disabled;

    const colorClasses: Record<ActionButtonColor, string> = {
        green: isDisabled
            ? "text-inherit cursor-not-allowed"
            : "text-text-muted dark:text-text-muted-dark hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-dark",
        blue: isDisabled
            ? "text-inherit cursor-not-allowed"
            : "text-text-muted dark:text-text-muted-dark hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-dark",
        red: isDisabled
            ? "text-inherit cursor-not-allowed"
            : "text-red-400 hover:text-red-600 dark:text-red-500/50 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10",
        orange: isDisabled
            ? "text-inherit cursor-not-allowed"
            : "text-text-muted dark:text-text-muted-dark hover:text-primary dark:hover:text-primary-hover hover:bg-orange-50 dark:hover:bg-orange-900/10",
        gray: isDisabled
            ? "text-inherit cursor-not-allowed"
            : "text-text-muted dark:text-text-muted-dark hover:text-text-secondary dark:hover:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-dark",
        indigo: isDisabled
            ? "text-inherit cursor-not-allowed"
            : "text-text-muted dark:text-text-muted-dark hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10",
    };

    const variantClasses = variant === 'solid' && !isDisabled
        ? "bg-gray-100 dark:bg-[#252525] shadow-sm"
        : "";

    const getTooltip = () => {
        if (!tooltip) return undefined;
        if (typeof tooltip === 'string') return tooltip;
        return isDisabled ? tooltip.disabled : tooltip.enabled;
    };

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                if (!isDisabled) {
                    onClick(e);
                }
            }}
            disabled={isDisabled}
            className={cn(
                "p-1.5 transition-all rounded-full flex items-center justify-center",
                colorClasses[color],
                variantClasses,
                className,
                classNames?.root
            )}
            title={getTooltip()}
        >
            <Icon size={size} className={cn(classNames?.icon)} />
        </button>
    );
};
