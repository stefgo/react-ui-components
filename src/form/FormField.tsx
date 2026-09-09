import { ReactNode } from 'react';
import { useFieldIds, type FieldIds } from './useFieldIds';
import { FieldMessages } from './FieldMessages';
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
    /**
     * `stacked` — label above the control, for text-like inputs.
     * `inline` — label beside it, for checkbox, radio and switch, where the
     * label is what you actually click.
     */
    layout?: 'stacked' | 'inline';
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
    layout = 'stacked',
    id,
    describedBy,
    className = '',
    classNames,
    children
}: FormFieldProps) => {
    const ids = useFieldIds({ id, error, hint, describedBy });
    const isInline = layout === 'inline';

    const labelElement = label && (
        <label
            htmlFor={ids.id}
            className={cn(
                isInline
                    ? "text-sm text-text-primary cursor-pointer select-none"
                    : "block text-xs font-bold text-text-muted uppercase mb-1.5 ml-1",
                classNames?.label
            )}
        >
            {label}
            {/*
                The asterisk is decoration: `required` on the control is what
                assistive technology reads, and hearing "star" adds nothing to it.
            */}
            {required && <span className="text-error" aria-hidden="true"> *</span>}
        </label>
    );

    const control = (
        <div className={cn(isInline ? "flex items-center" : "relative", classNames?.control)}>
            {children(ids)}
        </div>
    );

    return (
        <div className={cn(fullWidth && !isInline ? 'w-full' : '', className)}>
            {isInline ? (
                // Control first in the DOM as well as on screen, so tab order and
                // reading order agree with what the layout shows.
                <div className="flex items-center gap-2.5">
                    {control}
                    {labelElement}
                </div>
            ) : (
                <>
                    {labelElement}
                    {control}
                </>
            )}

            <FieldMessages ids={ids} hint={hint} error={error} classNames={classNames} />
        </div>
    );
};
