import { ReactNode, useState, useEffect, useMemo } from 'react';
import { LayoutList, Table as TableIcon, Network, Search, X } from 'lucide-react';
import { Card, CardClassNames } from './Card';
import { DataTable, DataTableDef, DataTableClassNames } from './DataTable';
import { DataList, DataListColumnDef, DataListClassNames } from './DataList';
import { DataTreeTable, DataTreeTableClassNames } from './DataTreeTable';
import { BaseDataViewProps, type RowKey, type SelectionOptions } from './data/types';
import { selectAllState, toggleAll } from './data/selection';
import { Checkbox } from './Checkbox';
import { toListColumns, toTableDef, type DataColumnDef, type DataListGroupDef } from './data/columns';
import type { SortOptions } from './data/useSortColumns';
import type { TreeExpansionOptions } from './data/useTreeExpansion';
import { useControllableState } from './hooks/useControllableState';
import { usePersistentState } from './hooks/usePersistentState';
import type { Controllable, Persistable } from './types';
import { cn } from './utils';
import { FOCUS_RING, FOCUS_RING_INSET, FOCUS_RING_NONE, FOCUS_RING_WITHIN } from './focus';

export interface DataMultiViewClassNames {
    card?: CardClassNames;
    header?: CardClassNames;
    toggleRoot?: string;
    toggleButton?: string;
    toggleButtonActive?: string;
    table?: DataTableClassNames;
    list?: DataListClassNames;
    treeTable?: DataTreeTableClassNames;
    extraActionsWrapper?: string;
    searchBar?: string;
    /** The wrapper of `searchActions`, at the right end of the search bar. */
    searchActionsWrapper?: string;
    /** The line with "select all", the count and `selectionActions`. */
    selectionBar?: string;
}

export interface MultiViewSelectionOptions<T> extends SelectionOptions<T> {
    /**
     * What the selection line says while something is picked. Default:
     * "3 selected", the number of picked keys -- which in a tree counts a
     * parent next to its children, so a caller that picks both says what the
     * selection amounts to instead.
     */
    label?: (selected: ReadonlySet<RowKey>) => string;
}

export interface DataMultiViewProps<T> {
    title?: ReactNode;
    extraActions?: ReactNode;
    className?: string;
    data: T[];
    /**
     * Makes the view a tree: the table becomes a tree table, and the list view
     * -- which a narrow screen is shown instead -- indents the children under
     * their row. Give the tree `columns` (or `listColumns`), or a narrow screen
     * has only the tree table to scroll sideways.
     */
    getChildren?: (item: T) => T[] | undefined | null;
    /**
     * Every column once, for the table and the list view alike. Use it instead
     * of `tableDef` and `listColumns`, not next to them: where both are given,
     * `columns` is what is shown.
     */
    columns?: DataColumnDef<T>[];
    /** The blocks a list row is laid out in, for `columns`. One block without it. */
    listGroups?: DataListGroupDef[];
    tableDef?: DataTableDef<T>[];
    listColumns?: DataListColumnDef<T>[];
    /** Column definitions for tree table view. Requires `getChildren` to be set. */
    treeTableDef?: DataTableDef<T>[];
    /** Row expansion of the tree view. Leave it out and the view owns it. */
    treeExpanded?: TreeExpansionOptions;
    treeTableIndentSize?: number;
    keyField: keyof T | ((item: T) => string | number);
    isLoading?: boolean;
    emptyMessage?: ReactNode;
    loadingMessage?: ReactNode;
    /** Column sorting. Leave it out and the view owns it. */
    sort?: SortOptions;
    rowClassName?: string | ((item: T) => string);
    onRowClick?: (item: T) => void;
    /** Derived from the data views so the two shapes cannot drift apart. */
    pagination?: BaseDataViewProps<T>['pagination'];
    /** Shown when a filter removed everything. Falls back to `emptyMessage`. */
    noResultsMessage?: ReactNode;
    classNames?: DataMultiViewClassNames;
    /** Show search input between header and content */
    searchable?: boolean;
    /** Placeholder text for the search input */
    searchPlaceholder?: string;
    /**
     * Controls that narrow the same list the search does — a filter select, for
     * example — rendered at the right end of the search bar. Only shown while
     * `searchable` is set, since that is when the bar exists.
     */
    searchActions?: ReactNode;
    /** Filter function for internal filtering. Receives each item and the current query string. */
    searchFilter?: (item: T, query: string) => boolean;
    /** The search query. Leave it out and the view owns it. */
    /**
     * Deliberately `Controllable` and not `Persistable`: a search that came
     * back on its own would hide rows on load, and the reason would be a field
     * the reader has to notice first.
     */
    search?: Controllable<string>;
    /** Which view is shown. Leave it out and the view owns it. */
    viewMode?: ViewModeOptions;
    /**
     * A checkbox in front of every row, in all three views, and a line above
     * them with "select all" and the count. "Select all" picks what the search
     * leaves, on every page; in a tree those are the root rows. Leave out
     * `value` and the view owns the selection.
     */
    selection?: MultiViewSelectionOptions<T>;
    /**
     * What can be done with the picked rows, shown in the selection line while
     * at least one is picked. Called with their keys.
     */
    selectionActions?: (selected: ReadonlySet<RowKey>) => ReactNode;
}

