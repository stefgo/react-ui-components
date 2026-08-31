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
        // button" and never says what is being chosen.
        expect(screen.getByRole('group', { name: /schedule/i })).toBeInTheDocument();
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

        const fieldset = screen.getByRole('group');
        expect(fieldset).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByRole('alert')).toHaveTextContent('Pick a schedule');
    });

    it('refuses to render an option outside a group', () => {
        const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => render(<Radio value="daily" label="Daily" />)).toThrow(/RadioGroup/);
        quiet.mockRestore();
    });
});
