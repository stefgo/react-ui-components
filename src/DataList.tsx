import { ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { BaseDataViewProps, DataViewClassNames } from './data/types';
import { useDataView } from './data/useDataView';
import { useTreeExpansion, type TreeExpansionOptions } from './data/useTreeExpansion';
import { flattenTree } from './data/tree';
import { DataViewFrame } from './data/DataViewFrame';
import { SelectionCheckbox } from './data/SelectionCheckbox';
import { cn } from './utils';
import { FOCUS_RING } from './focus';

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
    /** The expand button of a row with children, and the gap a leaf keeps in its place. */
    chevronIcon?: string;
}

export interface DataListProps<T> extends BaseDataViewProps<T> {
    columns?: DataListColumnDef<T>[];
    /**
     * Makes the list a tree: a row with children gets an expand button, and its
     * children follow it, indented. It is what a tree table turns into where
     * its columns do not fit side by side. As in `DataTreeTable`, a page is
     * taken from the root rows.
     */
    getChildren?: (item: T) => T[] | undefined | null;
    /** Row expansion, with `getChildren`. Leave it out and the view owns it. */
    expanded?: TreeExpansionOptions;
    /** Pixels of indentation per depth level. Default: 20 */
    indentSize?: number;
    classNames?: DataListClassNames;
}

/** Stands in for `getChildren` on a flat list, so the expansion hook always has one. */
const NO_CHILDREN = () => null;

function resolveContent<T>(col: DataListDef<T>, item: T): ReactNode {
    if (col.listItemRender) return col.listItemRender(item);
    if (col.accessorKey) return item[col.accessorKey] as unknown as ReactNode;
    return null;
}

export const DataList = <T,>(props: DataListProps<T>) => {
    const { columns: columnsProp, getChildren, expanded, indentSize = 20, classNames, className } = props;
    // No comparator — the caller's order is kept, at every level of a tree.
    const { rows, placeholder, getKey, getRowClass, rowActivationProps, interactionClasses, pagination, selection } = useDataView(props);

    const { expandedKeys, toggleRow } = useTreeExpansion({
        data: props.data,
        visibleRows: rows,
        getChildren: getChildren ?? NO_CHILDREN,
        getKey,
        expanded,
    });

    const flatRows = placeholder ? []
        : getChildren ? flattenTree(rows, { getChildren, getKey, expandedKeys })
        : rows.map((item) => ({ item, depth: 0 }));

    const fieldsOf = (item: T) => (
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
    );

    return (
        <DataViewFrame className={className} classNames={classNames} pagination={pagination}>
            <div className={cn("divide-y divide-border", classNames?.listRoot)}>
                {placeholder ? (
                    <div className={cn("px-6 py-8 text-center text-text-muted", classNames?.placeholder)}>
                        {placeholder}
                    </div>
                ) : (
                    flatRows.map(({ item, depth }) => {
                        const key = getKey(item);
                        const children = getChildren?.(item);
                        const hasChildren = !!(children && children.length > 0);
                        const isExpanded = expandedKeys.has(key);

                        return (
                            <div
                                key={key}
                                {...rowActivationProps(item)}
                                style={depth > 0 ? { paddingLeft: `${20 + depth * indentSize}px` } : undefined}
                                className={cn(
                                    "px-5 py-2 transition-colors group",
                                    interactionClasses(item),
                                    getRowClass(item),
                                    classNames?.row
                                )}
                            >
                                {getChildren || selection ? (
                                    <div className="flex items-start gap-2">
                                        {selection && (
                                            <span className="shrink-0 w-4 mt-1">
                                                <SelectionCheckbox item={item} selection={selection} />
                                            </span>
                                        )}
                                        {/*
                                            As in the tree table: a leaf holds the
                                            indent open with an inert span, not with a
                                            disabled button that says nothing.
                                        */}
                                        {!getChildren ? null : hasChildren ? (
                                            <button
                                                type="button"
                                                aria-expanded={isExpanded}
                                                aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                                                // The row itself may be clickable; expanding is
                                                // not the same action as opening the row.
                                                onClick={(e) => { e.stopPropagation(); toggleRow(key); }}
                                                className={cn(
                                                    "shrink-0 w-4 mt-1 text-text-muted hover:text-text-primary rounded-sm",
                                                    FOCUS_RING,
                                                    classNames?.chevronIcon,
                                                )}
                                            >
                                                {isExpanded
                                                    ? <ChevronDown size={16} aria-hidden />
                                                    : <ChevronRight size={16} aria-hidden />
                                                }
                                            </button>
                                        ) : (
                                            <span aria-hidden="true" className={cn("shrink-0 w-4", classNames?.chevronIcon)} />
                                        )}
                                        <div className="flex-1 min-w-0">{fieldsOf(item)}</div>
                                    </div>
                                ) : (
                                    fieldsOf(item)
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </DataViewFrame>
    );
};
