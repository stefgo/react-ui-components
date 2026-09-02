import { ReactNode, useState, useEffect, useMemo } from 'react';
import { LayoutList, Table as TableIcon, Network, Search, X } from 'lucide-react';
import { Card, CardClassNames } from './Card';
import { DataTable, DataTableDef, DataTableClassNames } from './DataTable';
import { DataList, DataListColumnDef, DataListClassNames } from './DataList';
import { DataTreeTable, DataTreeTableClassNames } from './DataTreeTable';
import { BaseDataViewProps } from './data/types';
import type { SortOptions } from './data/useSortColumns';
import type { TreeExpansionOptions } from './data/useTreeExpansion';
import { useControllableState } from './hooks/useControllableState';
import type { Controllable } from './types';
import { cn } from './utils';

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
}

export interface DataMultiViewProps<T> {
    title?: ReactNode;
    extraActions?: ReactNode;
    className?: string;
    data: T[];
    getChildren?: (item: T) => T[] | undefined | null;
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
    /** Filter function for internal filtering. Receives each item and the current query string. */
    searchFilter?: (item: T, query: string) => boolean;
    /** The search query. Leave it out and the view owns it. */
    search?: Controllable<string>;
    /** Which view is shown. Leave it out and the view owns it. */
    viewMode?: ViewModeOptions;
}

export type ViewMode = 'table' | 'list' | 'tree';

export interface ViewModeOptions extends Controllable<ViewMode> {
    /**
     * Remembers the chosen view across reloads while uncontrolled. It is the
     * *default* of the uncontrolled variant, not a second mode — a controlled
     * caller can restore the view from the URL instead, which used to be
     * impossible.
     */
    storageKey?: string;
}

export const DataMultiView = <T,>(props: DataMultiViewProps<T>) => {
    const {
        title,
        extraActions,
        className = '',
        tableDef,
        listColumns,
        getChildren,
        treeExpanded,
        treeTableIndentSize,
        classNames,
        sort,
        searchable,
        searchPlaceholder = 'Suchen…',
        searchFilter,
        search,
        viewMode,
        pagination,
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

    const hasTreeView = !!(tableDef && getChildren);
    
    // Mobile detection
    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const firstMode: ViewMode = hasTreeView ? 'tree' : tableDef ? 'table' : 'list';

    const viewModeStorageKey = viewMode?.storageKey;

    const [currentViewMode, setViewMode] = useControllableState<ViewMode>({
        value: viewMode?.value,
        defaultValue: viewMode?.defaultValue,
        onChange: viewMode?.onChange,
        fallback: () => {
            if (!viewModeStorageKey || typeof localStorage === 'undefined') return firstMode;
            const saved = localStorage.getItem(viewModeStorageKey) as ViewMode | null;
            // A stored 'tree' is meaningless without a tree definition.
            if (saved === 'tree' && !hasTreeView) return firstMode;
            return saved ?? firstMode;
        }
    });

    const changeViewMode = (mode: ViewMode) => {
        setViewMode(mode);
        // Persistence follows the uncontrolled state only; a controlled caller
        // decides for itself whether the choice outlives the session.
        if (!viewMode?.value && viewModeStorageKey && typeof localStorage !== 'undefined') {
            try {
                localStorage.setItem(viewModeStorageKey, mode);
            } catch {
                // Private mode or a full quota — not worth failing a click over.
            }
        }
    };

    // Effective view mode is forced to 'list' on mobile (only if listColumns is defined)
    const effectiveViewMode: ViewMode = isMobile && listColumns ? 'list' : currentViewMode;

    const toggleButtonClass = (mode: ViewMode) => cn(
        "p-1 rounded-sm transition-all",
        // The group is only p-1 tall, so the ring sits inside the button
        // instead of bleeding over the neighbouring toggle.
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary",
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
    };

    return (
        <Card padding="none" className={cn("overflow-hidden flex flex-col h-full", className)} classNames={{ ...classNames?.card, ...classNames?.header, header: cn(classNames?.card?.header, classNames?.header?.header, searchable && 'border-b-0 pb-1') }} title={title} action={headerAction}>
            {searchable && (
                <div className={cn(
                    "px-4 py-2 border-b border-border bg-card-header",
                    classNames?.searchBar
                )}>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-app-bg">
                        <Search size={14} className="text-text-muted shrink-0" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                aria-label="Clear search"
                                onClick={() => setSearchQuery('')}
                                className="text-text-muted hover:text-text-primary shrink-0"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>
            )}
            {effectiveViewMode === 'list' ? (
                <DataList
                    {...containerProps}
                    columns={listColumns}
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
