import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
    it('associates the label with the field', () => {
        render(<Input label="Server URL" />);
        expect(screen.getByRole('textbox', { name: /server url/i })).toBeInTheDocument();
    });

    it('marks the field invalid and announces the error', () => {
        render(<Input label="Port" error="Must be a number" />);

        const field = screen.getByRole('textbox', { name: /port/i });
        expect(field).toHaveAttribute('aria-invalid', 'true');
        expect(field).toHaveAccessibleDescription('Must be a number');
        expect(screen.getByRole('alert')).toHaveTextContent('Must be a number');
    });

    it('describes the field with the hint when there is no error', () => {
        render(<Input label="Port" hint="Defaults to 8007" />);
        expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Defaults to 8007');
    });

    it('does not announce the hint while an error is shown', () => {
        render(<Input label="Port" hint="Defaults to 8007" error="Must be a number" />);
        expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Must be a number');
    });

    it('keeps a caller-supplied id and aria-describedby', () => {
        render(
            <>
                <span id="external">External note</span>
                <Input label="Port" id="port-field" aria-describedby="external" error="Bad" />
            </>
        );

        const field = screen.getByRole('textbox', { name: /port/i });
        expect(field).toHaveAttribute('id', 'port-field');
        expect(field).toHaveAccessibleDescription('Bad External note');
    });
});
