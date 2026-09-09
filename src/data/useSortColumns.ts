import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { DataTableDef } from '../DataTable';
import { useControllableState } from '../hooks/useControllableState';
import type { Controllable } from '../types';
import { Comparator, SortEntry } from './types';
import { buildComparator, isSortable, nextSortColumns, readStoredSort } from './sorting';

export interface SortOptions extends Controllable<SortEntry[]> {
    /**
     * Persists the sort across reloads while uncontrolled. It is the *default*
     * of the uncontrolled variant, not a second mode: a controlled caller owns
     * the sort and decides for itself whether to store it.
     */
    storageKey?: string;
}

/**
 * What the sort transition actually reads off an event.
 *
 * Deliberately not `MouseEvent`: a header is activated by click *and* by Enter
 * or Space on the button, and the only thing the transition needs from either
 * is whether Shift was held. Narrowing to this shape keeps every existing
 * mouse call valid and makes Shift+Enter additive without a second code path.
 */
export interface SortActivation {
    shiftKey: boolean;
}

export type AriaSort = 'ascending' | 'descending' | 'none';

export interface UseSortColumnsOptions<T> {
    itemDef: DataTableDef<T>[];
    sort?: SortOptions;
}

export interface UseSortColumnsResult<T> {
    sortColumns: SortEntry[];
    /** undefined while nothing is sorted — the caller's order stays untouched. */
    comparator: Comparator<T> | undefined;
    handleSortClick: (col: DataTableDef<T>, colIndex: number, event: SortActivation) => void;
    /**
     * The `aria-sort` value for a column — the only thing that tells a screen
     * reader the table is sorted, and by which column.
     */
    sortStateOf: (colIndex: number) => AriaSort;
}

/** Column sorting for the table views: state, persistence and the click logic. */
export function useSortColumns<T>({ itemDef, sort }: UseSortColumnsOptions<T>): UseSortColumnsResult<T> {
    const storageKey = sort?.storageKey;

    const [sortColumns, setSortColumns, isControlled] = useControllableState<SortEntry[]>({
        value: sort?.value,
        // `defaultValue` deliberately goes through the fallback rather than
        // straight in: a stored sort still wins over it, the way it did before
        // the sort became controllable.
        onChange: sort?.onChange,
        fallback: () => readStoredSort(itemDef, storageKey, sort?.defaultValue),
    });

    const isFirstRun = useRef(true);
    useEffect(() => {
        // Skip the mount run, which would only write back what was just read.
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        if (isControlled || !storageKey || typeof localStorage === 'undefined') return;
        try {
            localStorage.setItem(storageKey, JSON.stringify(sortColumns));
        } catch {
            // Private mode or a full quota: losing the persisted sort is not
            // worth taking the render down for.
        }
    }, [sortColumns, storageKey, isControlled]);

    const comparator = useMemo(() => buildComparator(itemDef, sortColumns), [itemDef, sortColumns]);

    const handleSortClick = useCallback((col: DataTableDef<T>, colIndex: number, event: SortActivation) => {
        if (!isSortable(col)) return;
        setSortColumns((prev) => nextSortColumns(prev, colIndex, event.shiftKey));
    }, [setSortColumns]);

    const sortStateOf = useCallback((colIndex: number): AriaSort => {
        const entry = sortColumns.find((s) => s.colIndex === colIndex);
        if (!entry) return 'none';
        return entry.direction === 'asc' ? 'ascending' : 'descending';
    }, [sortColumns]);

    return { sortColumns, comparator, handleSortClick, sortStateOf };
}
