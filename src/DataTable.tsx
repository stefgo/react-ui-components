import { ReactNode } from 'react';
import { AbstractDataView, BaseDataViewProps, DataViewClassNames } from './AbstractDataView';
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
    tbody?: string;
    tr?: string;
    td?: string;
    placeholderTd?: string;
}

export interface DataTableProps<T> extends BaseDataViewProps<T> {
    itemDef: DataTableDef<T>[];
    classNames?: DataTableClassNames;
}

interface SortEntry {
    colIndex: number;
    direction: 'asc' | 'desc';
}

interface DataTableState {
    sortColumns: SortEntry[];
}

export class DataTable<T> extends AbstractDataView<T, DataTableProps<T>, DataTableState> {
    state: DataTableState = {
        sortColumns: [],
    };

    private isSortable(col: DataTableDef<T>): boolean {
        return !!col.sortable && (!!col.accessorKey || !!col.sortValue);
    }

    private handleSortClick(col: DataTableDef<T>, idx: number, event: React.MouseEvent): void {
        if (!this.isSortable(col)) return;
        this.setState((prev) => {
            const existing = prev.sortColumns.find((s) => s.colIndex === idx);
            if (event.shiftKey) {
                if (existing) {
                    if (existing.direction === 'asc') {
                        return { sortColumns: prev.sortColumns.map((s) => s.colIndex === idx ? { ...s, direction: 'desc' } : s) };
                    } else {
                        return { sortColumns: prev.sortColumns.filter((s) => s.colIndex !== idx) };
                    }
                }
                return { sortColumns: [...prev.sortColumns, { colIndex: idx, direction: 'asc' }] };
            } else {
                if (existing && prev.sortColumns.length === 1) {
                    return { sortColumns: [{ colIndex: idx, direction: existing.direction === 'asc' ? 'desc' : 'asc' }] };
                }
                return { sortColumns: [{ colIndex: idx, direction: 'asc' }] };
            }
        });
    }

    private getSortedData(): T[] {
        const { data, itemDef } = this.props;
        const { sortColumns } = this.state;
        if (sortColumns.length === 0) return data;

        const resolvers = sortColumns.map(({ colIndex, direction }) => {
            const col = itemDef[colIndex];
            const getValue = col.sortValue
                ? col.sortValue
                : (item: T) => item[col.accessorKey!] as unknown as string | number;
            return { getValue, direction };
        });

        return [...data].sort((a, b) => {
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
        });
    }

    private renderSortIcon(col: DataTableDef<T>, idx: number): ReactNode {
        if (!this.isSortable(col)) return null;
        const { sortColumns } = this.state;
        const entry = sortColumns.find((s) => s.colIndex === idx);
        if (!entry) return <span className="ml-1 opacity-40">↕</span>;
        const arrow = entry.direction === 'asc' ? '↑' : '↓';
        const priority = sortColumns.length > 1 ? sortColumns.indexOf(entry) + 1 : null;
        return <span className="ml-1">{arrow}{priority !== null && <sup>{priority}</sup>}</span>;
    }

    protected renderContent(): ReactNode {
        const { itemDef, onRowClick, classNames } = this.props;
        const placeholder = this.getPlaceholder();
        const interactionClasses = this.getInteractionClasses();
        const sortedData = this.getSortedData();

        return (
            <div className="overflow-x-auto h-full w-full">
                <table className={cn("w-full text-left border-collapse", classNames?.table)}>
                    <thead className={cn("sticky top-0 bg-table-header dark:bg-table-header-dark z-10", classNames?.thead)}>
                        <tr className={cn("border-b border-border dark:border-border-dark", classNames?.headerRow)}>
                            {itemDef.map((col, idx) => (
                                <th
                                    key={idx}
                                    onClick={(e) => this.handleSortClick(col, idx, e)}
                                    className={cn(
                                        "px-6 py-2 text-xs font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wider",
                                        this.isSortable(col) && "cursor-pointer select-none hover:text-text-primary dark:hover:text-text-primary-dark",
                                        col.tableHeaderClassName,
                                        classNames?.th
                                    )}
                                >
                                    {col.tableHeader}
                                    {this.renderSortIcon(col, idx)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={cn("divide-y divide-border dark:divide-border-dark", classNames?.tbody)}>
                        {placeholder ? (
                            <tr>
                                <td colSpan={itemDef.length} className={cn("px-6 py-8 text-center text-text-muted dark:text-text-muted-dark", classNames?.placeholderTd)}>
                                    {placeholder}
                                </td>
                            </tr>
                        ) : (
                            sortedData.map((item) => {
                                const cellContent = (col: DataTableDef<T>) => {
                                    if (col.tableItemRender) return col.tableItemRender(item);
                                    if (col.accessorKey) return item[col.accessorKey] as unknown as ReactNode;
                                };

                                return (
                                    <tr
                                        key={this.getKey(item)}
                                        onClick={() => onRowClick?.(item)}
                                        className={cn(
                                            "transition-colors group",
                                            interactionClasses,
                                            this.getRowClass(item),
                                            classNames?.tr
                                        )}
                                    >
                                        {itemDef.map((col, idx) => {
                                            const cellClass = typeof col.tableCellClassName === 'function'
                                                ? col.tableCellClassName(item)
                                                : (col.tableCellClassName ?? '');
                                            return (
                                                <td key={idx} className={cn("px-6 py-2 whitespace-nowrap text-text-primary dark:text-text-primary-dark", cellClass, classNames?.td)}>
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
        );
    }
}

