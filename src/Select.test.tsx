import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Select } from './Select';

const options = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
];

describe('Select', () => {
    it('associates the label with the field', () => {
        render(<Select label="Schedule" options={options} />);
        expect(screen.getByRole('combobox', { name: /schedule/i })).toBeInTheDocument();
    });

    it('marks the field invalid and announces the error', () => {
        render(<Select label="Schedule" options={options} error="Pick one" />);

        const field = screen.getByRole('combobox', { name: /schedule/i });
        expect(field).toHaveAttribute('aria-invalid', 'true');
        expect(field).toHaveAccessibleDescription('Pick one');
        expect(screen.getByRole('alert')).toHaveTextContent('Pick one');
    });

    it('renders every option', () => {
        render(<Select label="Schedule" options={options} />);
        expect(screen.getAllByRole('option')).toHaveLength(2);
    });

    // Select never had a hint before it shared FormField with Input; the two
    // copies of the wiring had drifted apart. This pins that they no longer can.
    it('describes the field with the hint', () => {
        render(<Select label="Schedule" options={options} hint="Runs in local time" />);
        expect(screen.getByRole('combobox')).toHaveAccessibleDescription('Runs in local time');
    });
});
