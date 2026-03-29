import { ReactNode } from 'react';
import { AbstractDataView, BaseDataViewProps, DataViewClassNames } from './AbstractDataView';
import { cn } from './utils';

export interface DataListDef<T> {
    accessorKey?: keyof T;
    listLabel?: ReactNode | null;
    listLabelClassName?: string;
    listItemRender?: (item: T) => ReactNode;
}

export interface DataListColumnDef<T> {
    fields: DataListDef<T>[];
    columnClassName?: string;
    grow?: boolean;
}

export interface DataListClassNames extends DataViewClassNames {
    listRoot?: string;
    placeholder?: string;
    row?: string;
    colWrapper?: string;
    column?: string;
    itemWrapper?: string;
    labelWrapper?: string;
    label?: string;
    value?: string;
}

export interface DataListProps<T> extends BaseDataViewProps<T> {
    columns?: DataListColumnDef<T>[];
    classNames?: DataListClassNames;
}

export class DataList<T> extends AbstractDataView<T, DataListProps<T>> {
    private resolveContent(col: DataListDef<T>, item: T): ReactNode {
        if (col.listItemRender) return col.listItemRender(item);
        if (col.accessorKey) return item[col.accessorKey] as unknown as ReactNode;
        return null;
    }

    protected renderContent(): ReactNode {
        const { data, columns: columnsProp, onRowClick, classNames } = this.props;
        const placeholder = this.getPlaceholder();
        const interactionClasses = this.getInteractionClasses();

        return (
            <div className={cn("divide-y divide-border dark:divide-border-dark", classNames?.listRoot)}>
                {placeholder ? (
                    <div className={cn("px-6 py-8 text-center text-text-muted dark:text-text-muted-dark", classNames?.placeholder)}>
                        {placeholder}
                    </div>
                ) : (
                    data.map((item) => (
                        <div
                            key={this.getKey(item)}
                            onClick={() => onRowClick?.(item)}
                            className={cn(
                                "px-5 py-2 transition-colors group",
                                interactionClasses,
                                this.getRowClass(item),
                                classNames?.row
                            )}
                        >
                            <div className={cn("flex flex-col md:flex-row md:items-center", classNames?.colWrapper)}>
                                {columnsProp?.map((colGroup, colIdx) => (
                                    <div key={colIdx} className={cn(colGroup.grow && "flex-1", colGroup.columnClassName, classNames?.column)}>
                                        {colGroup.fields
                                            .filter(def => def.listItemRender !== undefined || def.accessorKey !== undefined)
                                            .map((col, idx) => (
                                                <div key={idx} className={cn("mb-1 last:mb-0", classNames?.itemWrapper)}>
                                                    {col.listLabel != null ? (
                                                        <div className={cn("flex items-start gap-2 text-sm", classNames?.labelWrapper)}>
                                                            <span className={cn(
                                                                "font-semibold text-text-muted dark:text-text-muted-dark min-w-[100px] shrink-0",
                                                                col.listLabelClassName,
                                                                classNames?.label
                                                            )}>
                                                                {col.listLabel}:
                                                            </span>
                                                            <div className={cn("flex-1 overflow-hidden", classNames?.value)}>
                                                                {this.resolveContent(col, item)}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className={cn(classNames?.value)}>{this.resolveContent(col, item)}</div>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        );
    }
}

