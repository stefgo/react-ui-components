import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePersistentState } from './usePersistentState';
import type { Persistable } from '../types';

const reviveString = (raw: unknown) => (typeof raw === 'string' ? raw : undefined);

const Harness = ({ revive = reviveString, ...options }: Persistable<string> & { revive?: (raw: unknown) => string | undefined }) => {
    const [value, setValue] = usePersistentState<string>({ ...options, fallback: 'fallback', revive });
    return <button onClick={() => setValue('clicked')}>{value}</button>;
};

describe('usePersistentState', () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    it('prefers a stored value over defaultValue', () => {
        localStorage.setItem('k', JSON.stringify('stored'));
        render(<Harness defaultValue="default" persist={{ key: 'k', scope: 'local' }} />);
        // Otherwise a remembered choice comes unstuck on every mount, and the
        // caller has no way to tell that it was ever remembered.
        expect(screen.getByRole('button')).toHaveTextContent('stored');
    });

    it('falls back to defaultValue when the stored value is rejected', () => {
        localStorage.setItem('k', JSON.stringify({ shape: 'from an older version' }));
        render(<Harness defaultValue="default" persist={{ key: 'k', scope: 'local' }} />);
        expect(screen.getByRole('button')).toHaveTextContent('default');
    });

    it('survives content that is not JSON at all', () => {
        localStorage.setItem('k', 'not json');
        render(<Harness defaultValue="default" persist={{ key: 'k', scope: 'local' }} />);
        expect(screen.getByRole('button')).toHaveTextContent('default');
    });

    it('writes a change to the chosen scope, and only there', async () => {
        render(<Harness persist={{ key: 'k', scope: 'session' }} />);
        await userEvent.click(screen.getByRole('button'));
        expect(sessionStorage.getItem('k')).toBe(JSON.stringify('clicked'));
        expect(localStorage.getItem('k')).toBeNull();
    });

    it('writes nothing on mount', () => {
        render(<Harness defaultValue="default" persist={{ key: 'k', scope: 'local' }} />);
        // The mount run would only write back what was just read -- and would
        // turn a mere visit into a stored preference.
        expect(localStorage.getItem('k')).toBeNull();
    });

    it('stores nothing while the state is controlled', async () => {
        render(<Harness value="owned" onChange={vi.fn()} persist={{ key: 'k', scope: 'local' }} />);
        await userEvent.click(screen.getByRole('button'));
        // The caller owns the state and decides for itself whether it outlives
        // the mount; writing here would install a second, competing memory.
        expect(localStorage.getItem('k')).toBeNull();
    });

    it('keeps working when storage is blocked outright', async () => {
        const blocked = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('quota');
        });
        render(<Harness persist={{ key: 'k', scope: 'local' }} />);
        await userEvent.click(screen.getByRole('button'));
        // A private window must cost the feature, not the page.
        expect(screen.getByRole('button')).toHaveTextContent('clicked');
        blocked.mockRestore();
    });

    it('round-trips a value that JSON cannot carry by itself', async () => {
        const Sets = () => {
            const [value, setValue] = usePersistentState<Set<string>>({
                persist: { key: 'keys', scope: 'local' },
                fallback: () => new Set(),
                revive: (raw) => (Array.isArray(raw) ? new Set(raw as string[]) : undefined),
                serialize: (set) => [...set],
            });
            return <button onClick={() => setValue(new Set(['a', 'b']))}>{[...value].join(',') || 'empty'}</button>;
        };

        const { unmount } = render(<Sets />);
        await userEvent.click(screen.getByRole('button'));
        // Without `serialize` a Set stringifies to {} and comes back as nothing.
        expect(localStorage.getItem('keys')).toBe(JSON.stringify(['a', 'b']));

        unmount();
        render(<Sets />);
        expect(screen.getByRole('button')).toHaveTextContent('a,b');
    });
});
