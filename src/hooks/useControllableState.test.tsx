import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { useControllableState } from './useControllableState';

type Props = {
    value?: number;
    defaultValue?: number;
    onChange?: (next: number) => void;
    /** How many times the button bumps the count per click. */
    bumps?: number;
};

const Counter = ({ bumps = 1, ...rest }: Props) => {
    const [count, setCount] = useControllableState({ ...rest, fallback: 0 });
    return (
        <button
            type="button"
            onClick={() => {
                for (let i = 0; i < bumps; i++) setCount((prev) => prev + 1);
            }}
        >
            count {count}
        </button>
    );
};

describe('useControllableState', () => {
    it('keeps the state itself when uncontrolled', async () => {
        render(<Counter defaultValue={5} />);

        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('button')).toHaveTextContent('count 6');
    });

    it('falls back when no defaultValue is given', () => {
        render(<Counter />);
        expect(screen.getByRole('button')).toHaveTextContent('count 0');
    });

    it('reports changes but does not move on its own when controlled', async () => {
        const onChange = vi.fn();
        render(<Counter value={5} onChange={onChange} />);

        await userEvent.click(screen.getByRole('button'));

        expect(onChange).toHaveBeenCalledWith(6);
        // The caller owns the state and chose not to move it, so neither does the hook.
        expect(screen.getByRole('button')).toHaveTextContent('count 5');
    });

    it('follows the caller once the caller does move it', async () => {
        const Controlled = () => {
            const [value, setValue] = useState(5);
            return <Counter value={value} onChange={setValue} />;
        };
        render(<Controlled />);

        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('button')).toHaveTextContent('count 6');
    });

    it('ignores defaultValue once value is passed', () => {
        render(<Counter value={9} defaultValue={5} />);
        expect(screen.getByRole('button')).toHaveTextContent('count 9');
    });

    // The trap in the naive implementation: two updater calls in one handler run
    // before React re-renders, so the second must not read the value the first
    // one replaced.
    it('sees the newest value across several updates in one batch', async () => {
        render(<Counter defaultValue={0} bumps={3} />);

        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('button')).toHaveTextContent('count 3');
    });

    it('reports every one of those updates', async () => {
        const onChange = vi.fn();
        render(<Counter defaultValue={0} bumps={3} onChange={onChange} />);

        await userEvent.click(screen.getByRole('button'));
        expect(onChange.mock.calls.map(([n]) => n)).toEqual([1, 2, 3]);
    });

    it('keeps the setter identity stable across renders', () => {
        const setters: unknown[] = [];
        const Probe = ({ value }: { value: number }) => {
            const [, setState] = useControllableState({ value, fallback: 0 });
            setters.push(setState);
            return null;
        };

        const { rerender } = render(<Probe value={1} />);
        act(() => { rerender(<Probe value={2} />); });

        expect(setters.length).toBeGreaterThan(1);
        expect(new Set(setters).size).toBe(1);
    });
});
