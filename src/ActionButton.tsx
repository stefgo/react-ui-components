import React from 'react';
import { cn } from './utils';

export type ActionButtonColor = 'green' | 'blue' | 'red' | 'orange' | 'gray' | 'indigo' | 'error';
export type ActionButtonVariant = 'solid' | 'ghost';

export interface ActionButtonClassNames {
    root?: string;
    icon?: string;
}

type ActionButtonNativeProps = Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'onClick' | 'disabled' | 'color' | 'title'
>;

interface ActionButtonProps extends ActionButtonNativeProps {
    icon: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>;
    onClick: (e: React.MouseEvent) => void;
    disabled?: boolean | (() => boolean);
    tooltip?: string | { enabled: string; disabled: string };
    color?: ActionButtonColor;
    variant?: ActionButtonVariant;
    className?: string;
    classNames?: ActionButtonClassNames;
    size?: number;
    ref?: React.Ref<HTMLButtonElement>;
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
    ref,
    ...props
}) => {
    const isDisabled = typeof disabled === 'function' ? disabled() : disabled;

    const colorClasses: Record<ActionButtonColor, string> = {
        green: isDisabled
            ? "text-text-muted opacity-30 cursor-not-allowed"
            : "text-text-muted hover:text-success hover:bg-hover",
        blue: isDisabled
            ? "text-text-muted opacity-30 cursor-not-allowed"
            : "text-text-muted hover:text-info hover:bg-hover",
        red: isDisabled
            ? "text-text-muted opacity-30 cursor-not-allowed"
            : "text-text-muted hover:text-error hover:bg-hover",
        orange: isDisabled
            ? "text-text-muted opacity-30 cursor-not-allowed"
            : "text-text-muted hover:text-primary hover:bg-warning-bg",
        gray: isDisabled
            ? "text-text-muted opacity-30 cursor-not-allowed"
            : "text-text-muted hover:text-text-secondary hover:bg-hover",
        indigo: isDisabled
            ? "text-text-muted opacity-30 cursor-not-allowed"
            : "text-text-muted hover:text-accent hover:bg-accent-bg",
        error: isDisabled
            ? "text-text-muted opacity-30 cursor-not-allowed"
            : "text-error/60 hover:text-error hover:bg-error-bg",
        };

    const variantClasses = variant === 'solid' && !isDisabled
        ? "bg-hover shadow-sm"
        : "";

    const getTooltip = () => {
        if (!tooltip) return undefined;
        if (typeof tooltip === 'string') return tooltip;
        return isDisabled ? tooltip.disabled : tooltip.enabled;
    };

    // The button renders an icon only, so the tooltip has to double as its
    // accessible name – `title` alone is not reliably announced.
    const tooltipText = getTooltip();

    return (
        <button
            ref={ref}
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                if (!isDisabled) {
                    onClick(e);
                }
            }}
            disabled={isDisabled}
            className={cn(
                "p-1.5 transition-all rounded-full flex items-center justify-center",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                colorClasses[color],
                variantClasses,
                className,
                classNames?.root
            )}
            title={tooltipText}
            aria-label={props['aria-label'] ?? tooltipText}
            {...props}
        >
            <Icon size={size} className={cn(classNames?.icon)} aria-hidden />
        </button>
    );
};
