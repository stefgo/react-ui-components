import { useCallback, useMemo } from 'react';
import type { DataTableDef } from '../DataTable';
import { usePersistentState } from '../hooks/usePersistentState';
import type { Persistable } from '../types';
import { Comparator, SortEntry } from './types';
import { buildComparator, isSortable, nextSortColumns, reviveSort } from './sorting';

export type SortOptions = Persistable<SortEntry[]>;

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
    const revive = useMemo(() => reviveSort(itemDef), [itemDef]);

    const [sortColumns, setSortColumns] = usePersistentState<SortEntry[]>({
        value: sort?.value,
        defaultValue: sort?.defaultValue,
        onChange: sort?.onChange,
        persist: sort?.persist,
        fallback: [],
        revive,
    });

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
