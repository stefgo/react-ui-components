import { InputHTMLAttributes, ReactNode, forwardRef, useId } from 'react';
import { ICON_SIZE, type IconComponent } from './types';
import { cn } from './utils';

export interface InputClassNames {
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
    icon?: IconComponent;
    fullWidth?: boolean;
    classNames?: InputClassNames;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    hint,
    error,
    icon: Icon,
    fullWidth = true,
    className = '',
    classNames,
    id,
    ...props
}, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    // The hint is hidden while an error is shown, so it must not be announced either.
    const showHint = Boolean(hint) && !error;
    const describedBy = [
        error ? errorId : null,
        showHint ? hintId : null,
        props['aria-describedby']
    ].filter(Boolean).join(' ') || undefined;

    return (
        <div className={cn(fullWidth ? 'w-full' : '', className)}>
            {label && (
                <label
                    htmlFor={inputId}
                    className={cn("block text-xs font-bold text-text-muted uppercase mb-2 ml-1", classNames?.label)}
                >
                    {label} {props.required && <span className="text-error" aria-hidden="true">*</span>}
                </label>
            )}
            <div className={cn("relative space-y-1", classNames?.inputWrapper)}>
                {Icon && (
                    <div className={cn("absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted", classNames?.icon)} aria-hidden="true">
                        <Icon size={ICON_SIZE.lg} />
                    </div>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    aria-invalid={error ? true : undefined}
                    className={cn(
                        "block w-full bg-input-bg border",
                        error ? 'border-error' : 'border-input-border',
                        Icon ? 'pl-10' : 'pl-3',
                        "pr-3 py-2.5 rounded-md text-text-primary placeholder:text-text-muted",
                        "focus:outline-none focus:ring-2 focus:ring-primary",
                        "transition-all sm:text-sm",
                        classNames?.input
                    )}
                    {...props}
                    aria-describedby={describedBy}
                />
            </div>
            {error && <p id={errorId} role="alert" className={cn("mt-1 text-xs text-error", classNames?.error)}>{error}</p>}
            {showHint && <p id={hintId} className={cn("mt-1 text-xs text-text-muted leading-relaxed ml-1", classNames?.hint)}>{hint}</p>}
        </div>
    );
});

Input.displayName = 'Input';
