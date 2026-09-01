import { ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { BaseDataViewProps, DataViewClassNames } from './data/types';
import { DataTableDef } from './DataTable';
import { isSortable } from './data/sorting';
import { useDataView } from './data/useDataView';
import { useSortColumns, type SortOptions } from './data/useSortColumns';
import { useTreeExpansion, type TreeExpansionOptions } from './data/useTreeExpansion';
import { SortIcon } from './data/SortIcon';
import { DataViewFrame } from './data/DataViewFrame';
import { flattenTree } from './data/tree';
import { cn } from './utils';

export interface DataTreeTableClassNames extends DataViewClassNames {
    table?: string;
    thead?: string;
    headerRow?: string;
    th?: string;
    sortButton?: string;
    tbody?: string;
    tr?: string;
    td?: string;
    chevronIcon?: string;
    placeholderTd?: string;
}

export interface DataTreeTableProps<T> extends BaseDataViewProps<T> {
    itemDef: DataTableDef<T>[];
    getChildren: (item: T) => T[] | undefined | null;
    /** Column sorting. Leave it out and the view owns it. */
    sort?: SortOptions;
    /** Row expansion. Leave it out and the view owns it. */
    expanded?: TreeExpansionOptions;
    /** Pixels of indentation per depth level. Default: 20 */
    indentSize?: number;
    classNames?: DataTreeTableClassNames;
}

export const DataTreeTable = <T,>(props: DataTreeTableProps<T>) => {
    const { itemDef, getChildren, expanded, sort, indentSize = 20, classNames, className } = props;

    const { sortColumns, comparator, handleSortClick, sortStateOf } = useSortColumns({ itemDef, sort });

    // A page is taken from the root level only — `rows` are the roots on this
    // page, and their children are expanded underneath regardless of the page
    // size. Counting rendered rows instead would make a page's length depend on
    // what happens to be expanded.
    const { rows, placeholder, getKey, getRowClass, rowActivationProps, interactionClasses, pagination } = useDataView(props, comparator);

    const { expandedKeys, allExpanded, toggleRow, toggleAll } = useTreeExpansion({
        data: props.data,
        visibleRows: rows,
        getChildren,
        getKey,
        expanded,
    });

    const flatRows = placeholder ? [] : flattenTree(rows, { getChildren, getKey, expandedKeys, comparator });

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
                                        aria-sort={sortable ? sortStateOf(idx) : undefined}
                                        className={cn(
                                            "px-6 py-2 text-xs font-medium text-text-muted uppercase tracking-wider",
                                            col.tableHeaderClassName,
                                            classNames?.th,
                                        )}
                                    >
                                        {/*
                                            The expand-all toggle is a sibling of the sort button,
                                            not its child: nesting one button inside another is
                                            invalid HTML, and the split is what removes the
                                            stopPropagation the <th> click handler needed.
                                        */}
                                        <div className="flex items-center gap-2">
                                            {idx === 0 && (
                                                <button
                                                    type="button"
                                                    onClick={toggleAll}
                                                    aria-expanded={allExpanded}
                                                    aria-label={allExpanded ? 'Collapse all rows' : 'Expand all rows'}
                                                    className={cn(
                                                        "shrink-0 hover:text-text-primary rounded-sm",
                                                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                                                        classNames?.chevronIcon,
                                                    )}
                                                >
                                                    {allExpanded
                                                        ? <ChevronDown size={14} aria-hidden />
                                                        : <ChevronRight size={14} aria-hidden />
                                                    }
                                                </button>
                                            )}
                                            {sortable ? (
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleSortClick(col, idx, e)}
                                                    className={cn(
                                                        "inline-flex items-center gap-1 select-none uppercase hover:text-text-primary",
                                                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm",
                                                        classNames?.sortButton,
                                                    )}
                                                >
                                                    {col.tableHeader}
                                                    <SortIcon col={col} colIndex={idx} sortColumns={sortColumns} />
                                                </button>
                                            ) : (
                                                col.tableHeader
                                            )}
                                        </div>
                                    </th>
                                );
                            })}
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
                                        {...rowActivationProps(item)}
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
                                                            {/*
                                                                A leaf gets an empty span, not a disabled
                                                                button: it only has to hold the indent open,
                                                                and a disabled control would still show up
                                                                in the accessibility tree saying nothing.
                                                            */}
                                                            {hasChildren ? (
                                                                <button
                                                                    type="button"
                                                                    aria-expanded={isExpanded}
                                                                    aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                                                                    // The row itself may be clickable; expanding is
                                                                    // not the same action as opening the row.
                                                                    onClick={(e) => { e.stopPropagation(); toggleRow(key); }}
                                                                    className={cn(
                                                                        "shrink-0 w-4 text-text-muted hover:text-text-primary rounded-sm",
                                                                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                                                                        classNames?.chevronIcon,
                                                                    )}
                                                                >
                                                                    {isExpanded
                                                                        ? <ChevronDown size={16} aria-hidden />
                                                                        : <ChevronRight size={16} aria-hidden />
                                                                    }
                                                                </button>
                                                            ) : (
                                                                <span
                                                                    aria-hidden="true"
                                                                    className={cn("shrink-0 w-4", classNames?.chevronIcon)}
                                                                />
                                                            )}
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
