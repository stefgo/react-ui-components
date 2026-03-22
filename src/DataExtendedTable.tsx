import { ReactNode } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { AbstractDataView, BaseDataViewProps, DataViewClassNames } from './AbstractDataView';
import { DataTableDef } from './DataTable';
import { cn } from './utils';

export interface DataExtendedTableClassNames extends DataViewClassNames {
    table?: string;
    thead?: string;
    headerRow?: string;
    th?: string;
    tbody?: string;
    tr?: string;
    td?: string;
    chevronTd?: string;
    chevronIcon?: string;
    expandedTr?: string;
    expandedTd?: string;
    placeholderTd?: string;
}

export interface DataExtendedTableProps<T> extends BaseDataViewProps<T> {
    itemDef: DataTableDef<T>[];
    expandedRowRender: (item: T) => ReactNode;
    expandedColSpan?: number;
    expandOnRowClick?: boolean;
    classNames?: DataExtendedTableClassNames;
}

interface DataExtendedTableState {
    expandedKeys: Set<string | number>;
}

export class DataExtendedTable<T> extends AbstractDataView<T, DataExtendedTableProps<T>, DataExtendedTableState> {
    state: DataExtendedTableState = {
        expandedKeys: new Set(),
    };

    private toggleAll(): void {
        const { data } = this.props;
        const { expandedKeys } = this.state;
        const allKeys = data.map((item) => this.getKey(item));
        const allExpanded = allKeys.every((k) => expandedKeys.has(k));
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

    protected renderContent(): ReactNode {
        const { data, itemDef, onRowClick, classNames, expandedRowRender, expandedColSpan, expandOnRowClick } = this.props;
        const { expandedKeys } = this.state;
        const placeholder = this.getPlaceholder();
        const isInteractive = !!(onRowClick || expandOnRowClick);
        const totalCols = itemDef.length + 1;
        const contentColSpan = expandedColSpan ?? itemDef.length;
        const allKeys = data.map((item) => this.getKey(item));
        const allExpanded = allKeys.length > 0 && allKeys.every((k) => expandedKeys.has(k));

        const hoverClasses = isInteractive
            ? "group cursor-pointer"
            : "";
        const rowHoverClasses = isInteractive
            ? "group-hover:bg-table-row-hover dark:group-hover:bg-table-row-hover-dark"
            : "";

        return (
            <div className="overflow-x-auto h-full w-full">
                <table className={cn("w-full text-left border-collapse", classNames?.table)}>
                    <thead className={cn("sticky top-0 bg-table-header dark:bg-table-header-dark z-10", classNames?.thead)}>
                        <tr className={cn("border-b border-border dark:border-border-dark", classNames?.headerRow)}>
                            <th
                                className={cn("px-3 py-2 text-text-muted dark:text-text-muted-dark", classNames?.th)}
                                onClick={() => this.toggleAll()}
                            >
                                {allExpanded
                                    ? <ChevronDown size={16} className={cn("cursor-pointer hover:text-text-primary dark:hover:text-text-primary-dark", classNames?.chevronIcon)} />
                                    : <ChevronRight size={16} className={cn("cursor-pointer hover:text-text-primary dark:hover:text-text-primary-dark", classNames?.chevronIcon)} />
                                }
                            </th>
                            {itemDef.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={cn(
                                        "py-2 text-xs font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wider",
                                        idx > 0 && "px-6",
                                        col.tableHeaderClassName,
                                        classNames?.th
                                    )}
                                >
                                    {col.tableHeader}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {placeholder ? (
                        <tbody className={cn(classNames?.tbody)}>
                            <tr>
                                <td colSpan={totalCols} className={cn("px-6 py-8 text-center text-text-muted dark:text-text-muted-dark", classNames?.placeholderTd)}>
                                    {placeholder}
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        data.map((item) => {
                            const key = this.getKey(item);
                            const isExpanded = expandedKeys.has(key);

                            const cellContent = (col: DataTableDef<T>) => {
                                if (col.tableItemRender) return col.tableItemRender(item);
                                if (col.accessorKey) return item[col.accessorKey] as unknown as ReactNode;
                            };

                            return (
                                <tbody
                                    key={key}
                                    className={cn(hoverClasses, classNames?.tbody)}
                                >
                                    <tr
                                        onClick={() => { if (expandOnRowClick) this.toggleRow(key); onRowClick?.(item); }}
                                        className={cn(
                                            "transition-colors border-t border-border dark:border-border-dark",
                                            rowHoverClasses,
                                            this.getRowClass(item),
                                            classNames?.tr
                                        )}
                                    >
                                        <td
                                            className={cn("px-3 py-2 text-text-muted dark:text-text-muted-dark", classNames?.chevronTd)}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                this.toggleRow(key);
                                            }}
                                        >
                                            {isExpanded
                                                ? <ChevronDown size={16} className={cn("cursor-pointer hover:text-text-primary dark:hover:text-text-primary-dark", classNames?.chevronIcon)} />
                                                : <ChevronRight size={16} className={cn("cursor-pointer hover:text-text-primary dark:hover:text-text-primary-dark", classNames?.chevronIcon)} />
                                            }
                                        </td>
                                        {itemDef.map((col, idx) => {
                                            const cellClass = typeof col.tableCellClassName === 'function'
                                                ? col.tableCellClassName(item)
                                                : (col.tableCellClassName ?? '');
                                            return (
                                                <td key={idx} className={cn("py-2 whitespace-nowrap text-text-primary dark:text-text-primary-dark", idx > 0 && "px-6", cellClass, classNames?.td)}>
                                                    {cellContent(col)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    {isExpanded && (
                                        <tr
                                            className={cn(
                                                "border-b border-border dark:border-border-dark",
                                                rowHoverClasses,
                                                classNames?.expandedTr
                                            )}
                                            onClick={() => { if (expandOnRowClick) this.toggleRow(key); }}
                                        >
                                            <td />
                                            <td
                                                colSpan={contentColSpan}
                                                className={classNames?.expandedTd}
                                            >
                                                {expandedRowRender(item)}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            );
                        })
                    )}
                </table>
            </div>
        );
    }
}
