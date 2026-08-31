import { ReactNode } from 'react';
import { BaseDataViewProps, DataViewClassNames } from './data/types';
import { useDataView } from './data/useDataView';
import { DataViewFrame } from './data/DataViewFrame';
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

function resolveContent<T>(col: DataListDef<T>, item: T): ReactNode {
    if (col.listItemRender) return col.listItemRender(item);
    if (col.accessorKey) return item[col.accessorKey] as unknown as ReactNode;
    return null;
}

export const DataList = <T,>(props: DataListProps<T>) => {
    const { columns: columnsProp, onRowClick, classNames, className } = props;
    // No comparator — the caller's order is kept.
    const { rows, placeholder, getKey, getRowClass, interactionClasses, pagination } = useDataView(props);

    return (
        <DataViewFrame className={className} classNames={classNames} pagination={pagination}>
            <div className={cn("divide-y divide-border", classNames?.listRoot)}>
                {placeholder ? (
                    <div className={cn("px-6 py-8 text-center text-text-muted", classNames?.placeholder)}>
                        {placeholder}
                    </div>
                ) : (
                    rows.map((item) => (
                        <div
                            key={getKey(item)}
                            onClick={() => onRowClick?.(item)}
                            className={cn(
                                "px-5 py-2 transition-colors group",
                                interactionClasses,
                                getRowClass(item),
                                classNames?.row
                            )}
                        >
                            <div className={cn("flex flex-col", columnsProp && columnsProp.length > 1 && "md:flex-row md:items-center", classNames?.colWrapper)}>
                                {columnsProp?.map((colGroup, colIdx) => (
                                    <div key={colIdx} className={cn(colGroup.grow && "flex-1", colGroup.columnClassName, classNames?.column)}>
                                        {colGroup.fields
                                            .filter(def => def.listItemRender !== undefined || def.accessorKey !== undefined)
                                            .map((col, idx) => (
                                                <div key={idx} className={cn("mb-1 last:mb-0", classNames?.itemWrapper)}>
                                                    {col.listLabel != null ? (
                                                        <div className={cn("flex items-start gap-2 text-sm", classNames?.labelWrapper)}>
                                                            <span className={cn(
                                                                "font-semibold text-text-muted min-w-[100px] shrink-0",
                                                                col.listLabelClassName,
                                                                classNames?.label
                                                            )}>
                                                                {col.listLabel}:
                                                            </span>
                                                            <div className={cn("flex-1 overflow-hidden", classNames?.value)}>
                                                                {resolveContent(col, item)}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className={cn(classNames?.value)}>{resolveContent(col, item)}</div>
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
        </DataViewFrame>
    );
};
