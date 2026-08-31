import { ReactNode, Ref, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { FormField, type FormFieldClassNames } from './form/FormField';
import { ICON_SIZE } from './types';
import { cn } from './utils';

export interface SelectClassNames extends FormFieldClassNames {
    select?: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    hint?: ReactNode;
    error?: string;
    fullWidth?: boolean;
    options: { value: string | number; label: string; disabled?: boolean }[];
    classNames?: SelectClassNames;
    ref?: Ref<HTMLSelectElement>;
}

export const Select = ({
    label,
    hint,
    error,
    fullWidth = true,
    options,
    className = '',
    classNames,
    id,
    ref,
    ...props
}: SelectProps) => (
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
            <>
                <select
                    ref={ref}
                    id={ids.id}
                    aria-invalid={ids.invalid}
                    className={cn(
                        "block w-full bg-input-bg border",
                        error ? 'border-error' : 'border-input-border',
                        "pl-3 pr-10 py-2.5 rounded-md text-text-primary",
                        "focus:outline-none focus:ring-2 focus:ring-primary",
                        "transition-all sm:text-sm appearance-none",
                        classNames?.select
                    )}
                    {...props}
                    aria-describedby={ids.describedBy}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {/* `appearance-none` removes the native arrow, so supply one. */}
                <ChevronDown
                    size={ICON_SIZE.md}
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
            </>
        )}
    </FormField>
);
