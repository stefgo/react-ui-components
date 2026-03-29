import { ReactNode, useState, useEffect } from 'react';
import { LayoutList, Table as TableIcon, Network, Search } from 'lucide-react';
import { Card, CardClassNames } from './Card';
import { DataTable, DataTableDef, DataTableClassNames } from './DataTable';
import { DataList, DataListDef, DataListColumnDef, DataListClassNames } from './DataList';
import { DataTreeTable, DataTreeTableClassNames } from './DataTreeTable';
import { cn } from './utils';

export interface DataMultiViewClassNames {
    root?: string;
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
    viewModeStorageKey?: string;
    data: T[];
    getChildren?: (item: T) => T[] | undefined | null;
    tableDef?: DataTableDef<T>[];
    listDef?: DataListDef<T>[];
    listColumns?: DataListColumnDef<T>[];
    /** Column definitions for tree table view. Requires `getChildren` to be set. */
    treeTableDef?: DataTableDef<T>[];
    /** Required for tree table view: returns child items for a given item. */
    treeTableDefaultExpanded?: boolean;
    treeTableIndentSize?: number;
    keyField: keyof T | ((item: T) => string | number);
    isLoading?: boolean;
    emptyMessage?: ReactNode;
    loadingMessage?: ReactNode;
    defaultSort?: { colIndex: number; direction: 'asc' | 'desc' };
    rowClassName?: string | ((item: T) => string);
    onRowClick?: (item: T) => void;
    pagination?: {
        currentPage: number;
        totalPages: number;
        itemsPerPage: number;
        totalItems: number;
        onPageChange: (page: number) => void;
        onItemsPerPageChange: (limit: number) => void;
    };
    classNames?: DataMultiViewClassNames;
    /** Show search input between header and content */
    searchable?: boolean;
    /** Placeholder text for the search input */
    searchPlaceholder?: string;
    /** Filter function for internal filtering. Receives each item and the current query string. */
    searchFilter?: (item: T, query: string) => boolean;
    /** Called whenever the search query changes (for external/controlled filtering) */
    onSearchChange?: (query: string) => void;
}

type ViewMode = 'table' | 'list' | 'tree';

export const DataMultiView = <T,>(props: DataMultiViewProps<T>) => {
    const {
        title,
        extraActions,
        className = '',
        viewModeStorageKey = 'dataViewMode',
        tableDef,
        listColumns,
        getChildren,
        treeTableDefaultExpanded,
        treeTableIndentSize,
        classNames,
        defaultSort,
        searchable,
        searchPlaceholder = 'Suchen…',
        searchFilter,
        onSearchChange,
        ...sharedProps
    } = props;

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        onSearchChange?.(query);
    };

    const filteredData = searchable && searchFilter && searchQuery
        ? sharedProps.data.filter(item => searchFilter(item, searchQuery))
        : sharedProps.data;

    const hasTreeView = !!(tableDef && getChildren);
    
    // Mobile detection
    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const firstMode: ViewMode = hasTreeView ? 'tree' : tableDef ? 'table' : 'list';

    const [viewMode, setViewMode] = useState<ViewMode>(() => {
        if (typeof localStorage === 'undefined') return firstMode;
        const savedMode = localStorage.getItem(viewModeStorageKey) as ViewMode;
        if (savedMode === 'tree' && !hasTreeView) return firstMode;
        return savedMode || firstMode;
    });

    const changeViewMode = (mode: ViewMode) => {
        setViewMode(mode);
        localStorage.setItem(viewModeStorageKey, mode);
    };

    // Effective view mode is forced to 'list' on mobile
    const effectiveViewMode: ViewMode = isMobile ? 'list' : viewMode;

    const toggleButtonClass = (mode: ViewMode) => cn(
        "p-1 rounded transition-all",
        effectiveViewMode === mode
            ? 'bg-table-header-toggle-active-bg dark:bg-table-header-toggle-active-bg-dark shadow text-text-primary dark:text-text-primary-dark'
            : 'text-text-muted dark:text-text-muted-dark hover:text-text-primary dark:hover:text-text-primary-dark',
        classNames?.toggleButton,
        effectiveViewMode === mode ? classNames?.toggleButtonActive : ''
    );

    const visibleButtonCount = [hasTreeView, !!(tableDef && !hasTreeView), !!listColumns].filter(Boolean).length;

    const viewToggle = !isMobile && visibleButtonCount > 1 ? (
        <div className={cn("bg-table-header-toggle-bg dark:bg-table-header-toggle-bg-dark rounded-lg p-1 flex items-center gap-1", classNames?.toggleRoot)}>
            {hasTreeView && (
                <button onClick={() => changeViewMode('tree')} className={toggleButtonClass('tree')} title="Tree View">
                    <Network size={14} />
                </button>
            )}
            {tableDef && !hasTreeView && (
                <button onClick={() => changeViewMode('table')} className={toggleButtonClass('table')} title="Table View">
                    <TableIcon size={14} />
                </button>
            )}
            {listColumns && (
                <button onClick={() => changeViewMode('list')} className={toggleButtonClass('list')} title="List View">
                    <LayoutList size={14} />
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
        data: filteredData,
        containerClassName: "rounded-none border-0 shadow-none flex-1",
    };

    return (
        <Card className={cn("overflow-hidden flex flex-col h-full", className, classNames?.root)} classNames={{ ...classNames?.card, ...classNames?.header }} title={title} action={headerAction}>
            {searchable && (
                <div className={cn(
                    "px-4 py-2 border-b border-border dark:border-border-dark bg-card dark:bg-card-dark flex items-center gap-2",
                    classNames?.searchBar
                )}>
                    <Search size={14} className="text-text-muted dark:text-text-muted-dark shrink-0" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => handleSearchChange(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full bg-transparent text-sm text-text-primary dark:text-text-primary-dark placeholder:text-text-muted dark:placeholder:text-text-muted-dark outline-none"
                    />
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
                    defaultExpanded={treeTableDefaultExpanded}
                    indentSize={treeTableIndentSize}
                    classNames={classNames?.treeTable}
                />
            ) : (
                <DataTable
                    {...containerProps}
                    itemDef={tableDef!}
                    defaultSort={defaultSort}
                    sortStorageKey={`${viewModeStorageKey}_sort`}
                    classNames={classNames?.table}
                />
            )}
        </Card>
    );
};
