import { ReactNode } from 'react';
import { AbstractDataView, BaseDataViewProps, DataViewClassNames } from './AbstractDataView';
import { cn } from './utils';

export interface DataTableDef<T> {
    accessorKey?: keyof T;
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

export class DataTable<T> extends AbstractDataView<T, DataTableProps<T>> {
    protected renderContent(): ReactNode {
        const { data, itemDef, onRowClick, classNames } = this.props;
        const placeholder = this.getPlaceholder();
        const interactionClasses = this.getInteractionClasses();

        return (
            <div className="overflow-x-auto h-full w-full">
                <table className={cn("w-full text-left border-collapse", classNames?.table)}>
                    <thead className={cn("sticky top-0 bg-table-header dark:bg-table-header-dark z-10", classNames?.thead)}>
                        <tr className={cn("border-b border-gray-200 dark:border-dark", classNames?.headerRow)}>
                            {itemDef.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={cn(
                                        "px-6 py-2 text-xs font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wider",
                                        col.tableHeaderClassName,
                                        classNames?.th
                                    )}
                                >
                                    {col.tableHeader}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={cn("divide-y divide-gray-200 dark:divide-dark", classNames?.tbody)}>
                        {placeholder ? (
                            <tr>
                                <td colSpan={itemDef.length} className={cn("px-6 py-8 text-center text-text-muted dark:text-text-muted-dark", classNames?.placeholderTd)}>
                                    {placeholder}
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => {
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

