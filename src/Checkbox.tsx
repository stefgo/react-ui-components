import { InputHTMLAttributes, ReactNode, Ref, useEffect, useRef } from 'react';
import { Check, Minus } from 'lucide-react';
import { FormField, type FormFieldClassNames } from './form/FormField';
import { cn } from './utils';

export interface CheckboxClassNames extends FormFieldClassNames {
    input?: string;
    box?: string;
}

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    label?: ReactNode;
    hint?: ReactNode;
    error?: string;
    /**
     * Neither checked nor unchecked — for a "select all" box over a partial
     * selection. It is a DOM property, not an attribute, so it has to be set
     * from JavaScript.
     */
    indeterminate?: boolean;
    classNames?: CheckboxClassNames;
    ref?: Ref<HTMLInputElement>;
}

export const Checkbox = ({
    label,
    hint,
    error,
    indeterminate = false,
    className = '',
    classNames,
    id,
    ref,
    ...props
}: CheckboxProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
        <FormField
            label={label}
            hint={hint}
            error={error}
            required={props.required}
            layout="inline"
            id={id}
            describedBy={props['aria-describedby']}
            className={className}
            classNames={classNames}
        >
            {(ids) => (
                <span className="relative inline-flex">
                    <input
                        ref={(node) => {
                            inputRef.current = node;
                            if (typeof ref === 'function') ref(node);
                            else if (ref) (ref as React.RefObject<HTMLInputElement | null>).current = node;
                        }}
                        type="checkbox"
                        id={ids.id}
                        aria-invalid={ids.invalid}
                        // A real checkbox, made invisible rather than replaced by a
                        // <div>: it keeps the native focus, keyboard and form
                        // behaviour, and only the appearance is ours.
                        className={cn("peer appearance-none w-4 h-4 m-0 cursor-pointer disabled:cursor-not-allowed", classNames?.input)}
                        {...props}
                        aria-describedby={ids.describedBy}
                    />
                    <span
                        aria-hidden="true"
                        className={cn(
                            "pointer-events-none absolute inset-0 flex items-center justify-center rounded-sm border transition-colors",
                            // The mark is drawn in `currentColor` and hidden by
                            // making that transparent. `peer-*` reaches this span
                            // because it is the input's sibling — it would not
                            // reach the icon inside it, which is only a descendant.
                            "bg-input-bg text-transparent",
                            error ? "border-error" : "border-input-border",
                            "peer-checked:bg-primary peer-checked:border-primary peer-checked:text-button-primary-text",
                            "peer-indeterminate:bg-primary peer-indeterminate:border-primary peer-indeterminate:text-button-primary-text",
                            "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-primary",
                            "peer-disabled:opacity-50",
                            classNames?.box
                        )}
                    >
                        {indeterminate
                            ? <Minus size={12} strokeWidth={3} />
                            : <Check size={12} strokeWidth={3} />}
                    </span>
                </span>
            )}
        </FormField>
    );
};
