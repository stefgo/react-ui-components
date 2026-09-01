import { ReactNode, Ref, TextareaHTMLAttributes } from 'react';
import { FormField, type FormFieldClassNames } from './form/FormField';
import { cn } from './utils';

export interface TextareaClassNames extends FormFieldClassNames {
    textarea?: string;
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    hint?: ReactNode;
    error?: string;
    fullWidth?: boolean;
    classNames?: TextareaClassNames;
    ref?: Ref<HTMLTextAreaElement>;
}

export const Textarea = ({
    label,
    hint,
    error,
    fullWidth = true,
    rows = 4,
    className = '',
    classNames,
    id,
    ref,
    ...props
}: TextareaProps) => (
    <FormField
        label={label}
        hint={hint}
        error={error}
        required={props.required}
        fullWidth={fullWidth}
        id={id}
        describedBy={props['aria-describedby']}
        className={className}
        classNames={classNames}
    >
        {(ids) => (
            <textarea
                ref={ref}
                id={ids.id}
                rows={rows}
                aria-invalid={ids.invalid}
                className={cn(
                    "block w-full bg-input-bg border",
                    error ? 'border-error' : 'border-input-border',
                    "px-3 py-2.5 rounded-md text-text-primary placeholder:text-text-muted",
                    "focus:outline focus:outline-2 focus:outline-offset-0 focus:outline-primary",
                    // Vertical only: horizontal resizing breaks the form layout
                    // it sits in, and there is nothing to gain from it.
                    "transition-colors sm:text-sm resize-y",
                    classNames?.textarea
                )}
                {...props}
                aria-describedby={ids.describedBy}
            />
        )}
    </FormField>
);
