import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from './utils';

export interface InputClassNames {
    root?: string;
    label?: string;
    input?: string;
    inputWrapper?: string;
    icon?: string;
    error?: string;
    hint?: string;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    hint?: ReactNode;
    error?: string;
    icon?: ReactNode;
    fullWidth?: boolean;
    classNames?: InputClassNames;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    hint,
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
                <label className={cn("block text-xs font-bold text-text-muted dark:text-text-muted-dark uppercase mb-2 ml-1", classNames?.label)}>
                    {label} {props.required && <span className="text-error">*</span>}
                </label>
            )}
            <div className={cn("relative space-y-1", classNames?.inputWrapper)}>
                {icon && (
                    <div className={cn("absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted", classNames?.icon)}>
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "block w-full bg-white dark:bg-card-dark border",
                        error ? 'border-error' : 'border-border dark:border-border-dark',
                        icon ? 'pl-10' : 'pl-3',
                        "pr-3 py-2.5 rounded-lg text-text-primary dark:text-text-primary-dark placeholder:text-text-muted dark:placeholder:text-text-muted-dark",
                        "focus:outline-none focus:ring-2 focus:ring-primary",
                        "transition-all sm:text-sm",
                        classNames?.input
                    )}
                    {...props}
                />
            </div>
            {error && <p className={cn("mt-1 text-xs text-error", classNames?.error)}>{error}</p>}
            {hint && !error && <p className={cn("mt-1 text-xs text-text-muted dark:text-text-muted-dark leading-relaxed ml-1", classNames?.hint)}>{hint}</p>}
        </div>
    );
});

Input.displayName = 'Input';
