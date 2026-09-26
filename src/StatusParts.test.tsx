import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pencil, Trash2 } from 'lucide-react';
import { ActionMenu, MenuItem } from './ActionMenu';
import { StatusDot, StatusDotProvider } from './StatusDot';
import { ConnectionBanner } from './ConnectionBanner';
import { EmptyState } from './EmptyState';
import { ManualRun } from './ManualRun';
import { ConfirmProvider } from './confirm/ConfirmProvider';

const anchor = { top: 100, bottom: 120, left: 40, right: 90 };

const Menu = ({ onEdit = vi.fn(), onDelete = vi.fn() }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <ActionMenu isOpen={isOpen} onClose={() => setIsOpen(false)} anchor={anchor}>
            <MenuItem icon={Pencil} onClick={onEdit}>Edit</MenuItem>
            <MenuItem icon={Trash2} onClick={onDelete} variant="danger" disabled disabledTitle="Still in use">
                Delete
            </MenuItem>
        </ActionMenu>
    );
};

describe('MenuItem', () => {
    it('runs its action and closes the menu it sits in', async () => {
        const onEdit = vi.fn();
        render(<Menu onEdit={onEdit} />);

        await userEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
        expect(onEdit).toHaveBeenCalledOnce();
        // Closing is the entry's job now, not every caller's.
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('does nothing while disabled, and says why', async () => {
        const onDelete = vi.fn();
        render(<Menu onDelete={onDelete} />);

        const entry = screen.getByRole('menuitem', { name: 'Delete' });
        expect(entry).toBeDisabled();
        expect(entry).toHaveAttribute('title', 'Still in use');
        await userEvent.click(entry);
        expect(onDelete).not.toHaveBeenCalled();
        expect(screen.getByRole('menu')).toBeInTheDocument();
    });
});

describe('StatusDot', () => {
    it('names the state when given a label', () => {
        render(<StatusDot tone="success" label="online" />);
        expect(screen.getByRole('img', { name: 'online' })).toBeInTheDocument();
    });

    it('stays out of the accessibility tree without one', () => {
        const { container } = render(<StatusDot tone="error" />);
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
        expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
    });
});

describe('StatusDotProvider', () => {
    it('stops the pulse while nothing is live', () => {
        const { rerender } = render(<StatusDotProvider live><StatusDot tone="success" label="online" /></StatusDotProvider>);
        expect(screen.getByRole('img').className).toMatch(/animate-pulse-glow/);

        rerender(<StatusDotProvider live={false}><StatusDot tone="success" label="online" /></StatusDotProvider>);
        expect(screen.getByRole('img').className).not.toMatch(/animate-/);
    });
});

describe('ConnectionBanner', () => {
    it('keeps its live region while connected, so the message is announced when it appears', () => {
        const { rerender } = render(<ConnectionBanner connected />);
        const region = screen.getByRole('status');
        expect(region).toBeEmptyDOMElement();

        rerender(<ConnectionBanner connected={false} />);
        expect(region).toHaveTextContent(/connection to the server lost/i);
    });
});

describe('EmptyState', () => {
    it('offers its action', () => {
        render(<EmptyState title="No clients yet" action={<button type="button">Add client</button>} />);
        expect(screen.getByText('No clients yet')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Add client' })).toBeInTheDocument();
    });
});

describe('ManualRun', () => {
    const renderRun = (onRun: () => Promise<string>) =>
        render(
            <ConfirmProvider>
                <ManualRun description="Deletes old runs." failureTitle="Cleanup failed" onRun={onRun} />
            </ConfirmProvider>
        );

    it('shows the result on the button', async () => {
        renderRun(async () => '12 removed');
        await userEvent.click(screen.getByRole('button', { name: 'Run Now' }));
        expect(await screen.findByRole('button', { name: '12 removed' })).toBeDisabled();
    });

    it('reports a failure in a notice', async () => {
        renderRun(async () => { throw new Error('disk full'); });
        await userEvent.click(screen.getByRole('button', { name: 'Run Now' }));
        const dialog = await screen.findByRole('dialog');
        expect(dialog).toHaveTextContent('Cleanup failed');
        expect(dialog).toHaveTextContent('disk full');
    });
});
