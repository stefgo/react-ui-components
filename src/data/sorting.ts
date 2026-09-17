import type { DataTableDef } from '../DataTable';
import { Comparator, SortEntry } from './types';

export function isSortable<T>(col: DataTableDef<T>): boolean {
    return !!col.sortable && (!!col.accessorKey || !!col.sortValue);
}

/**
 * Builds one comparator out of the active sort columns, in priority order.
 *
 * Returns undefined when nothing is sorted so that callers can keep the
 * caller's original order instead of copying the array for no reason.
 */
export function buildComparator<T>(itemDef: DataTableDef<T>[], sortColumns: SortEntry[]): Comparator<T> | undefined {
    const usable = sortColumns.filter(({ colIndex }) => itemDef[colIndex] && isSortable(itemDef[colIndex]));
    if (usable.length === 0) return undefined;

    const resolvers = usable.map(({ colIndex, direction }) => {
        const col = itemDef[colIndex];
        const getValue = col.sortValue
            ? col.sortValue
            : (item: T) => item[col.accessorKey!] as unknown as string | number;
        return { getValue, direction };
    });

    return (a, b) => {
        for (const { getValue, direction } of resolvers) {
            const aVal = getValue(a);
            const bVal = getValue(b);
            if (aVal == null && bVal == null) continue;
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            if (cmp !== 0) return direction === 'asc' ? cmp : -cmp;
        }
        return 0;
    };
}

/**
 * The state transition behind a click on a column header.
 *
 * Plain click replaces the sort; shift-click adds a column and cycles it
 * through asc → desc → removed.
 */
export function nextSortColumns(prev: SortEntry[], colIndex: number, additive: boolean): SortEntry[] {
    const existing = prev.find((s) => s.colIndex === colIndex);

    if (additive) {
        if (!existing) return [...prev, { colIndex, direction: 'asc' }];
        if (existing.direction === 'asc') {
            return prev.map((s) => s.colIndex === colIndex ? { ...s, direction: 'desc' as const } : s);
        }
        return prev.filter((s) => s.colIndex !== colIndex);
    }

    if (existing && prev.length === 1) {
        return [{ colIndex, direction: existing.direction === 'asc' ? 'desc' : 'asc' }];
    }
    return [{ colIndex, direction: 'asc' }];
}

/**
 * Turns a stored sort back into state, or rejects it.
 *
 * Anything unusable is discarded rather than trusted: a stored entry outlives
 * the column layout it was written for, and a colIndex past the end of itemDef
 * would crash the comparator on the next render. Rejecting by returning
 * `undefined` is what lets `defaultValue` take over.
 */
export function reviveSort<T>(itemDef: DataTableDef<T>[]): (raw: unknown) => SortEntry[] | undefined {
    return (raw) => {
        if (!Array.isArray(raw)) return undefined;
        const valid = raw.filter((entry): entry is SortEntry =>
            !!entry
            && typeof entry === 'object'
            && Number.isInteger((entry as SortEntry).colIndex)
            && (entry as SortEntry).colIndex >= 0
            && (entry as SortEntry).colIndex < itemDef.length
            && ((entry as SortEntry).direction === 'asc' || (entry as SortEntry).direction === 'desc'));
        return valid.length > 0 ? valid : undefined;
    };
}
