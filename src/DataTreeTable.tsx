import { ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { AbstractDataView, BaseDataViewProps, DataViewClassNames } from './AbstractDataView';
import { DataTableDef } from './DataTable';
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
    defaultSort?: { colIndex: number; direction: 'asc' | 'desc' };
    /** Pixels of indentation per depth level. Default: 20 */
    indentSize?: number;
    classNames?: DataTreeTableClassNames;
}

interface SortEntry {
    colIndex: number;
    direction: 'asc' | 'desc';
}

interface DataTreeTableState {
    expandedKeys: Set<string | number>;
    sortColumns: SortEntry[];
}

export class DataTreeTable<T> extends AbstractDataView<T, DataTreeTableProps<T>, DataTreeTableState> {
    state: DataTreeTableState = {
        expandedKeys: new Set(),
        sortColumns: [],
    };

    constructor(props: DataTreeTableProps<T>) {
        super(props);
        const sortColumns = props.defaultSort ? [props.defaultSort] : [];
        if (props.defaultExpanded) {
            this.state = {
                expandedKeys: new Set(this.collectExpandableKeys(props.data, props.getChildren, props.keyField)),
                sortColumns,
            };
        } else {
            this.state = { ...this.state, sortColumns };
        }
    }

    private collectExpandableKeys(
        items: T[],
        getChildren: (item: T) => T[] | undefined | null,
        keyField: DataTreeTableProps<T>['keyField'],
    ): (string | number)[] {
        const getKey = (item: T): string | number => {
            if (typeof keyField === 'function') return (keyField as (i: T) => string | number)(item);
            return item[keyField as keyof T] as unknown as string | number;
        };
        const keys: (string | number)[] = [];
        for (const item of items) {
            const children = getChildren(item);
            if (children && children.length > 0) {
                keys.push(getKey(item));
                keys.push(...this.collectExpandableKeys(children, getChildren, keyField));
            }
        }
        return keys;
    }

    private getAllExpandableKeys(): (string | number)[] {
        return this.collectExpandableKeys(this.props.data, this.props.getChildren, this.props.keyField);
    }

    private toggleAll(): void {
        const { expandedKeys } = this.state;
        const allKeys = this.getAllExpandableKeys();
        const allExpanded = allKeys.length > 0 && allKeys.every((k) => expandedKeys.has(k));
        this.setState({ expandedKeys: allExpanded ? new Set() : new Set(allKeys) });
    }

    private toggleRow(key: string | number): void {
        this.setState((prev) => {
            const next = new Set(prev.expandedKeys);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return { expandedKeys: next };
        });
    }

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

    private renderSortIcon(col: DataTableDef<T>, idx: number): ReactNode {
        if (!this.isSortable(col)) return null;
        const { sortColumns } = this.state;
        const entry = sortColumns.find((s) => s.colIndex === idx);
        if (!entry) return <span className="ml-1 opacity-40">↕</span>;
        const arrow = entry.direction === 'asc' ? '↑' : '↓';
        const priority = sortColumns.length > 1 ? sortColumns.indexOf(entry) + 1 : null;
        return <span className="ml-1">{arrow}{priority !== null && <sup>{priority}</sup>}</span>;
    }

    private sortItems(items: T[]): T[] {
        const { itemDef } = this.props;
        const { sortColumns } = this.state;
        if (sortColumns.length === 0) return items;

        const resolvers = sortColumns.map(({ colIndex, direction }) => {
            const col = itemDef[colIndex];
            const getValue = col.sortValue
                ? col.sortValue
                : (item: T) => item[col.accessorKey!] as unknown as string | number;
            return { getValue, direction };
        });

        return [...items].sort((a, b) => {
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

    private flattenTree(items: T[], depth: number): Array<{ item: T; depth: number }> {
        const { getChildren } = this.props;
        const { expandedKeys } = this.state;
        const result: Array<{ item: T; depth: number }> = [];
        for (const item of this.sortItems(items)) {
            result.push({ item, depth });
            const key = this.getKey(item);
            if (expandedKeys.has(key)) {
                const children = getChildren(item);
                if (children && children.length > 0) {
                    result.push(...this.flattenTree(children, depth + 1));
                }
            }
        }
        return result;
    }

    protected renderContent(): ReactNode {
        const { data, itemDef, onRowClick, classNames, getChildren, indentSize = 20 } = this.props;
        const { expandedKeys } = this.state;
        const placeholder = this.getPlaceholder();

        const allExpandableKeys = this.getAllExpandableKeys();
        const allExpanded = allExpandableKeys.length > 0 && allExpandableKeys.every((k) => expandedKeys.has(k));
        const flatRows = placeholder ? [] : this.flattenTree(data, 0);
        const interactionClasses = this.getInteractionClasses();

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
                                        classNames?.th,
                                    )}
                                >
                                    {idx === 0 ? (
                                        <div className="flex items-center gap-2">
                                            <span
                                                onClick={(e) => { e.stopPropagation(); this.toggleAll(); }}
                                                className={cn("shrink-0 cursor-pointer hover:text-text-primary dark:hover:text-text-primary-dark", classNames?.chevronIcon)}
                                            >
                                                {allExpanded
                                                    ? <ChevronDown size={14} />
                                                    : <ChevronRight size={14} />
                                                }
                                            </span>
                                            {col.tableHeader}
                                            {this.renderSortIcon(col, idx)}
                                        </div>
                                    ) : (
                                        <>
                                            {col.tableHeader}
                                            {this.renderSortIcon(col, idx)}
                                        </>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={cn("divide-y divide-border dark:divide-border-dark", classNames?.tbody)}>
                        {placeholder ? (
                            <tr>
                                <td
                                    colSpan={itemDef.length}
                                    className={cn("px-6 py-8 text-center text-text-muted dark:text-text-muted-dark", classNames?.placeholderTd)}
                                >
                                    {placeholder}
                                </td>
                            </tr>
                        ) : (
                            flatRows.map(({ item, depth }) => {
                                const key = this.getKey(item);
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
                                            this.getRowClass(item),
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
                                                        className={cn("px-6 py-2 whitespace-nowrap text-text-primary dark:text-text-primary-dark", cellClass, classNames?.td)}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className={cn(
                                                                    "shrink-0 w-4 text-text-muted dark:text-text-muted-dark",
                                                                    hasChildren && "cursor-pointer hover:text-text-primary dark:hover:text-text-primary-dark",
                                                                    classNames?.chevronIcon,
                                                                )}
                                                                onClick={(e) => {
                                                                    if (hasChildren) {
                                                                        e.stopPropagation();
                                                                        this.toggleRow(key);
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
