import { SelectHTMLAttributes, forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from './utils';

export interface SelectClassNames {
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
    id,
    ...props
}, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const errorId = `${selectId}-error`;

    const describedBy = [
        error ? errorId : null,
        props['aria-describedby']
    ].filter(Boolean).join(' ') || undefined;

    return (
        <div className={cn(fullWidth ? 'w-full' : '', className)}>
            {label && (
                <label
                    htmlFor={selectId}
                    className={cn("block text-xs font-bold text-text-muted uppercase mb-1.5 ml-1", classNames?.label)}
                >
                    {label} {props.required && <span className="text-error" aria-hidden="true">*</span>}
                </label>
            )}
            <div className={cn("relative", classNames?.selectWrapper)}>
                <select
                    ref={ref}
                    id={selectId}
                    aria-invalid={error ? true : undefined}
                    className={cn(
                        "block w-full bg-input-bg border",
                        error ? 'border-error' : 'border-input-border',
                        "pl-3 pr-10 py-2.5 rounded-md text-text-primary",
                        "focus:outline-none focus:ring-2 focus:ring-primary",
                        "transition-all sm:text-sm appearance-none",
                        classNames?.select
                    )}
                    {...props}
                    aria-describedby={describedBy}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {/* `appearance-none` removes the native arrow, so supply one. */}
                <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
            </div>
            {error && <p id={errorId} role="alert" className={cn("mt-1 text-xs text-error", classNames?.error)}>{error}</p>}
        </div>
    );
});

Select.displayName = 'Select';
