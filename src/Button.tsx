import { ButtonHTMLAttributes, Ref } from 'react';
import { Loader2 } from 'lucide-react';
import { ICON_SIZE, type ControlSize, type IconComponent } from './types';
import { cn } from './utils';
import { FOCUS_RING, FOCUS_RING_ERROR } from './focus';

export interface ButtonClassNames {
    icon?: string;
    spinner?: string;
}

export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'ghost'
    | 'outline'
    | 'outline-danger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ControlSize;
    isLoading?: boolean;
    icon?: IconComponent;
    classNames?: ButtonClassNames;
    ref?: Ref<HTMLButtonElement>;
}

const BASE_STYLES = "relative inline-flex items-center justify-center font-semibold rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed";

/*
 * The tables live at module level, not in the render.
 *
 * Every entry ends in a `cn()` call, so building them inside the component ran
 * one tailwind-merge pass per variant on every render of every button -- a
 * table with fifty rows of three icon buttons paid for six hundred merges it
 * could not use. Nothing here depends on a prop, so it is computed once.
 *
 * The ring is part of the variant, not of `BASE_STYLES`: the two danger
 * variants draw it in the error colour, and a base that set the colour itself
 * would have to be overridden rather than completed.
 */
const VARIANTS: Record<ButtonVariant, string> = {
    primary: cn("bg-button-primary hover:bg-button-primary-hover text-button-primary-text shadow-lg hover:shadow-primary/20 active:scale-[0.98]", FOCUS_RING),
    secondary: cn("bg-button-secondary hover:bg-button-secondary-hover text-text-primary", FOCUS_RING),
    danger: cn("bg-button-danger hover:bg-button-danger-hover text-button-primary-text shadow-sm", FOCUS_RING_ERROR),
    ghost: cn("bg-transparent hover:bg-hover text-text-secondary", FOCUS_RING),
    // A bordered button on the page background, for an action that is offered
    // rather than recommended -- a download beside a destructive twin, a
    // secondary action in a toolbar. It was being built by hand out of `ghost`
    // plus a border in two different apps, which is what made it a variant.
    outline: cn("bg-transparent border border-primary text-primary hover:bg-primary/10", FOCUS_RING),
    // The same shape for a destructive action that must not shout: neutral at
    // rest, error-coloured under the pointer.
    'outline-danger': cn("bg-transparent border border-border text-text-muted hover:border-error hover:text-error", FOCUS_RING_ERROR)
};

const SIZES: Record<ControlSize, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
};

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon: Icon,
    className = '',
    classNames,
    disabled,
    type = 'button',
    ref,
    ...props
}: ButtonProps) => {
    return (
        <button
            ref={ref}
            type={type}
            className={cn(BASE_STYLES, VARIANTS[variant], SIZES[size], className)}
            disabled={disabled || isLoading}
            aria-busy={isLoading || undefined}
            {...props}
        >
            {isLoading && <Loader2 className={cn("w-4 h-4 mr-2 animate-spin", classNames?.spinner)} aria-hidden="true" />}
            {!isLoading && Icon && (
                <Icon size={ICON_SIZE[size]} className={cn("mr-2", classNames?.icon)} aria-hidden />
            )}
            {children}
        </button>
    );
};
