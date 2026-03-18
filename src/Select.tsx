import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from './utils';

export interface SelectClassNames {
    root?: string;
    label?: string;
    select?: string;
    selectWrapper?: string;
    error?: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
    options: { value: string | number; label: string; disabled?: boolean }[];
    classNames?: SelectClassNames;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
    label,
    error,
    fullWidth = true,
    options,
    className = '',
    classNames,
    ...props
}, ref) => {
    return (
        <div className={cn(fullWidth ? 'w-full' : '', className, classNames?.root)}>
            {label && (
                <label className={cn("block text-xs font-bold text-text-muted dark:text-text-muted-dark uppercase mb-1.5 ml-1", classNames?.label)}>
                    {label} {props.required && <span className="text-error">*</span>}
                </label>
            )}
            <div className={cn("relative", classNames?.selectWrapper)}>
                <select
                    ref={ref}
                    className={cn(
                        "block w-full bg-input-bg dark:bg-input-bg-dark border",
                        error ? 'border-error' : 'border-input-border dark:border-input-border-dark',
                        "px-3 py-2.5 rounded-lg text-text-primary dark:text-text-primary-dark",
                        "focus:outline-none focus:ring-2 focus:ring-primary",
                        "transition-all sm:text-sm appearance-none",
                        classNames?.select
                    )}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {/* Custom arrow could go here */}
            </div>
            {error && <p className={cn("mt-1 text-xs text-error", classNames?.error)}>{error}</p>}
        </div>
    );
});

Select.displayName = 'Select';
