import { ReactNode, useState, useEffect, useMemo } from 'react';
import { LayoutList, Table as TableIcon, Network, Search, X } from 'lucide-react';
import { Card, CardClassNames } from './Card';
import { DataTable, DataTableDef, DataTableClassNames } from './DataTable';
import { DataList, DataListColumnDef, DataListClassNames } from './DataList';
import { DataTreeTable, DataTreeTableClassNames } from './DataTreeTable';
import { BaseDataViewProps, type RowKey, type SelectionOptions } from './data/types';
import { toListColumns, toTableDef, type DataColumnDef, type DataListGroupDef } from './data/columns';
import type { SortOptions } from './data/useSortColumns';
import type { TreeExpansionOptions } from './data/useTreeExpansion';
import { useControllableState } from './hooks/useControllableState';
import { usePersistentState } from './hooks/usePersistentState';
import type { Controllable, Persistable } from './types';
import { cn } from './utils';
import { FieldVariantContext, PILL_SURFACE } from './form/fieldVariant';
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
    /** The wrapper of the view toggle and `globalActions`, in the header. */
    globalActionsWrapper?: string;
    searchBar?: string;
    /** The wrapper of `searchActions`, at the right end of the search bar. */
    searchActionsWrapper?: string;
    /** The line between the search and the rows that holds `selectionActions`. */
    selectionBar?: string;
    /** The wrapper of `selectionActions`, at the right end of the selection bar. */
    selectionActionsWrapper?: string;
    /**
     * What is picked, counted: at the left end of the selection bar, or in
     * brackets behind the title where there is no bar.
     */
    selectionCount?: string;
}

export interface MultiViewSelectionOptions<T> extends SelectionOptions<T> {
    /**
     * What stands in brackets behind the title while something is picked.
     * With `selectionActions` the default is "3 selected", the number of
     * picked keys -- which in a tree counts a parent next to its children, so
     * a caller that picks both says what the selection amounts to instead.
     * Without them, the count is shown only where this is given, in brackets
     * behind the title.
     */
    label?: (selected: ReadonlySet<RowKey>) => string;
    /**
     * What the selection bar says while nothing is picked. Only shown with
     * `selectionActions`; without it the bar holds just the disabled actions.
     */
    hint?: string;
}

export interface DataMultiViewProps<T> {
    title?: ReactNode;
    /**
     * The actions in the card's header, next to the view toggle: everything
     * that does not depend on the selection -- creating something, or acting
     * on what the list shows. What acts on the picked rows belongs in
     * `selectionActions`, so that no button changes its reach with a pick.
     */
    globalActions?: ReactNode;
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
    /** Which rows `onRowClick` applies to. Leave it out and every row is clickable. */
    isRowClickable?: (item: T) => boolean;
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
     * `searchable` is set, since that is when the bar exists. A `Select` in here
     * takes the shape of the search (`variant="pill"`) unless it names another.
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
     * A checkbox in front of every row, in all three views, and "select all"
     * in the header of that column -- which the list does not have, so it has
     * no "select all" either. "Select all" picks what the search leaves, on
     * every page; in a tree those are the root rows. Leave out `value` and the
     * view owns the selection.
     */
    selection?: MultiViewSelectionOptions<T>;
    /**
     * What can be done with the picked rows. They stand in a bar of their own
     * between the search and the rows, which is there whether something is
     * picked or not: the first pick must not move the row under the pointer.
     * While nothing is picked the bar shows `selection.hint`, if given, and the
     * caller disables what has nothing to act on; once something is, the bar
     * counts the picks. The actions end at the same right edge as the
     * header's. Called with the picked keys.
     */
    selectionActions?: (selected: ReadonlySet<RowKey>) => ReactNode;
}

const NO_SELECTION: ReadonlySet<RowKey> = new Set();

export type ViewMode = 'table' | 'list' | 'tree';

export type ViewModeOptions = Persistable<ViewMode>;

