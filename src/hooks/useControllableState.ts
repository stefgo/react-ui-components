import { useCallback, useRef, useState } from 'react';
import type { Controllable } from '../types';

export type SetControllableState<T> = (next: T | ((prev: T) => T)) => void;

export type ControllableState<T> = [
    value: T,
    setValue: SetControllableState<T>,
    isControlled: boolean,
    /**
     * Corrects the internal state without telling the caller — and does nothing
     * at all when the state is controlled.
     *
     * For the one case the normal setter cannot serve: adjusting state *during*
     * render, the way `usePaginationState` snaps back to page 1 when the data
     * changes. Calling `onChange` there would update a different component
     * mid-render, which React forbids. This is not a general escape hatch; if
     * the change came from the user, it belongs in `setValue`.
     */
    correct: SetControllableState<T>
];

interface UseControllableStateOptions<T> extends Controllable<T> {
    /** Used when `defaultValue` is omitted. A function is called once, lazily. */
    fallback: T | (() => T);
}

const isUpdater = <T,>(next: T | ((prev: T) => T)): next is (prev: T) => T =>
    typeof next === 'function';

/**
 * One state that the caller may own or leave to the component.
 *
 * The logic was already right in one place — `usePaginationState`, whose
 * comment "Controlled callers are left alone: the state is theirs" names the
 * rule that matters. This is that rule, extracted, so `Collapsible`,
 * `DataMultiView`, `useSortColumns` and `useTreeExpansion` stop each inventing
 * their own answer.
 *
 * Returns the setter with a stable identity, so callers can put it in
 * dependency arrays without re-creating their handlers on every change.
 */
export function useControllableState<T>({
    value,
    defaultValue,
    onChange,
    fallback
}: UseControllableStateOptions<T>): ControllableState<T> {
    const [inner, setInner] = useState<T>(() => {
        if (defaultValue !== undefined) return defaultValue;
        return typeof fallback === 'function' ? (fallback as () => T)() : fallback;
    });

    const isControlled = value !== undefined;
    const current = isControlled ? (value as T) : inner;

    /*
     * One mutable cell holding whatever the last render saw, written during
     * render on purpose.
     *
     * It buys two things the setter cannot get otherwise. Its identity stays
     * stable, so callers may put it in a dependency array. And an updater sees
     * the newest value even when the setter runs twice in one event handler,
     * before React has re-rendered — the render re-syncs the cell from whoever
     * owns the state, and the setter advances it within a batch.
     *
     * `react-hooks/refs` forbids ref writes during render because render output
     * must not depend on a ref. Nothing here is rendered from it: the cell is
     * read only inside event handlers, and the assignment is idempotent, so a
     * double render under StrictMode changes nothing. Same pattern, and same
     * reason, as in Radix and React Aria.
     */
    const latest = useRef({ current, isControlled, onChange });
    // eslint-disable-next-line react-hooks/refs -- deliberate; see the note above
    latest.current = { current, isControlled, onChange };

    const setState = useCallback<SetControllableState<T>>((next) => {
        const resolved = isUpdater(next) ? next(latest.current.current) : next;
        latest.current.current = resolved;

        // A controlled caller owns the state; writing `inner` would only build
        // up a shadow copy that drifts from what is actually rendered.
        if (!latest.current.isControlled) setInner(resolved);
        latest.current.onChange?.(resolved);
    }, []);

    const correct = useCallback<SetControllableState<T>>((next) => {
        if (latest.current.isControlled) return;
        setInner((prev) => {
            const resolved = isUpdater(next) ? next(prev) : next;
            latest.current.current = resolved;
            return resolved;
        });
    }, []);

    return [current, setState, isControlled, correct];
}
