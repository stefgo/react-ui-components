import { ReactNode } from 'react';
import { BaseDataViewProps, DataViewClassNames } from './data/types';
import { isSortable } from './data/sorting';
import { useDataView } from './data/useDataView';
import { useSortColumns, type SortOptions } from './data/useSortColumns';
import { SortIcon } from './data/SortIcon';
import { DataViewFrame } from './data/DataViewFrame';
import { cn } from './utils';

export interface DataTableDef<T> {
    accessorKey?: keyof T;
    sortable?: boolean;
    sortValue?: (item: T) => string | number;
    tableHeader: ReactNode;
    tableHeaderClassName?: string;
    tableCellClassName?: string | ((item: T) => string);
    tableItemRender?: (item: T) => ReactNode;
}

export interface DataTableClassNames extends DataViewClassNames {
    table?: string;
    thead?: string;
    headerRow?: string;
    th?: string;
    sortButton?: string;
    tbody?: string;
    tr?: string;
    td?: string;
    placeholderTd?: string;
}

export interface DataTableProps<T> extends BaseDataViewProps<T> {
    itemDef: DataTableDef<T>[];
    /** Column sorting. Leave it out and the view owns it. */
    sort?: SortOptions;
    classNames?: DataTableClassNames;
}

export const DataTable = <T,>(props: DataTableProps<T>) => {
    const { itemDef, sort, classNames, className } = props;

    const { sortColumns, comparator, handleSortClick, sortStateOf } = useSortColumns({ itemDef, sort });
    // Sort across everything first, then take the page — the other order sorts
    // only the rows that happen to be on screen.
    const { rows, placeholder, getKey, getRowClass, rowActivationProps, interactionClasses, pagination } = useDataView(props, comparator);

    return (
        <DataViewFrame className={className} classNames={classNames} pagination={pagination}>
            <div className="overflow-x-auto h-full w-full">
                <table className={cn("w-full text-left border-collapse", classNames?.table)}>
                    <thead className={cn("sticky top-0 bg-table-header z-sticky", classNames?.thead)}>
                        <tr className={cn("border-b border-border", classNames?.headerRow)}>
                            {itemDef.map((col, idx) => {
                                const sortable = isSortable(col);
                                return (
                                    <th
                                        key={idx}
                                        scope="col"
                                        // Only a sortable column carries a sort state. On the
                                        // others the attribute would claim they could be sorted.
                                        aria-sort={sortable ? sortStateOf(idx) : undefined}
                                        className={cn(
                                            "px-6 py-2 text-xs font-medium text-text-muted uppercase tracking-wider",
                                            col.tableHeaderClassName,
                                            classNames?.th
                                        )}
                                    >
                                        {/*
                                            A real button, not a click handler on the <th>: the
                                            header is a control, and only a button is reachable by
                                            Tab and activated by Enter or Space. A column that
                                            cannot be sorted stays plain text — wrapping it too
                                            would make every header a tab stop for nothing.
                                        */}
                                        {sortable ? (
                                            <button
                                                type="button"
                                                onClick={(e) => handleSortClick(col, idx, e)}
                                                className={cn(
                                                    "inline-flex items-center gap-1 select-none uppercase hover:text-text-primary",
                                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm",
                                                    classNames?.sortButton
                                                )}
                                            >
                                                {col.tableHeader}
                                                <SortIcon col={col} colIndex={idx} sortColumns={sortColumns} />
                                            </button>
                                        ) : (
                                            col.tableHeader
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className={cn("divide-y divide-border", classNames?.tbody)}>
                        {placeholder ? (
                            <tr>
                                <td colSpan={itemDef.length} className={cn("px-6 py-8 text-center text-text-muted", classNames?.placeholderTd)}>
                                    {placeholder}
                                </td>
                            </tr>
                        ) : (
                            rows.map((item) => {
                                const cellContent = (col: DataTableDef<T>) => {
                                    if (col.tableItemRender) return col.tableItemRender(item);
                                    if (col.accessorKey) return item[col.accessorKey] as unknown as ReactNode;
                                };

                                return (
                                    <tr
                                        key={getKey(item)}
                                        {...rowActivationProps(item)}
                                        className={cn(
                                            "transition-colors group",
                                            interactionClasses,
                                            getRowClass(item),
                                            classNames?.tr
                                        )}
                                    >
                                        {itemDef.map((col, idx) => {
                                            const cellClass = typeof col.tableCellClassName === 'function'
                                                ? col.tableCellClassName(item)
                                                : (col.tableCellClassName ?? '');
                                            return (
                                                <td key={idx} className={cn("px-6 py-2 text-text-primary", cellClass, classNames?.td)}>
                                                    {cellContent(col)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </DataViewFrame>
    );
};
