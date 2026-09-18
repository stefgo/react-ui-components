import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmProvider, useConfirm } from './ConfirmProvider';
import type { ConfirmContextValue } from './types';

/** Hands the context out of the tree, so a test can call it like an event handler would. */
const setup = () => {
    let api: ConfirmContextValue | undefined;
    const Capture = () => {
        api = useConfirm();
        return null;
    };
    render(
        <ConfirmProvider>
            <Capture />
        </ConfirmProvider>
    );
    return api!;
};

const ask = (api: ConfirmContextValue, options: Parameters<ConfirmContextValue['confirm']>[0]) => {
    let result!: Promise<boolean>;
    act(() => {
        result = api.confirm(options);
    });
    return result;
};

describe('ConfirmProvider', () => {
    it('resolves true once confirmed', async () => {
        const api = setup();
        const result = ask(api, { title: 'Delete pbs-node-01?', confirmLabel: 'Delete' });

        expect(screen.getByRole('dialog', { name: 'Delete pbs-node-01?' })).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

        await expect(result).resolves.toBe(true);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('resolves false on Cancel and on Escape', async () => {
        const api = setup();

        const cancelled = ask(api, { title: 'Delete?' });
        await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        await expect(cancelled).resolves.toBe(false);

        const escaped = ask(api, { title: 'Delete?' });
        await userEvent.keyboard('{Escape}');
        await expect(escaped).resolves.toBe(false);
    });

    it('keeps the dialog busy while onConfirm runs', async () => {
        const api = setup();
        let done!: () => void;
        const onConfirm = () => new Promise<void>((resolve) => { done = resolve; });
        const result = ask(api, { title: 'Delete?', confirmLabel: 'Delete', onConfirm });

        await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
        // No answer is left to give while the request is on its way.
        await userEvent.keyboard('{Escape}');
        expect(screen.getByRole('dialog')).toBeInTheDocument();

        await act(async () => done());
        await expect(result).resolves.toBe(true);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('stays open and shows the message when onConfirm throws', async () => {
        const api = setup();
        const onConfirm = vi.fn()
            .mockRejectedValueOnce(new Error('Client is offline'))
            .mockResolvedValueOnce(undefined);
        const result = ask(api, { title: 'Delete?', confirmLabel: 'Delete', onConfirm });

        await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
        expect(screen.getByRole('alert')).toHaveTextContent('Client is offline');

        // The button that failed is the one that retries.
        await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
        await expect(result).resolves.toBe(true);
        expect(onConfirm).toHaveBeenCalledTimes(2);
    });

    it('stays open without a message when onConfirm returns false', async () => {
        const api = setup();
        ask(api, { title: 'Delete?', confirmLabel: 'Delete', onConfirm: () => false });

        await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('shows requests one after another', async () => {
        const api = setup();
        const first = ask(api, { title: 'First?' });
        const second = ask(api, { title: 'Second?' });

        expect(screen.getAllByRole('dialog')).toHaveLength(1);
        expect(screen.getByRole('dialog', { name: 'First?' })).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));
        await expect(first).resolves.toBe(true);
        expect(screen.getByRole('dialog', { name: 'Second?' })).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        await expect(second).resolves.toBe(false);
    });

    it('tells with a single button', async () => {
        const api = setup();
        let result!: Promise<void>;
        act(() => {
            result = api.alert({ title: 'Cannot delete the last user', okLabel: 'Got it' });
        });

        expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: 'Got it' }));
        await expect(result).resolves.toBeUndefined();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('throws when used without a provider', () => {
        // The alternative is a question that never appears, and an action waiting on it forever.
        const Orphan = () => {
            useConfirm();
            return null;
        };
        const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => render(<Orphan />)).toThrow(/ConfirmProvider/);
        quiet.mockRestore();
    });
});
