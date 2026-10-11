import { ReactNode, Ref, SelectHTMLAttributes, useContext } from 'react';
import { ChevronDown } from 'lucide-react';
import { FormField, type FormFieldClassNames } from './form/FormField';
import { FieldVariantContext, PILL_SURFACE, type FieldVariant } from './form/fieldVariant';
import { ICON_SIZE } from './types';
import { cn } from './utils';
import { FOCUS_RING } from './focus';

export type { FieldVariant };

export interface SelectClassNames extends FormFieldClassNames {
    select?: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    hint?: ReactNode;
    error?: string;
    fullWidth?: boolean;
    /**
     * `field` for a form, `pill` for a row of filters. Leave it out and the
     * select is a `field` -- except in the search bar of a `DataMultiView`,
     * where it takes the shape of the search.
     */
    variant?: FieldVariant;
    options: { value: string | number; label: string; disabled?: boolean }[];
    classNames?: SelectClassNames;
    ref?: Ref<HTMLSelectElement>;
}

const VARIANTS: Record<FieldVariant, string> = {
    field: "bg-input-bg border border-input-border pl-3 pr-10 py-2.5 rounded-md sm:text-sm",
    // As high as the search of `DataMultiView`, which is `py-1` around `text-sm` too.
    pill: `${PILL_SURFACE} pl-3 pr-9 py-1 text-sm`,
};

export const Select = ({
    label,
    hint,
    error,
    fullWidth = true,
    variant,
    options,
    className = '',
    classNames,
    id,
    ref,
    ...props
}: SelectProps) => {
    const inherited = useContext(FieldVariantContext);

    return (
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
                            "block w-full text-text-primary transition appearance-none",
                            VARIANTS[variant ?? inherited],
                            error && 'border-error',
                            FOCUS_RING,
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
};
