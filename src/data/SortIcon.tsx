import type { DataTableDef } from '../DataTable';
import { SortEntry } from './types';
import { isSortable } from './sorting';

interface SortIconProps<T> {
    col: DataTableDef<T>;
    colIndex: number;
    sortColumns: SortEntry[];
}

/** Arrow next to a column header, with the priority number for multi-column sorts. */
export const SortIcon = <T,>({ col, colIndex, sortColumns }: SortIconProps<T>) => {
    if (!isSortable(col)) return null;

    const entry = sortColumns.find((s) => s.colIndex === colIndex);
    if (!entry) return <span className="ml-1 opacity-40">↕</span>;

    const arrow = entry.direction === 'asc' ? '↑' : '↓';
    const priority = sortColumns.length > 1 ? sortColumns.indexOf(entry) + 1 : null;
    return <span className="ml-1">{arrow}{priority !== null && <sup>{priority}</sup>}</span>;
};
