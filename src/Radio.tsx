import { InputHTMLAttributes, ReactNode, Ref, createContext, useContext, useId } from 'react';
import { useFieldIds } from './form/useFieldIds';
import { useControllableState } from './hooks/useControllableState';
import type { Controllable } from './types';
import { cn } from './utils';

interface RadioGroupContextValue {
    name: string;
    value: string | undefined;
    onSelect: (value: string) => void;
    invalid: boolean;
    disabled: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioClassNames {
    input?: string;
    dot?: string;
    label?: string;
}

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
    /** The value this option contributes when selected. */
    value: string;
    label?: ReactNode;
    classNames?: RadioClassNames;
    ref?: Ref<HTMLInputElement>;
}

/**
 * One option. Must sit inside a `RadioGroup`, which owns the name, the
 * selection and the keyboard behaviour.
 */
export const Radio = ({ value, label, className = '', classNames, id, ref, disabled, ...props }: RadioProps) => {
    const group = useContext(RadioGroupContext);
    if (!group) {
        throw new Error('Radio must be used inside a <RadioGroup>.');
    }

    const generatedId = useId();
    const inputId = id ?? generatedId;
    const isDisabled = disabled || group.disabled;

    return (
        <div className={cn("flex items-center gap-2.5", className)}>
            <span className="relative inline-flex">
                <input
                    ref={ref}
                    type="radio"
                    id={inputId}
                    name={group.name}
                    value={value}
                    checked={group.value === value}
                    onChange={() => group.onSelect(value)}
                    disabled={isDisabled}
                    aria-invalid={group.invalid || undefined}
                    // Native radio, restyled rather than replaced: arrow-key
                    // navigation and the roving tab stop are browser behaviour,
                    // and re-implementing them is how they get subtly wrong.
                    className={cn("peer appearance-none w-4 h-4 m-0 cursor-pointer disabled:cursor-not-allowed", classNames?.input)}
                    {...props}
                />
                <span
                    aria-hidden="true"
                    className={cn(
                        "pointer-events-none absolute inset-0 flex items-center justify-center rounded-full border transition-colors",
                        "bg-input-bg text-transparent",
                        group.invalid ? "border-error" : "border-input-border",
                        "peer-checked:border-primary peer-checked:text-primary",
                        "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-1",
                        "peer-disabled:opacity-50",
                        classNames?.dot
                    )}
                >
                    <span className="w-2 h-2 rounded-full bg-current" />
                </span>
            </span>
            {label && (
                <label
                    htmlFor={inputId}
                    className={cn(
                        "text-sm text-text-primary select-none",
                        isDisabled ? "opacity-50" : "cursor-pointer",
                        classNames?.label
                    )}
                >
                    {label}
                </label>
            )}
        </div>
    );
};

export interface RadioGroupClassNames {
    legend?: string;
    options?: string;
    error?: string;
    hint?: string;
}

interface RadioGroupProps extends Controllable<string> {
    /** Names the group. Rendered as the `<legend>` of a `<fieldset>`. */
    label: ReactNode;
    children: ReactNode;
    hint?: ReactNode;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    /** Shared `name` for the inputs. Generated when omitted. */
    name?: string;
    orientation?: 'vertical' | 'horizontal';
    className?: string;
    classNames?: RadioGroupClassNames;
}

/**
 * A set of mutually exclusive options.
 *
 * A real `<fieldset>` with a `<legend>`, because that is what associates the
 * group's question with each option's answer — without it a screen reader
 * announces "Daily, radio button" and never says what is being chosen.
 */
export const RadioGroup = ({
    label,
    children,
    hint,
    error,
    required,
    disabled = false,
    name,
    value,
    defaultValue,
    onChange,
    orientation = 'vertical',
    className = '',
    classNames
}: RadioGroupProps) => {
    const generatedName = useId();
    const [selected, setSelected] = useControllableState<string | undefined>({
        value,
        defaultValue,
        onChange: onChange as ((next: string | undefined) => void) | undefined,
        fallback: undefined
    });

    const ids = useFieldIds({ error, hint });

    return (
        <fieldset
            className={className}
            aria-invalid={ids.invalid}
            aria-describedby={ids.describedBy}
            aria-required={required || undefined}
            disabled={disabled}
        >
            <legend className={cn("text-xs font-bold text-text-muted uppercase mb-1.5", classNames?.legend)}>
                {label}
                {required && <span className="text-error" aria-hidden="true"> *</span>}
            </legend>

            <RadioGroupContext.Provider
                value={{
                    name: name ?? generatedName,
                    value: selected,
                    onSelect: setSelected,
                    invalid: Boolean(error),
                    disabled
                }}
            >
                <div className={cn(
                    "flex gap-x-6 gap-y-2",
                    orientation === 'vertical' ? "flex-col" : "flex-row flex-wrap",
                    classNames?.options
                )}>
                    {children}
                </div>
            </RadioGroupContext.Provider>

            {error && (
                <p id={ids.errorId} role="alert" className={cn("mt-1 text-xs text-error", classNames?.error)}>
                    {error}
                </p>
            )}
            {ids.showHint && (
                <p id={ids.hintId} className={cn("mt-1 text-xs text-text-muted leading-relaxed", classNames?.hint)}>
                    {hint}
                </p>
            )}
        </fieldset>
    );
};
