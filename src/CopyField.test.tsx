import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CopyField } from './CopyField';

const withClipboard = (writeText: ((text: string) => Promise<void>) | undefined) => {
    Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: writeText ? { writeText } : undefined
    });
};

describe('CopyField', () => {
    afterEach(() => {
        withClipboard(undefined);
    });

    it('names the field and shows the value', () => {
        render(<CopyField value="tok_123" aria-label="Registration token" />);
        expect(screen.getByRole('textbox', { name: 'Registration token' })).toHaveValue('tok_123');
    });

    it('copies the value and says so on the button', async () => {
        // After `setup()`: user-event installs a clipboard of its own there.
        const user = userEvent.setup();
        const writeText = vi.fn().mockResolvedValue(undefined);
        withClipboard(writeText);
        render(<CopyField value="tok_123" aria-label="Registration token" />);

        await user.click(screen.getByRole('button', { name: 'Copy to clipboard' }));

        expect(writeText).toHaveBeenCalledWith('tok_123');
        expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
        expect(screen.queryByRole('status')).toBeNull();
    });

    it('selects the value and explains itself where there is no clipboard', async () => {
        const user = userEvent.setup();
        withClipboard(undefined);
        render(<CopyField value="tok_123" aria-label="Registration token" />);

        await user.click(screen.getByRole('button', { name: 'Copy to clipboard' }));

        const field = screen.getByRole<HTMLInputElement>('textbox');
        expect(field).toHaveFocus();
        expect(field.value.slice(field.selectionStart!, field.selectionEnd!)).toBe('tok_123');
        expect(screen.getByRole('status')).toHaveTextContent(/not available/i);
        // No check mark for a copy that did not happen.
        expect(screen.queryByRole('button', { name: 'Copied!' })).toBeNull();
    });

    it('does the same when the browser refuses the copy', async () => {
        const user = userEvent.setup();
        withClipboard(vi.fn().mockRejectedValue(new Error('denied')));
        render(<CopyField value="tok_123" aria-label="Registration token" />);

        await user.click(screen.getByRole('button', { name: 'Copy to clipboard' }));

        expect(screen.getByRole('textbox')).toHaveFocus();
        expect(screen.getByRole('status')).toBeInTheDocument();
    });
});
