import React from 'react';
import { Tooltip } from './Tooltip';
import { ICON_SIZE, type ControlSize, type IconComponent } from './types';
import { cn } from './utils';

export type ActionButtonColor = 'green' | 'blue' | 'red' | 'orange' | 'gray' | 'indigo' | 'error';
export type ActionButtonVariant = 'solid' | 'ghost';

export interface ActionButtonClassNames {
    icon?: string;
}

type ActionButtonNativeProps = Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'onClick' | 'disabled' | 'color' | 'title'
>;

export interface ActionButtonProps extends ActionButtonNativeProps {
    icon: IconComponent;
    onClick: (e: React.MouseEvent) => void;
    disabled?: boolean | (() => boolean);
    tooltip?: string | { enabled: string; disabled: string };
    color?: ActionButtonColor;
    variant?: ActionButtonVariant;
    className?: string;
    classNames?: ActionButtonClassNames;
    size?: ControlSize;
    ref?: React.Ref<HTMLButtonElement>;
}

export const ActionButton = ({
    icon: Icon,
    onClick,
    disabled = false,
    tooltip,
    color = 'gray',
    variant = 'ghost',
    className = '',
    classNames,
    size = 'md',
    ref,
    ...props
}: ActionButtonProps) => {
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

    // The padding grows with the icon so the hit area keeps its proportions.
    const paddings: Record<ControlSize, string> = { sm: "p-1", md: "p-1.5", lg: "p-2" };

    const getTooltip = () => {
        if (!tooltip) return undefined;
        if (typeof tooltip === 'string') return tooltip;
        return isDisabled ? tooltip.disabled : tooltip.enabled;
    };

    const tooltipText = getTooltip();

    const button = (
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
                "transition-all rounded-full flex items-center justify-center",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                paddings[size],
                colorClasses[color],
                variantClasses,
                className
            )}
            aria-label={props['aria-label'] ?? tooltipText}
            {...props}
        >
            <Icon size={ICON_SIZE[size]} className={cn(classNames?.icon)} aria-hidden />
        </button>
    );

    /*
     * The button shows an icon only, so `tooltip` does two jobs: it is the
     * accessible name (above) and the visible explanation (here).
     *
     * It used to be a native `title` for both, which fails at each: `title` is
     * invisible on touch devices and unreliably announced. The name now comes
     * from `aria-label`, which always works, and the visible half from a real
     * tooltip element. A caller-supplied `aria-label` still wins over both.
     */
    if (!tooltipText) return button;

    return <Tooltip content={tooltipText}>{button}</Tooltip>;
};
