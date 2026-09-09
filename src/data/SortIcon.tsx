import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import type { DataTableDef } from '../DataTable';
import { ICON_SIZE } from '../types';
import { SortEntry } from './types';
import { isSortable } from './sorting';

export interface SortIconProps<T> {
    col: DataTableDef<T>;
    colIndex: number;
    sortColumns: SortEntry[];
}

/**
 * Arrow next to a column header, with the priority number for multi-column sorts.
 *
 * Decoration, and marked as such: the `<th>` carries `aria-sort`, which is what
 * actually reports the sort. Before that existed the arrows were the only
 * indicator — and they were text glyphs, so a screen reader read "up arrow"
 * where it now reads the state.
 */
export const SortIcon = <T,>({ col, colIndex, sortColumns }: SortIconProps<T>) => {
    if (!isSortable(col)) return null;

    const entry = sortColumns.find((s) => s.colIndex === colIndex);
    if (!entry) {
        return (
            <span className="ml-1 opacity-40" aria-hidden="true">
                <ChevronsUpDown size={ICON_SIZE.sm} />
            </span>
        );
    }

    const Arrow = entry.direction === 'asc' ? ArrowUp : ArrowDown;
    const priority = sortColumns.length > 1 ? sortColumns.indexOf(entry) + 1 : null;

    return (
        <span className="ml-1 inline-flex items-center" aria-hidden="true">
            <Arrow size={ICON_SIZE.sm} />
            {priority !== null && <sup>{priority}</sup>}
        </span>
    );
};
