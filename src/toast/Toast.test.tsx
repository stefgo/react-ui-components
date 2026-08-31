import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from './ToastProvider';
import type { ToastOptions } from './types';

const Trigger = ({ options }: { options: ToastOptions }) => {
    const { show } = useToast();
    return <button type="button" onClick={() => show(options)}>Raise</button>;
};

const setup = (options: ToastOptions, providerProps = {}) => {
    render(
        <ToastProvider {...providerProps}>
            <Trigger options={options} />
        </ToastProvider>
    );
    return screen.getByRole('button', { name: 'Raise' });
};

describe('ToastProvider', () => {
    it('shows what was raised', async () => {
        const trigger = setup({ title: 'Job started', description: 'Backup of pbs-node-01' });

        await userEvent.click(trigger);
        expect(screen.getByText('Job started')).toBeInTheDocument();
        expect(screen.getByText('Backup of pbs-node-01')).toBeInTheDocument();
    });

    it('announces politely, and interrupts only for errors', async () => {
        const trigger = setup({ title: 'Job failed', variant: 'error' });

        await userEvent.click(trigger);
        // An error is worth cutting in for; anything else waits its turn.
        expect(screen.getByRole('alert')).toHaveTextContent('Job failed');
    });

    it('uses a polite status for everything else', async () => {
        const trigger = setup({ title: 'Saved', variant: 'success' });

        await userEvent.click(trigger);
        expect(screen.getByRole('status')).toHaveTextContent('Saved');
    });

    it('dismisses through the close button', async () => {
        const trigger = setup({ title: 'Saved', duration: 0 });

        await userEvent.click(trigger);
        await userEvent.click(screen.getByRole('button', { name: /dismiss notification/i }));
        expect(screen.queryByText('Saved')).not.toBeInTheDocument();
    });

    it('runs the action and then dismisses', async () => {
        const onClick = vi.fn();
        const trigger = setup({ title: 'Deleted', duration: 0, action: { label: 'Undo', onClick } });

        await userEvent.click(trigger);
        await userEvent.click(screen.getByRole('button', { name: 'Undo' }));

        expect(onClick).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('Deleted')).not.toBeInTheDocument();
    });

    it('drops the oldest once the stack is full', async () => {
        const trigger = setup({ title: 'Saved', duration: 0 }, { limit: 2 });

        await userEvent.click(trigger);
        await userEvent.click(trigger);
        await userEvent.click(trigger);

        // A stack taller than the screen hides the content it reports on.
        expect(screen.getAllByRole('status')).toHaveLength(2);
    });

    it('throws when used without a provider', () => {
        // The alternative is a notification that silently never appears.
        const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => render(<Trigger options={{ title: 'x' }} />)).toThrow(/ToastProvider/);
        quiet.mockRestore();
    });
});

describe('ToastProvider timing', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    const clickRaise = () => {
        act(() => {
            screen.getByRole('button', { name: 'Raise' }).click();
        });
    };

    it('disappears on its own', () => {
        setup({ title: 'Saved', duration: 1000 });
        clickRaise();
        expect(screen.getByText('Saved')).toBeInTheDocument();

        act(() => { vi.advanceTimersByTime(1000); });
        expect(screen.queryByText('Saved')).not.toBeInTheDocument();
    });

    it('stays while duration is 0', () => {
        setup({ title: 'Job failed', variant: 'error', duration: 0 });
        clickRaise();

        act(() => { vi.advanceTimersByTime(60_000); });
        // An error the user has to act on must not vanish unread.
        expect(screen.getByText('Job failed')).toBeInTheDocument();
    });

    it('pauses the countdown while hovered', () => {
        setup({ title: 'Saved', duration: 1000 });
        clickRaise();

        act(() => { vi.advanceTimersByTime(600); });
        act(() => { screen.getByRole('status').dispatchEvent(new MouseEvent('mouseover', { bubbles: true })); });

        // Well past the original deadline, but the clock is stopped.
        act(() => { vi.advanceTimersByTime(5000); });
        expect(screen.getByText('Saved')).toBeInTheDocument();
    });

    it('resumes with the time that was left, not a fresh countdown', () => {
        setup({ title: 'Saved', duration: 1000 });
        clickRaise();

        act(() => { vi.advanceTimersByTime(600); });
        const toast = screen.getByRole('status');
        act(() => { toast.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })); });
        act(() => { vi.advanceTimersByTime(5000); });
        act(() => { toast.dispatchEvent(new MouseEvent('mouseout', { bubbles: true })); });

        // 400ms were left, so 399 is not yet enough...
        act(() => { vi.advanceTimersByTime(399); });
        expect(screen.getByText('Saved')).toBeInTheDocument();

        // ...and one more tick is.
        act(() => { vi.advanceTimersByTime(2); });
        expect(screen.queryByText('Saved')).not.toBeInTheDocument();
    });
});
