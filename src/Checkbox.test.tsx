import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';
import { Switch } from './Switch';
import { Textarea } from './Textarea';

describe('Checkbox', () => {
    it('is labelled and toggles by clicking the label', async () => {
        render(<Checkbox label="Run on weekends" />);

        const box = screen.getByRole('checkbox', { name: 'Run on weekends' });
        expect(box).not.toBeChecked();

        // The label is the larger target, and it must work like the box itself.
        await userEvent.click(screen.getByText('Run on weekends'));
        expect(box).toBeChecked();
    });

    it('toggles with the space key', async () => {
        render(<Checkbox label="Run on weekends" />);

        await userEvent.tab();
        await userEvent.keyboard(' ');
        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('reports the third state as indeterminate', () => {
        render(<Checkbox label="Select all" indeterminate />);
        // A DOM property, not an attribute — an unchecked box would otherwise
        // claim that nothing at all is selected.
        expect(screen.getByRole('checkbox')).toBePartiallyChecked();
    });

    it('announces its error', () => {
        render(<Checkbox label="Accept" error="Required to continue" />);

        const box = screen.getByRole('checkbox');
        expect(box).toHaveAttribute('aria-invalid', 'true');
        expect(box).toHaveAccessibleDescription('Required to continue');
    });
});

describe('Switch', () => {
    it('is a switch, not a checkbox', () => {
        render(<Switch label="Enable tunnel" />);

        const control = screen.getByRole('switch', { name: 'Enable tunnel' });
        expect(control).toHaveAttribute('aria-checked', 'false');
    });

    it('reports every flip and can be driven from outside', async () => {
        const onChange = vi.fn();
        render(<Switch label="Enable tunnel" value={false} onChange={onChange} />);

        await userEvent.click(screen.getByRole('switch'));

        expect(onChange).toHaveBeenCalledWith(true);
        // Controlled: the caller said false and did not change its mind.
        expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    });

    it('keeps its own state when uncontrolled', async () => {
        render(<Switch label="Enable tunnel" defaultValue />);

        await userEvent.click(screen.getByRole('switch'));
        expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    });
});

describe('Textarea', () => {
    it('is labelled and describable like every other control', () => {
        render(<Textarea label="Notes" hint="Markdown is allowed" />);

        const field = screen.getByRole('textbox', { name: /notes/i });
        expect(field).toHaveAccessibleDescription('Markdown is allowed');
    });

    it('announces its error instead of the hint', () => {
        render(<Textarea label="Notes" hint="Markdown is allowed" error="Too long" />);

        const field = screen.getByRole('textbox');
        expect(field).toHaveAttribute('aria-invalid', 'true');
        expect(field).toHaveAccessibleDescription('Too long');
    });
});
