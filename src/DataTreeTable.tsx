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
    /** Pixels of indentation per depth level. Default: 20 */
    indentSize?: number;
    classNames?: DataTreeTableClassNames;
}

interface DataTreeTableState {
    expandedKeys: Set<string | number>;
}

export class DataTreeTable<T> extends AbstractDataView<T, DataTreeTableProps<T>, DataTreeTableState> {
    state: DataTreeTableState = {
        expandedKeys: new Set(),
    };

    constructor(props: DataTreeTableProps<T>) {
        super(props);
        if (props.defaultExpanded) {
            this.state = {
                expandedKeys: new Set(this.collectExpandableKeys(props.data, props.getChildren, props.keyField)),
            };
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

    private flattenTree(items: T[], depth: number): Array<{ item: T; depth: number }> {
        const { getChildren } = this.props;
        const { expandedKeys } = this.state;
        const result: Array<{ item: T; depth: number }> = [];
        for (const item of items) {
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
                                    className={cn(
                                        "px-6 py-2 text-xs font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wider",
                                        col.tableHeaderClassName,
                                        classNames?.th,
                                    )}
                                >
                                    {idx === 0 ? (
                                        <div className="flex items-center gap-2">
                                            <span
                                                onClick={() => this.toggleAll()}
                                                className={cn("shrink-0 cursor-pointer hover:text-text-primary dark:hover:text-text-primary-dark", classNames?.chevronIcon)}
                                            >
                                                {allExpanded
                                                    ? <ChevronDown size={14} />
                                                    : <ChevronRight size={14} />
                                                }
                                            </span>
                                            {col.tableHeader}
                                        </div>
                                    ) : (
                                        col.tableHeader
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
