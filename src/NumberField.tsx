import { ReactNode } from 'react';
import { Input, type InputClassNames } from './Input';

export interface NumberFieldProps {
    label: string;
    /** The number as a string: that is how a settings store and a query string hold it. */
    value: string;
    onChange: (value: string) => void;
    /** The lowest value accepted; anything below, or nothing at all, becomes this. Default 0. */
    min?: number;
    placeholder?: string;
    hint?: ReactNode;
    error?: string;
    disabled?: boolean;
    className?: string;
    classNames?: InputClassNames;
}

/**
 * A whole number, kept as a string and clamped to `min` as it is typed.
 *
 * Every settings section wrote this label, field and hint out by hand, with
 * the clamping repeated in each `onChange` -- and by hand the label was not
 * tied to its field. Here it is an `Input`, so the label, the hint and the
 * error are wired like those of every other control.
 */
export const NumberField = ({ label, value, onChange, min = 0, ...rest }: NumberFieldProps) => (
    <Input
        type="number"
        inputMode="numeric"
        label={label}
        min={min}
        value={value}
        onChange={(e) => onChange(String(Math.max(min, parseInt(e.target.value, 10) || min)))}
        {...rest}
    />
);
