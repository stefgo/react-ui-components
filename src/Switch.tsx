import { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { FormField, type FormFieldClassNames } from './form/FormField';
import { useControllableState } from './hooks/useControllableState';
import type { Controllable } from './types';
import { cn } from './utils';

export interface SwitchClassNames extends FormFieldClassNames {
    track?: string;
    thumb?: string;
}

interface SwitchProps
    extends Controllable<boolean>,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value' | 'defaultValue' | 'type'> {
    label?: ReactNode;
    hint?: ReactNode;
    error?: string;
    classNames?: SwitchClassNames;
    ref?: Ref<HTMLButtonElement>;
}

/**
 * An on/off control that takes effect immediately.
 *
 * A button with `role="switch"`, not a checkbox: a checkbox states an intention
 * that a submit button later carries out, whereas a switch *is* the action. The
 * two are announced differently, and the difference is real.
 */
export const Switch = ({
    label,
    hint,
    error,
    value,
    defaultValue,
    onChange,
    className = '',
    classNames,
    id,
    ref,
    disabled,
    ...props
}: SwitchProps) => {
    const [checked, setChecked] = useControllableState({
        value,
        defaultValue,
        onChange,
        fallback: false
    });

    return (
        <FormField
            label={label}
            hint={hint}
            error={error}
            layout="inline"
            id={id}
            describedBy={props['aria-describedby']}
            className={className}
            classNames={classNames}
        >
            {(ids) => (
                <button
                    ref={ref}
                    type="button"
                    id={ids.id}
                    role="switch"
                    aria-checked={checked}
                    aria-invalid={ids.invalid}
                    disabled={disabled}
                    onClick={() => setChecked((prev) => !prev)}
                    className={cn(
                        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-fast",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        checked ? "bg-primary" : "bg-button-secondary",
                        error && "ring-1 ring-error",
                        classNames?.track
                    )}
                    {...props}
                    aria-describedby={ids.describedBy}
                >
                    <span
                        aria-hidden="true"
                        className={cn(
                            "inline-block h-4 w-4 rounded-full bg-card shadow transition-transform duration-fast",
                            checked ? "translate-x-[1.125rem]" : "translate-x-0.5",
                            classNames?.thumb
                        )}
                    />
                </button>
            )}
        </FormField>
    );
};
