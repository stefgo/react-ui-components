import { ReactNode, Ref } from 'react';
import type { ControlSize } from './types';
import { cn } from './utils';

interface BadgeProps {
    children: ReactNode;
    variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
    size?: ControlSize;
    className?: string;
    ref?: Ref<HTMLSpanElement>;
}

export const Badge = ({
    children,
    variant = 'info',
    size = 'md',
    className = '',
    ref
}: BadgeProps) => {
    const baseStyles = "inline-flex items-center font-medium rounded-full transition-colors";

    const variants = {
        success: "bg-badge-success-bg text-badge-success-text",
        warning: "bg-badge-warning-bg text-badge-warning-text",
        error: "bg-badge-error-bg text-badge-error-text",
        info: "bg-badge-info-bg text-badge-info-text",
        neutral: "bg-badge-neutral-bg text-badge-neutral-text"
    };

    const sizes = {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm"
    };

    return (
        <span ref={ref} className={cn(baseStyles, variants[variant], sizes[size], className)}>
            {children}
        </span>
    );
};
