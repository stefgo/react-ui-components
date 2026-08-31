import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DataTableDef } from '../DataTable';
import { Comparator, SortEntry } from './types';
import { buildComparator, isSortable, nextSortColumns, readStoredSort } from './sorting';

export interface UseSortColumnsOptions<T> {
    itemDef: DataTableDef<T>[];
    defaultSort?: SortEntry;
    /** When set, the sort survives a reload. */
    storageKey?: string;
}

export interface UseSortColumnsResult<T> {
    sortColumns: SortEntry[];
    /** undefined while nothing is sorted — the caller's order stays untouched. */
    comparator: Comparator<T> | undefined;
    handleSortClick: (col: DataTableDef<T>, colIndex: number, event: MouseEvent) => void;
}

/** Column sorting for the table views: state, persistence and the click logic. */
export function useSortColumns<T>({ itemDef, defaultSort, storageKey }: UseSortColumnsOptions<T>): UseSortColumnsResult<T> {
    const [sortColumns, setSortColumns] = useState<SortEntry[]>(() => readStoredSort(itemDef, storageKey, defaultSort));

    const isFirstRun = useRef(true);
    useEffect(() => {
        // Skip the mount run, which would only write back what was just read.
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        if (!storageKey || typeof localStorage === 'undefined') return;
        try {
            localStorage.setItem(storageKey, JSON.stringify(sortColumns));
        } catch {
            // Private mode or a full quota: losing the persisted sort is not
            // worth taking the render down for.
        }
    }, [sortColumns, storageKey]);

    const comparator = useMemo(() => buildComparator(itemDef, sortColumns), [itemDef, sortColumns]);

    const handleSortClick = useCallback((col: DataTableDef<T>, colIndex: number, event: MouseEvent) => {
        if (!isSortable(col)) return;
        setSortColumns((prev) => nextSortColumns(prev, colIndex, event.shiftKey));
    }, []);

    return { sortColumns, comparator, handleSortClick };
}
