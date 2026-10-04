import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { NumberField } from './NumberField';

const Field = ({ onChange, min }: { onChange?: (value: string) => void; min?: number }) => {
    const [value, setValue] = useState('30');
    return (
        <NumberField
            label="Retention (days)"
            hint="Older entries are removed."
            min={min}
            value={value}
            onChange={(next) => {
                setValue(next);
                onChange?.(next);
            }}
        />
    );
};

describe('NumberField', () => {
    it('ties the label and the hint to the field', () => {
        render(<Field />);

        const field = screen.getByRole('spinbutton', { name: 'Retention (days)' });
        expect(field).toHaveValue(30);
        expect(field).toHaveAccessibleDescription('Older entries are removed.');
    });

    it('reports the number as a string', () => {
        const onChange = vi.fn();
        render(<Field onChange={onChange} />);

        fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '45' } });
        expect(onChange).toHaveBeenLastCalledWith('45');
    });

    it('turns a value below the minimum, and an emptied field, into the minimum', () => {
        const onChange = vi.fn();
        render(<Field onChange={onChange} min={1} />);
        const field = screen.getByRole('spinbutton');

        fireEvent.change(field, { target: { value: '-5' } });
        expect(onChange).toHaveBeenLastCalledWith('1');

        fireEvent.change(field, { target: { value: '' } });
        expect(onChange).toHaveBeenLastCalledWith('1');
    });
});
