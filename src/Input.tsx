import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from './utils';

export interface InputClassNames {
    root?: string;
    label?: string;
    input?: string;
    inputWrapper?: string;
    icon?: string;
    error?: string;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: ReactNode;
    fullWidth?: boolean;
    classNames?: InputClassNames;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    icon,
    fullWidth = true,
    className = '',
    classNames,
    ...props
}, ref) => {
    return (
        <div className={cn(fullWidth ? 'w-full' : '', className, classNames?.root)}>
            {label && (
                <label className={cn("block text-xs font-bold text-text-muted dark:text-text-muted-dark uppercase mb-1.5 ml-1", classNames?.label)}>
                    {label} {props.required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className={cn("relative", classNames?.inputWrapper)}>
                {icon && (
                    <div className={cn("absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted", classNames?.icon)}>
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "block w-full bg-input-bg dark:bg-input-bg-dark border",
                        error ? 'border-red-500' : 'border-input-border dark:border-input-border-dark',
                        icon ? 'pl-10' : 'pl-3',
                        "pr-3 py-2.5 rounded-lg text-text-primary dark:text-text-primary-dark placeholder-text-muted",
                        "focus:outline-none focus:ring-2 focus:ring-app-accent/30 focus:border-app-accent focus:shadow-glow-accent",
                        "transition-all sm:text-sm",
                        classNames?.input
                    )}
                    {...props}
                />
            </div>
            {error && <p className={cn("mt-1 text-xs text-red-500", classNames?.error)}>{error}</p>}
        </div>
    );
});

Input.displayName = 'Input';
