import { ButtonHTMLAttributes, Ref } from 'react';
import { Loader2 } from 'lucide-react';
import { ICON_SIZE, type ControlSize, type IconComponent } from './types';
import { cn } from './utils';

export interface ButtonClassNames {
    icon?: string;
    spinner?: string;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: ControlSize;
    isLoading?: boolean;
    icon?: IconComponent;
    classNames?: ButtonClassNames;
    ref?: Ref<HTMLButtonElement>;
}

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
    const baseStyles = "relative inline-flex items-center justify-center font-semibold rounded-md transition-all focus:outline focus:outline-2 focus:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-button-primary hover:bg-button-primary-hover text-button-primary-text focus:outline-primary shadow-lg hover:shadow-primary/20 active:scale-[0.98]",
        secondary: "bg-button-secondary hover:bg-button-secondary-hover text-text-primary focus:outline-text-secondary",
        danger: "bg-button-danger hover:bg-button-danger-hover text-button-primary-text focus:outline-error shadow-sm",
        ghost: "bg-transparent hover:bg-hover text-text-secondary focus:outline-primary"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2.5 text-sm",
        lg: "px-6 py-3 text-base"
    };

    return (
        <button
            ref={ref}
            type={type}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
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