export const DataMultiView = <T,>(props: DataMultiViewProps<T>) => {
    const {
        title,
        globalActions,
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

    // Held here rather than in the view underneath: the header needs it, and
    // switching between table and list must not empty it.
    const [selected, setSelected] = useControllableState<ReadonlySet<RowKey>>({
        value: selection?.value,
        defaultValue: selection?.defaultValue,
        onChange: selection?.onChange,
        fallback: NO_SELECTION,
    });
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

    const hasPicks = !!selection && selected.size > 0;
    const pickedLabel = hasPicks ? (selection?.label?.(selected) ?? `${selected.size} selected`) : null;

    // Its own line rather than a place in the header: a button in the header
    // acts on what the list shows, one in here on what is picked, and none of
    // them changes its reach with a pick. Always there once it has actions, so
    // the first pick does not push the rows down.
    const selectionBar = selection && selectionActions ? (
        <div
            role="group"
            aria-label="Selection"
            className={cn(
                // `pr-5` is the header's: the last action ends where the last
                // of the header's does, so the two rows read as one column.
                // `pb-3` keeps the gap down to the line as wide as the one up
                // to the search, which is `pb-1` of the search plus `pt-2`.
                "pl-4 pr-5 pt-2 pb-3 border-b border-border bg-card-header flex flex-wrap items-center gap-x-4 gap-y-2",
                classNames?.selectionBar
            )}
        >
            <span
                className={cn("text-sm", hasPicks ? "font-medium text-text-primary" : "text-text-muted", classNames?.selectionCount)}
                aria-live="polite"
            >
                {pickedLabel ?? selection.hint}
            </span>
            {/* At the right end, so that the count on the left does not move them. */}
            <div className={cn("ml-auto flex flex-wrap items-center justify-end gap-2", classNames?.selectionActionsWrapper)}>
                {selectionActions(selected)}
            </div>
        </div>
    ) : null;

    // Without a bar, a caller that says what the selection amounts to has it
    // counted behind the title, in brackets: it is the title's rows that are
    // counted. Without that either, the number would lead nowhere.
    const titleCount = hasPicks && !selectionActions && selection?.label ? (
        <span className={cn("font-normal text-text-secondary", classNames?.selectionCount)} aria-live="polite">
            ({pickedLabel})
        </span>
    ) : null;

    const headerAction = (
        <div className={cn("flex flex-wrap items-center justify-end gap-3", classNames?.globalActionsWrapper)}>
            {viewToggle}
            {globalActions}
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
        <Card padding="none" className={cn("overflow-hidden flex flex-col h-full", className)} classNames={{ ...classNames?.card, ...classNames?.header, header: cn(classNames?.card?.header, classNames?.header?.header, searchable && 'border-b-0 pb-1') }} title={titleCount ? <>{title}{' '}{titleCount}</> : title} action={headerAction}>
            {searchable && (
                <div className={cn(
                    "px-4 py-2 bg-card-header flex items-center gap-3",
                    // The selection bar below continues it: no line between the two,
                    // and the same gap as between the header and the search, which
                    // also gives the search only `pb-1`.
                    selectionBar ? "pb-1" : "border-b border-border",
                    classNames?.searchBar
                )}>
                    {/*
                        The ring goes on the pill, not on the input: the input has
                        no border of its own, so a ring around it would float
                        inside the pill and cut across the icon and the clear
                        button. The input suppresses its own.
                    */}
                    <div className={cn(
                        "flex flex-1 min-w-0 items-center gap-2 px-3 py-1",
                        PILL_SURFACE,
                        FOCUS_RING_WITHIN
                    )}>
                        <Search size={14} className="text-text-muted shrink-0" />
                        {/*
                            A searchbox by role, named by its placeholder: a page
                            can find the search of the list on screen -- to focus
                            it from a shortcut -- without a ref through every list.
                            Not `type="search"`, which brings a clear button of the
                            browser's next to ours.
                        */}
                        <input
                            type="text"
                            role="searchbox"
                            aria-label={searchPlaceholder}
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
                            <FieldVariantContext.Provider value="pill">
                                {searchActions}
                            </FieldVariantContext.Provider>
                        </div>
                    )}
                </div>
            )}
            {selectionBar}
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
