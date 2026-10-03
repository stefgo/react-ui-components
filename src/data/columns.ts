import type { ReactNode } from 'react';
import type { DataTableDef } from '../DataTable';
import type { DataListColumnDef, DataListDef } from '../DataList';

/** The view a column is being rendered in, for the rare cell that differs between them. */
export type DataColumnView = 'table' | 'list';

/**
 * One column, described once for the table and the list view.
 *
 * `tableDef` and `listColumns` ask for the same column twice, and the two
 * copies drift: a condition added to the table cell is missing from the card.
 * Here the heading is also the list label and one `render` serves both views.
 */
export interface DataColumnDef<T> {
    /**
     * The table heading and, unless `list.label` says otherwise, the list
     * label. As in `DataTableDef`, a deliberately invisible heading is a
     * visually hidden node, never a blank string.
     */
    header: ReactNode;
    accessorKey?: keyof T;
    /** Renders the cell in both views; `view` is there for the cell that has to differ. */
    render?: (item: T, view: DataColumnView) => ReactNode;
    sortable?: boolean;
    sortValue?: (item: T) => string | number;
    /** `false` leaves the column out of the table. */
    table?: false | {
        headerClassName?: string;
        cellClassName?: string | ((item: T) => string);
    };
    /** `false` leaves the column out of the list. */
    list?: false | {
        /** Replaces `header` as the label; `null` shows the value without one. */
        label?: ReactNode | null;
        labelClassName?: string;
        /** The `id` of the group this field sits in. Without one it goes into the first. */
        group?: string;
    };
}

/** One of the blocks a list row is laid out in, side by side from `md` up. */
export interface DataListGroupDef {
    id: string;
    className?: string;
    grow?: boolean;
}

/**
 * The table's columns. `sort` counts these: a column with `table: false` has
 * no index, so the `colIndex` of a sort is the position among the rest.
 */
export function toTableDef<T>(columns: DataColumnDef<T>[]): DataTableDef<T>[] {
    return columns.flatMap((column): DataTableDef<T>[] => {
        if (column.table === false) return [];
        const { render } = column;
        return [{
            accessorKey: column.accessorKey,
            sortable: column.sortable,
            sortValue: column.sortValue,
            tableHeader: column.header,
            tableHeaderClassName: column.table?.headerClassName,
            tableCellClassName: column.table?.cellClassName,
            tableItemRender: render && ((item) => render(item, 'table')),
        }];
    });
}

/**
 * The list's fields, sorted into `groups`. A field that names no group, or one
 * that does not exist, goes into the first -- a misspelled id must not make a
 * column disappear. A group that ends up empty is left out.
 */
export function toListColumns<T>(
    columns: DataColumnDef<T>[],
    groups: DataListGroupDef[] = [],
): DataListColumnDef<T>[] {
    const fieldsOf = new Map<string | undefined, DataListDef<T>[]>();
    const firstGroup = groups[0]?.id;
    const known = new Set(groups.map((group) => group.id));

    for (const column of columns) {
        if (column.list === false) continue;
        const { render, list } = column;
        const group = list?.group !== undefined && known.has(list.group) ? list.group : firstGroup;
        const fields = fieldsOf.get(group) ?? [];
        fields.push({
            accessorKey: column.accessorKey,
            listLabel: list?.label !== undefined ? list.label : column.header,
            listLabelClassName: list?.labelClassName,
            listItemRender: render && ((item) => render(item, 'list')),
        });
        fieldsOf.set(group, fields);
    }

    if (groups.length === 0) {
        const fields = fieldsOf.get(undefined);
        return fields ? [{ fields }] : [];
    }
    return groups.flatMap((group): DataListColumnDef<T>[] => {
        const fields = fieldsOf.get(group.id);
        return fields ? [{ fields, columnClassName: group.className, grow: group.grow }] : [];
    });
}
