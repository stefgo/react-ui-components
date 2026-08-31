import React from 'react';
import { cn } from './utils';

export type ActionButtonColor = 'green' | 'blue' | 'red' | 'orange' | 'gray' | 'indigo' | 'error';
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
            ? "text-text-muted dark:text-text-muted-dark opacity-30 cursor-not-allowed"
            : "text-text-muted dark:text-text-muted-dark hover:text-success hover:bg-hover dark:hover:text-success-dark dark:hover:bg-hover-dark",
        blue: isDisabled
            ? "text-text-muted dark:text-text-muted-dark opacity-30 cursor-not-allowed"
            : "text-text-muted dark:text-text-muted-dark hover:text-info hover:bg-hover dark:hover:text-info-dark dark:hover:bg-hover-dark",
        red: isDisabled
            ? "text-text-muted dark:text-text-muted-dark opacity-30 cursor-not-allowed"
            : "text-text-muted dark:text-text-muted-dark hover:text-error hover:bg-hover dark:hover:text-error-dark dark:hover:bg-hover-dark",
        orange: isDisabled
            ? "text-text-muted dark:text-text-muted-dark opacity-30 cursor-not-allowed"
            : "text-text-muted dark:text-text-muted-dark hover:text-primary hover:bg-warning-bg dark:hover:text-primary-hover dark:hover:bg-warning-bg-dark",
        gray: isDisabled
            ? "text-text-muted dark:text-text-muted-dark opacity-30 cursor-not-allowed"
            : "text-text-muted dark:text-text-muted-dark hover:text-text-secondary hover:bg-hover dark:hover:text-text-secondary-dark dark:hover:bg-hover-dark",
        indigo: isDisabled
            ? "text-text-muted dark:text-text-muted-dark opacity-30 cursor-not-allowed"
            : "text-text-muted dark:text-text-muted-dark hover:text-accent hover:bg-accent-bg dark:hover:text-accent-dark dark:hover:bg-accent-bg-dark",
        error: isDisabled
            ? "text-text-muted dark:text-text-muted-dark opacity-30 cursor-not-allowed"
            : "text-error/60 dark:text-error-dark/50 hover:text-error hover:bg-error-bg dark:hover:text-error-dark dark:hover:bg-error-bg-dark",
        };

    const variantClasses = variant === 'solid' && !isDisabled
        ? "bg-hover dark:bg-hover-dark shadow-sm"
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
