import { useEffect, useRef } from 'react';
import { useControllableState, type ControllableState } from './useControllableState';
import type { Persistable, PersistOptions } from '../types';

export interface UsePersistentStateOptions<T> extends Persistable<T> {
    /** Used when neither a stored value nor `defaultValue` is available. A function is called once, lazily. */
    fallback: T | (() => T);
    /**
     * Turns a stored value back into state, or returns `undefined` to reject it.
     *
     * Required, and deliberately not optional with a `JSON.parse` default:
     * *every* persisted view state can outlive the shape it described. A column
     * index survives the column being removed, a tree key the node, a page
     * number the last page. Whoever stores the state is the only one who can
     * say what is still usable, and rejecting is always safe — the fallback is
     * right there.
     */
    revive: (raw: unknown) => T | undefined;
    /** Turns state into something `JSON.stringify` handles. Needed for a `Set` or a `Map`. */
    serialize?: (value: T) => unknown;
}

const storageFor = (scope: PersistOptions['scope']): Storage | null => {
    try {
        // Not a `typeof window` check: the throw comes from *reading the
        // property* under a blocked-cookies policy, not from it being absent.
        return scope === 'session' ? sessionStorage : localStorage;
    } catch {
        return null;
    }
};

const read = <T,>(persist: PersistOptions | undefined, revive: (raw: unknown) => T | undefined): T | undefined => {
    if (!persist) return undefined;
    const store = storageFor(persist.scope);
    if (!store) return undefined;
    try {
        const raw = store.getItem(persist.key);
        if (raw === null) return undefined;
        return revive(JSON.parse(raw));
    } catch {
        // Unreadable storage or unparseable content are the same thing here:
        // there is no stored value to be had, and the fallback covers it.
        return undefined;
    }
};

/**
 * One controllable state that may also survive its own mount.
 *
 * This is `useControllableState` plus storage, and it exists once so that sort
 * order, tree expansion, pagination and the view toggle stop each inventing
 * their own answer to the same question. Before it, one of them could persist
 * and the others could not, for no reason a caller could have predicted.
 *
 * Reading happens lazily, in the initial state, so nothing is rendered before
 * the stored value is in place. Writing happens in an effect and skips the
 * mount run, which would only write back what was just read.
 */
export function usePersistentState<T>({
    value,
    defaultValue,
    onChange,
    persist,
    fallback,
    revive,
    serialize,
}: UsePersistentStateOptions<T>): ControllableState<T> {
    const state = useControllableState<T>({
        value,
        // `defaultValue` goes through the fallback rather than straight in:
        // `useControllableState` prefers it over the fallback, which would put
        // it ahead of the stored value and make a remembered choice unstick on
        // every mount.
        onChange,
        fallback: () => {
            const stored = read<T>(persist, revive);
            if (stored !== undefined) return stored;
            if (defaultValue !== undefined) return defaultValue;
            return typeof fallback === 'function' ? (fallback as () => T)() : fallback;
        },
    });

    const [current, , isControlled] = state;

    const isFirstRun = useRef(true);
    const latest = useRef({ current, persist, serialize, isControlled });
    // eslint-disable-next-line react-hooks/refs -- nothing is rendered from it; same pattern as useControllableState
    latest.current = { current, persist, serialize, isControlled };

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        const { current: next, persist: target, serialize: toStored, isControlled: owned } = latest.current;
        if (owned || !target) return;
        const store = storageFor(target.scope);
        if (!store) return;
        try {
            store.setItem(target.key, JSON.stringify(toStored ? toStored(next) : next));
        } catch {
            // A full quota or a private window: losing the persisted value is
            // not worth taking the render down for.
        }
    }, [current, persist?.key, persist?.scope]);

    return state;
}