const NO_SELECTION: ReadonlySet<RowKey> = new Set();

export type ViewMode = 'table' | 'list' | 'tree';

export type ViewModeOptions = Persistable<ViewMode>;

export const DataMultiView = <T,>(props: DataMultiViewProps<T>) => {
    const {
        title,
        extraActions,
        className = '',
        columns,
        listGroups,
        tableDef: tableDefProp,
        listColumns: listColumnsProp,
        getChildren,
        treeExpanded,
        treeTableIndentSize,
        classNames,
        sort,
        searchable,
        searchPlaceholder = 'Suchen…',
        searchActions,
        searchFilter,
        search,
        viewMode,
        pagination,
        selection,
        selectionActions,
        ...sharedProps
    } = props;

    const [searchQuery, setSearchQuery] = useControllableState({
        value: search?.value,
        defaultValue: search?.defaultValue,
        onChange: search?.onChange,
        fallback: ''
    });

    // Handed down instead of applied here: the view that counts the rows has to
    // be the one that filters them, or the page numbers describe a different set
    // than the table shows.
    const filter = useMemo(() => (
        searchable && searchFilter && searchQuery
            ? (item: T) => searchFilter(item, searchQuery)
            : undefined
    ), [searchable, searchFilter, searchQuery]);

    // Held here rather than in the view underneath: the line above the rows
    // needs it, and switching between table and list must not empty it.
    const [selected, setSelected] = useControllableState<ReadonlySet<RowKey>>({
        value: selection?.value,
        defaultValue: selection?.defaultValue,
        onChange: selection?.onChange,
        fallback: NO_SELECTION,
    });
    const { data, keyField } = props;
    const isSelectable = selection?.isSelectable;
    // What "select all" picks: the rows the search leaves, not the page of them
    // that is on screen -- an action on "everything that matches" must not stop
    // at the page break.
    const selectAllKeys = useMemo(() => {
        if (!selection) return [];
        const keyOf = (item: T): RowKey => (
            typeof keyField === 'function' ? keyField(item) : item[keyField] as unknown as RowKey
        );
        return (filter ? data.filter(filter) : data)
            .filter((item) => isSelectable?.(item) ?? true)
            .map(keyOf);
    }, [selection, data, keyField, filter, isSelectable]);
    const allState = selectAllState(selectAllKeys, selected);
    const rowSelection = useMemo<SelectionOptions<T> | undefined>(() => (selection ? {
        value: selected,
        onChange: setSelected,
        isSelectable: selection.isSelectable,
        rowLabel: selection.rowLabel,
    } : undefined), [selection, selected, setSelected]);

    const paginationMode = typeof pagination === 'object' ? pagination.mode : undefined;
    useEffect(() => {
        if (paginationMode === 'server' && searchFilter) {
            console.warn(
                '[DataMultiView] searchFilter filters the rows already on screen, which is '
                + 'the current page when pagination.mode is "server". Send the query to the '
                + 'server via onSearchChange instead.',
            );
        }
    }, [paginationMode, searchFilter]);

    const hasBothColumnSources = !!columns && !!(tableDefProp || listColumnsProp);
    useEffect(() => {
        if (hasBothColumnSources) {
            console.warn(
                '[DataMultiView] columns replaces tableDef and listColumns; the two that '
                + 'were passed next to it are ignored.',
            );
        }
    }, [hasBothColumnSources]);

    const tableDef = useMemo(() => (columns ? toTableDef(columns) : tableDefProp), [columns, tableDefProp]);
    const listColumns = useMemo(
        () => (columns ? toListColumns(columns, listGroups) : listColumnsProp),
        [columns, listGroups, listColumnsProp],
    );

    const hasTreeView = !!(tableDef && getChildren);

    // Mobile detection
    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const firstMode: ViewMode = hasTreeView ? 'tree' : tableDef ? 'table' : 'list';

    const [currentViewMode, changeViewMode] = usePersistentState<ViewMode>({
        value: viewMode?.value,
        defaultValue: viewMode?.defaultValue,
        onChange: viewMode?.onChange,
        persist: viewMode?.persist,
        fallback: () => firstMode,
        revive: (raw) => {
            if (raw !== 'table' && raw !== 'list' && raw !== 'tree') return undefined;
            // A stored 'tree' is meaningless without a tree definition.
            if (raw === 'tree' && !hasTreeView) return undefined;
            return raw;
        },
    });

    // Effective view mode is forced to 'list' on mobile (only if listColumns is defined)
    const effectiveViewMode: ViewMode = isMobile && listColumns ? 'list' : currentViewMode;

    const toggleButtonClass = (mode: ViewMode) => cn(
        "p-1 rounded-sm transition",
        // The group is only p-1 tall, so the ring sits inside the button
        // instead of bleeding over the neighbouring toggle.
        //
        // Named here rather than hoisted into a module constant, even though
        // that would merge it once instead of per render: `conventions.test.ts`
        // resolves one level of indirection, so a hoist puts the ring out of
        // its reach and the button silently stops being covered. Three merges
        // per render is the cheaper side of that trade.
        FOCUS_RING_INSET,
        effectiveViewMode === mode
            ? 'bg-table-header-toggle-active-bg shadow text-text-primary'
            : 'text-text-muted hover:text-text-primary',
        classNames?.toggleButton,
        effectiveViewMode === mode ? classNames?.toggleButtonActive : ''
    );

    const visibleButtonCount = [hasTreeView, !!(tableDef && !hasTreeView), !!listColumns].filter(Boolean).length;

    const viewToggle = !isMobile && visibleButtonCount > 1 ? (
        <div className={cn("bg-table-header-toggle-bg rounded-md p-1 flex items-center gap-1", classNames?.toggleRoot)}>
            {hasTreeView && (
                <button type="button" onClick={() => changeViewMode('tree')} className={toggleButtonClass('tree')} title="Tree View" aria-label="Tree View" aria-pressed={effectiveViewMode === 'tree'}>
                    <Network size={14} aria-hidden="true" />
                </button>
            )}
            {tableDef && !hasTreeView && (
                <button type="button" onClick={() => changeViewMode('table')} className={toggleButtonClass('table')} title="Table View" aria-label="Table View" aria-pressed={effectiveViewMode === 'table'}>
                    <TableIcon size={14} aria-hidden="true" />
                </button>
            )}
            {listColumns && (
                <button type="button" onClick={() => changeViewMode('list')} className={toggleButtonClass('list')} title="List View" aria-label="List View" aria-pressed={effectiveViewMode === 'list'}>
                    <LayoutList size={14} aria-hidden="true" />
                </button>
            )}
        </div>
    ) : null;

    const headerAction = (
        <div className={cn("flex items-center gap-3", classNames?.extraActionsWrapper)}>
            {viewToggle}
            {extraActions}
        </div>
    );

    const containerProps = {
        ...sharedProps,
        filter,
        filterKey: searchQuery,
        className: "rounded-none border-0 shadow-none flex-1",
        // The view underneath owns the whole pipeline now, pagination bar
        // included — one owner, so the row count and the page numbers cannot
        // disagree.
        pagination,
        selection: rowSelection,
    };

    return (
        <Card padding="none" className={cn("overflow-hidden flex flex-col h-full", className)} classNames={{ ...classNames?.card, ...classNames?.header, header: cn(classNames?.card?.header, classNames?.header?.header, searchable && 'border-b-0 pb-1') }} title={title} action={headerAction}>
            {searchable && (
                <div className={cn(
                    "px-4 py-2 border-b border-border bg-card-header flex items-center gap-3",
                    classNames?.searchBar
                )}>
                    {/*
                        The ring goes on the pill, not on the input: the input has
                        no border of its own, so a ring around it would float
                        inside the pill and cut across the icon and the clear
                        button. The input suppresses its own.
                    */}
                    <div className={cn(
                        "flex flex-1 min-w-0 items-center gap-2 px-3 py-1 rounded-full border border-border bg-app-bg",
                        FOCUS_RING_WITHIN
                    )}>
                        <Search size={14} className="text-text-muted shrink-0" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder={searchPlaceholder}
                            className={cn("w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted", FOCUS_RING_NONE)}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                aria-label="Clear search"
                                onClick={() => setSearchQuery('')}
                                className={cn("text-text-muted hover:text-text-primary shrink-0 rounded-full", FOCUS_RING)}
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    {searchActions && (
                        <div className={cn("flex items-center gap-2 shrink-0", classNames?.searchActionsWrapper)}>
                            {searchActions}
                        </div>
                    )}
                </div>
            )}
            {selection && (
                <div className={cn(
                    "px-5 py-2 border-b border-border flex flex-wrap items-center gap-x-3 gap-y-2 min-h-[2.75rem]",
                    classNames?.selectionBar
                )}>
                    <Checkbox
                        label={selected.size === 0 ? 'Select all' : selection.label?.(selected) ?? `${selected.size} selected`}
                        checked={allState === 'all'}
                        indeterminate={allState === 'some'}
                        disabled={selectAllKeys.length === 0}
                        onChange={() => setSelected((prev) => toggleAll(prev, selectAllKeys))}
                    />
                    {selected.size > 0 && selectionActions && (
                        <div className="ml-auto flex flex-wrap items-center gap-2">
                            {selectionActions(selected)}
                        </div>
                    )}
                </div>
            )}
            {effectiveViewMode === 'list' ? (
                // A tree stays a tree in the list view: on a narrow screen the
                // list is what the tree table turns into, and a flat list of its
                // roots would have dropped every child row.
                <DataList
                    {...containerProps}
                    columns={listColumns}
                    getChildren={getChildren}
                    expanded={treeExpanded}
                    indentSize={treeTableIndentSize}
                    classNames={classNames?.list}
                />
            ) : effectiveViewMode === 'tree' && hasTreeView ? (
                <DataTreeTable
                    {...containerProps}
                    itemDef={tableDef!}
                    getChildren={getChildren!}
                    expanded={treeExpanded}
                    sort={sort}
                    indentSize={treeTableIndentSize}
                    classNames={classNames?.treeTable}
                />
            ) : (
                <DataTable
                    {...containerProps}
                    itemDef={tableDef!}
                    sort={sort}
                    classNames={classNames?.table}
                />
            )}
        </Card>
    );
};
