import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Modal } from './Modal';
import { ConfirmDialog } from './ConfirmDialog';

const Harness = ({ ...props }: Partial<Parameters<typeof Modal>[0]>) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button type="button" onClick={() => setOpen(true)}>Open</button>
            <Modal isOpen={open} onClose={() => setOpen(false)} title="Delete client" {...props}>
                <button type="button">Inside</button>
            </Modal>
        </>
    );
};

describe('Modal', () => {
    it('is a named modal dialog', () => {
        render(<Modal isOpen onClose={() => {}} title="Delete client" />);

        const dialog = screen.getByRole('dialog', { name: 'Delete client' });
        expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('describes itself when a description is given', () => {
        render(<Modal isOpen onClose={() => {}} title="Delete client" description="This cannot be undone." />);
        expect(screen.getByRole('dialog')).toHaveAccessibleDescription('This cannot be undone.');
    });

    it('renders nothing while closed', () => {
        render(<Modal isOpen={false} onClose={() => {}} title="Delete client" />);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes on Escape', async () => {
        const onClose = vi.fn();
        render(<Modal isOpen onClose={onClose} title="Delete client" />);

        await userEvent.keyboard('{Escape}');
        expect(onClose).toHaveBeenCalled();
    });

    it('closes through the close button', async () => {
        const onClose = vi.fn();
        render(<Modal isOpen onClose={onClose} title="Delete client" />);

        await userEvent.click(screen.getByRole('button', { name: /close dialog/i }));
        expect(onClose).toHaveBeenCalled();
    });

    it('leaves out the close button when asked', () => {
        render(<Modal isOpen onClose={() => {}} title="Delete client" hideCloseButton />);
        expect(screen.queryByRole('button', { name: /close dialog/i })).not.toBeInTheDocument();
    });

    it('moves focus inside on open and back to the trigger on close', async () => {
        render(<Harness />);

        const trigger = screen.getByRole('button', { name: 'Open' });
        await userEvent.click(trigger);
        // The first focusable thing in the dialog takes focus, so the keyboard
        // is already inside rather than still behind the overlay.
        expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);

        await userEvent.keyboard('{Escape}');
        expect(trigger).toHaveFocus();
    });

    it('locks the page behind it', () => {
        const { unmount } = render(<Modal isOpen onClose={() => {}} title="Delete client" />);
        expect(document.body.style.overflow).toBe('hidden');

        unmount();
        expect(document.body.style.overflow).not.toBe('hidden');
    });
});

describe('ConfirmDialog', () => {
    it('offers exactly cancel and confirm', () => {
        render(
            <ConfirmDialog isOpen onClose={() => {}} onConfirm={() => {}} title="Delete client?" />
        );

        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });

    it('reports the two answers separately', async () => {
        const onConfirm = vi.fn();
        const onClose = vi.fn();
        render(
            <ConfirmDialog isOpen onClose={onClose} onConfirm={onConfirm} title="Delete client?" />
        );

        await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));
        expect(onConfirm).toHaveBeenCalledTimes(1);
        expect(onClose).not.toHaveBeenCalled();
    });

    it('blocks both buttons while confirming', () => {
        render(
            <ConfirmDialog
                isOpen
                onClose={() => {}}
                onConfirm={() => {}}
                title="Delete client?"
                confirmLabel="Delete"
                isConfirming
            />
        );

        expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
        expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
    });
});
