import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio, RadioGroup } from './Radio';

const group = (props: Partial<Parameters<typeof RadioGroup>[0]> = {}) =>
    render(
        <RadioGroup label="Schedule" {...props}>
            <Radio value="daily" label="Daily" />
            <Radio value="weekly" label="Weekly" />
            <Radio value="monthly" label="Monthly" />
        </RadioGroup>
    );

describe('RadioGroup', () => {
    it('names the group as well as each option', () => {
        group();
        // Without the fieldset's legend, a screen reader announces "Daily, radio
        // button" and never says what is being chosen. The role is radiogroup
        // rather than the fieldset's native group, so aria-required is legal —
        // which means the name now rides on an explicit aria-labelledby.
        expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-labelledby');
        expect(screen.getByRole('radiogroup', { name: /schedule/i })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: 'Daily' })).toBeInTheDocument();
    });

    it('lets only one option be selected', async () => {
        group();

        await userEvent.click(screen.getByRole('radio', { name: 'Daily' }));
        expect(screen.getByRole('radio', { name: 'Daily' })).toBeChecked();

        await userEvent.click(screen.getByRole('radio', { name: 'Weekly' }));
        expect(screen.getByRole('radio', { name: 'Daily' })).not.toBeChecked();
        expect(screen.getByRole('radio', { name: 'Weekly' })).toBeChecked();
    });

    it('moves the selection with the arrow keys', async () => {
        group({ defaultValue: 'daily' });

        await userEvent.tab();
        await userEvent.keyboard('{ArrowDown}');

        // Native radio behaviour, kept by restyling the input rather than
        // replacing it with a div.
        expect(screen.getByRole('radio', { name: 'Weekly' })).toBeChecked();
    });

    it('exposes one tab stop, not three', async () => {
        group({ defaultValue: 'weekly' });

        await userEvent.tab();
        expect(screen.getByRole('radio', { name: 'Weekly' })).toHaveFocus();

        await userEvent.tab();
        expect(screen.getByRole('radio', { name: 'Monthly' })).not.toHaveFocus();
    });

    it('reports the chosen value', async () => {
        const onChange = vi.fn();
        group({ onChange });

        await userEvent.click(screen.getByRole('radio', { name: 'Monthly' }));
        expect(onChange).toHaveBeenCalledWith('monthly');
    });

    it('follows the caller when controlled', async () => {
        const onChange = vi.fn();
        group({ value: 'daily', onChange });

        await userEvent.click(screen.getByRole('radio', { name: 'Weekly' }));

        expect(onChange).toHaveBeenCalledWith('weekly');
        expect(screen.getByRole('radio', { name: 'Daily' })).toBeChecked();
    });

    it('disables every option at once', () => {
        group({ disabled: true });
        expect(screen.getByRole('radio', { name: 'Daily' })).toBeDisabled();
    });

    it('announces the error on the group, where the question is', () => {
        group({ error: 'Pick a schedule' });

        const fieldset = screen.getByRole('radiogroup');
        expect(fieldset).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByRole('alert')).toHaveTextContent('Pick a schedule');
    });

    it('replaces the hint with the error, on screen and in the description', () => {
        // The group renders its own fieldset rather than sitting in a FormField,
        // so this is the one place the shared FieldMessages rule could drift.
        const { rerender } = group({ hint: 'Runs at 03:00' });
        expect(screen.getByText('Runs at 03:00')).toBeInTheDocument();

        rerender(
            <RadioGroup label="Schedule" hint="Runs at 03:00" error="Pick a schedule">
                <Radio value="daily" label="Daily" />
            </RadioGroup>
        );

        expect(screen.queryByText('Runs at 03:00')).not.toBeInTheDocument();
        const describedBy = screen.getByRole('radiogroup').getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
        expect(document.getElementById(describedBy!)).toHaveTextContent('Pick a schedule');
    });

    it('marks a required group in a way ARIA actually allows', () => {
        // aria-required is only legal on a widget role. On the fieldset's native
        // `group` role it was silently ignored, so the asterisk in the legend —
        // which is aria-hidden — was the only trace of required left.
        group({ required: true });
        expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-required', 'true');
    });

    it('refuses to render an option outside a group', () => {
        const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => render(<Radio value="daily" label="Daily" />)).toThrow(/RadioGroup/);
        quiet.mockRestore();
    });
});
