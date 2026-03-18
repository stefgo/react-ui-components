import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from './utils';

export interface ButtonClassNames {
    root?: string;
    icon?: string;
    spinner?: string;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: ReactNode;
    classNames?: ButtonClassNames;
}

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    className = '',
    classNames,
    disabled,
    ...props
}: ButtonProps) => {
    const baseStyles = "relative inline-flex items-center justify-center font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-button-primary hover:bg-button-primary-hover text-button-primary-text focus:ring-primary shadow-lg hover:shadow-primary/20 active:scale-[0.98]",
        secondary: "bg-button-secondary dark:bg-button-secondary-dark hover:bg-button-secondary-hover dark:hover:bg-button-secondary-dark-hover text-text-primary dark:text-text-primary-dark focus:ring-text-secondary",
        danger: "bg-button-danger hover:bg-button-danger-hover text-white focus:ring-error shadow-sm",
        ghost: "bg-transparent hover:bg-hover dark:hover:bg-hover-dark text-text-secondary dark:text-text-secondary-dark"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2.5 text-sm",
        lg: "px-6 py-3 text-base"
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className, classNames?.root)}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className={cn("w-4 h-4 mr-2 animate-spin", classNames?.spinner)} />}
            {!isLoading && icon && <span className={cn("mr-2", classNames?.icon)}>{icon}</span>}
            {children}
        </button>
    );
};
