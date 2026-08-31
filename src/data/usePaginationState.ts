import { useState } from 'react';
import { useControllableState } from '../hooks/useControllableState';
import { PaginationProps, PaginationState } from './types';

export interface ResolvedPagination {
    mode: 'client' | 'server';
    state: PaginationState;
    setState: (next: PaginationState) => void;
    /** True when the caller holds the state, so the view must not change it silently. */
    isControlled: boolean;
    pageSizeOptions?: number[];
    totalItems?: number;
    hideOnSinglePage: boolean;
}

const DEFAULT_STATE: PaginationState = { page: 1, pageSize: 10 };

/**
 * Resolves the `pagination` prop into one shape, whoever owns the state.
 *
 * Controlled and uncontrolled differ in exactly one place — where the current
 * page lives — so everything downstream can stop caring which one it is.
 */
export function usePaginationState(
    pagination: boolean | PaginationProps | undefined,
    resetKeys: unknown[],
): ResolvedPagination | null {
    const opts: PaginationProps | null = pagination === true ? {} : (pagination || null);

    const [state, setState, isControlled, correct] = useControllableState<PaginationState>({
        value: opts?.value,
        defaultValue: opts?.defaultValue ? { ...DEFAULT_STATE, ...opts.defaultValue } : undefined,
        onChange: opts?.onChange,
        fallback: DEFAULT_STATE,
    });

    // Back to page 1 when the data or the filter changes. Adjusted during render
    // rather than in an effect, so no frame is spent showing a page that no
    // longer exists — React re-runs this component before anything is painted.
    // Controlled callers are left alone: the state is theirs, and `correct`
    // knows it.
    const [seenKeys, setSeenKeys] = useState(resetKeys);
    const keysChanged = resetKeys.length !== seenKeys.length
        || resetKeys.some((key, i) => !Object.is(key, seenKeys[i]));
    if (keysChanged) {
        setSeenKeys(resetKeys);
        if (opts && opts.autoResetPage !== false && state.page !== 1) {
            correct((prev) => ({ ...prev, page: 1 }));
        }
    }

    if (!opts) return null;

    return {
        mode: opts.mode ?? 'client',
        state,
        setState,
        isControlled,
        pageSizeOptions: opts.pageSizeOptions,
        totalItems: opts.totalItems,
        hideOnSinglePage: opts.hideOnSinglePage ?? false,
    };
}
