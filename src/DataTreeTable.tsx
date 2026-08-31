import { ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { BaseDataViewProps, DataViewClassNames, SortEntry } from './data/types';
import { DataTableDef } from './DataTable';
import { isSortable } from './data/sorting';
import { useDataView } from './data/useDataView';
import { useSortColumns } from './data/useSortColumns';
import { useTreeExpansion } from './data/useTreeExpansion';
import { SortIcon } from './data/SortIcon';
import { DataViewFrame } from './data/DataViewFrame';
import { flattenTree } from './data/tree';
import { cn } from './utils';

export interface DataTreeTableClassNames extends DataViewClassNames {
    table?: string;
    thead?: string;
    headerRow?: string;
    th?: string;
    tbody?: string;
    tr?: string;
    td?: string;
    chevronIcon?: string;
    placeholderTd?: string;
}

export interface DataTreeTableProps<T> extends BaseDataViewProps<T> {
    itemDef: DataTableDef<T>[];
    getChildren: (item: T) => T[] | undefined | null;
    defaultExpanded?: boolean;
    defaultSort?: SortEntry;
    /** Pixels of indentation per depth level. Default: 20 */
    indentSize?: number;
    classNames?: DataTreeTableClassNames;
}

export const DataTreeTable = <T,>(props: DataTreeTableProps<T>) => {
    const { itemDef, getChildren, defaultExpanded, defaultSort, indentSize = 20, onRowClick, classNames, className } = props;

    const { sortColumns, comparator, handleSortClick } = useSortColumns({ itemDef, defaultSort });

    // A page is taken from the root level only — `rows` are the roots on this
    // page, and their children are expanded underneath regardless of the page
    // size. Counting rendered rows instead would make a page's length depend on
    // what happens to be expanded.
    const { rows, placeholder, getKey, getRowClass, interactionClasses, pagination } = useDataView(props, comparator);

    const { expandedKeys, allExpanded, toggleRow, toggleAll } = useTreeExpansion({
        data: props.data,
        visibleRows: rows,
        getChildren,
        getKey,
        defaultExpanded,
    });

    const flatRows = placeholder ? [] : flattenTree(rows, { getChildren, getKey, expandedKeys, comparator });

    return (
        <DataViewFrame className={className} classNames={classNames} pagination={pagination}>
            <div className="overflow-x-auto h-full w-full">
                <table className={cn("w-full text-left border-collapse", classNames?.table)}>
                    <thead className={cn("sticky top-0 bg-table-header z-sticky", classNames?.thead)}>
                        <tr className={cn("border-b border-border", classNames?.headerRow)}>
                            {itemDef.map((col, idx) => (
                                <th
                                    key={idx}
                                    onClick={(e) => handleSortClick(col, idx, e)}
                                    className={cn(
                                        "px-6 py-2 text-xs font-medium text-text-muted uppercase tracking-wider",
                                        isSortable(col) && "cursor-pointer select-none hover:text-text-primary",
                                        col.tableHeaderClassName,
                                        classNames?.th,
                                    )}
                                >
                                    {idx === 0 ? (
                                        <div className="flex items-center gap-2">
                                            <span
                                                onClick={(e) => { e.stopPropagation(); toggleAll(); }}
                                                className={cn("shrink-0 cursor-pointer hover:text-text-primary", classNames?.chevronIcon)}
                                            >
                                                {allExpanded
                                                    ? <ChevronDown size={14} />
                                                    : <ChevronRight size={14} />
                                                }
                                            </span>
                                            {col.tableHeader}
                                            <SortIcon col={col} colIndex={idx} sortColumns={sortColumns} />
                                        </div>
                                    ) : (
                                        <>
                                            {col.tableHeader}
                                            <SortIcon col={col} colIndex={idx} sortColumns={sortColumns} />
                                        </>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={cn("divide-y divide-border", classNames?.tbody)}>
                        {placeholder ? (
                            <tr>
                                <td
                                    colSpan={itemDef.length}
                                    className={cn("px-6 py-8 text-center text-text-muted", classNames?.placeholderTd)}
                                >
                                    {placeholder}
                                </td>
                            </tr>
                        ) : (
                            flatRows.map(({ item, depth }) => {
                                const key = getKey(item);
                                const isExpanded = expandedKeys.has(key);
                                const children = getChildren(item);
                                const hasChildren = !!(children && children.length > 0);

                                const cellContent = (col: DataTableDef<T>) => {
                                    if (col.tableItemRender) return col.tableItemRender(item);
                                    if (col.accessorKey) return item[col.accessorKey] as unknown as ReactNode;
                                };

                                return (
                                    <tr
                                        key={key}
                                        onClick={() => onRowClick?.(item)}
                                        className={cn(
                                            "transition-colors group",
                                            interactionClasses,
                                            getRowClass(item),
                                            classNames?.tr,
                                        )}
                                    >
                                        {itemDef.map((col, idx) => {
                                            const cellClass = typeof col.tableCellClassName === 'function'
                                                ? col.tableCellClassName(item)
                                                : (col.tableCellClassName ?? '');

                                            if (idx === 0) {
                                                return (
                                                    <td
                                                        key={idx}
                                                        style={{ paddingLeft: `${24 + depth * indentSize}px` }}
                                                        className={cn("px-6 py-2 whitespace-nowrap text-text-primary", cellClass, classNames?.td)}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className={cn(
                                                                    "shrink-0 w-4 text-text-muted",
                                                                    hasChildren && "cursor-pointer hover:text-text-primary",
                                                                    classNames?.chevronIcon,
                                                                )}
                                                                onClick={(e) => {
                                                                    if (hasChildren) {
                                                                        e.stopPropagation();
                                                                        toggleRow(key);
                                                                    }
                                                                }}
                                                            >
                                                                {hasChildren && (isExpanded
                                                                    ? <ChevronDown size={16} />
                                                                    : <ChevronRight size={16} />
                                                                )}
                                                            </span>
                                                            {cellContent(col)}
                                                        </div>
                                                    </td>
                                                );
                                            }

                                            return (
                                                <td key={idx} className={cn("px-6 py-2 whitespace-nowrap text-text-primary", cellClass, classNames?.td)}>
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
