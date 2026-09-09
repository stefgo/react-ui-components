import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormField } from './FormField';

/**
 * These pin the contract every control now inherits, rather than re-testing it
 * once per control. `Input.test.tsx` and `Select.test.tsx` check that each
 * control is actually wired to it.
 */
describe('FormField', () => {
    const field = (props: Partial<Parameters<typeof FormField>[0]> = {}) =>
        render(
            <FormField label="Port" {...props}>
                {(ids) => (
                    <input
                        id={ids.id}
                        aria-invalid={ids.invalid}
                        aria-describedby={ids.describedBy}
                    />
                )}
            </FormField>
        );

    it('hands the control an id the label points at', () => {
        field();
        expect(screen.getByRole('textbox', { name: /port/i })).toBeInTheDocument();
    });

    it('leaves the field valid and undescribed when nothing is wrong', () => {
        field();

        const control = screen.getByRole('textbox');
        expect(control).not.toHaveAttribute('aria-invalid');
        expect(control).not.toHaveAttribute('aria-describedby');
    });

    it('announces the error and marks the field invalid', () => {
        field({ error: 'Must be a number' });

        const control = screen.getByRole('textbox');
        expect(control).toHaveAttribute('aria-invalid', 'true');
        expect(control).toHaveAccessibleDescription('Must be a number');
        expect(screen.getByRole('alert')).toHaveTextContent('Must be a number');
    });

    it('drops the hint from the description while an error is shown', () => {
        const { rerender } = field({ hint: 'Defaults to 8007' });
        expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Defaults to 8007');

        // The error replaces the hint on screen, so it has to replace it in the
        // description too — otherwise a hint is announced that is not visible.
        rerender(
            <FormField label="Port" hint="Defaults to 8007" error="Must be a number">
                {(ids) => <input id={ids.id} aria-describedby={ids.describedBy} />}
            </FormField>
        );
        expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Must be a number');
        expect(screen.queryByText('Defaults to 8007')).not.toBeInTheDocument();
    });

    it('merges the caller-supplied description instead of replacing it', () => {
        render(
            <>
                <span id="external">External note</span>
                <FormField label="Port" error="Bad" describedBy="external">
                    {(ids) => <input id={ids.id} aria-describedby={ids.describedBy} />}
                </FormField>
            </>
        );

        expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Bad External note');
    });

    it('keeps the required marker out of the accessible name', () => {
        field({ required: true });
        // The asterisk is decoration; `required` on the control is what carries
        // the meaning, so the name must not gain a stray "*".
        expect(screen.getByRole('textbox', { name: 'Port' })).toBeInTheDocument();
    });
});
