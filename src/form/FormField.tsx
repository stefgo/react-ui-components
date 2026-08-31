import { ReactNode } from 'react';
import { useFieldIds, type FieldIds } from './useFieldIds';
import { cn } from '../utils';

export interface FormFieldClassNames {
    label?: string;
    /** The box the control sits in. `relative`, so controls can position adornments. */
    control?: string;
    error?: string;
    hint?: string;
}

export interface FormFieldProps {
    label?: ReactNode;
    hint?: ReactNode;
    error?: string;
    required?: boolean;
    fullWidth?: boolean;
    /** Wins over the generated one, so a field can be addressed from outside. */
    id?: string;
    /** The caller's own `aria-describedby`; merged, not replaced. */
    describedBy?: string;
    className?: string;
    classNames?: FormFieldClassNames;
    /**
     * Render prop rather than plain children: the control needs the ids this
     * component generates, and passing them down is the whole point.
     */
    children: (ids: FieldIds) => ReactNode;
}

/**
 * Label, hint, error message and the full ARIA wiring around one control.
 *
 * Every control in the library sits in one of these, so the relationship
 * between a field and its message is decided once instead of per component.
 */
export const FormField = ({
    label,
    hint,
    error,
    required,
    fullWidth = true,
    id,
    describedBy,
    className = '',
    classNames,
    children
}: FormFieldProps) => {
    const ids = useFieldIds({ id, error, hint, describedBy });

    return (
        <div className={cn(fullWidth ? 'w-full' : '', className)}>
            {label && (
                <label
                    htmlFor={ids.id}
                    className={cn("block text-xs font-bold text-text-muted uppercase mb-1.5 ml-1", classNames?.label)}
                >
                    {label}
                    {/*
                        The asterisk is decoration: `required` on the control is
                        what assistive technology reads, and hearing "star" adds
                        nothing to it.
                    */}
                    {required && <span className="text-error" aria-hidden="true"> *</span>}
                </label>
            )}

            <div className={cn("relative", classNames?.control)}>
                {children(ids)}
            </div>

            {error && (
                <p id={ids.errorId} role="alert" className={cn("mt-1 text-xs text-error", classNames?.error)}>
                    {error}
                </p>
            )}
            {ids.showHint && (
                <p id={ids.hintId} className={cn("mt-1 text-xs text-text-muted leading-relaxed ml-1", classNames?.hint)}>
                    {hint}
                </p>
            )}
        </div>
    );
};
