import { ReactNode, useState, useEffect } from 'react';
import { LayoutList, Table as TableIcon, Network } from 'lucide-react';
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
}

export interface DataMultiViewProps<T> {
    title?: ReactNode;
    extraActions?: ReactNode;
    className?: string;
    viewModeStorageKey?: string;
    data: T[];
    tableDef?: DataTableDef<T>[];
    listDef?: DataListDef<T>[];
    listColumns?: DataListColumnDef<T>[];
    /** Column definitions for tree table view. Requires `getChildren` to be set. */
    treeTableDef?: DataTableDef<T>[];
    /** Required for tree table view: returns child items for a given item. */
    getChildren?: (item: T) => T[] | undefined | null;
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
        ...sharedProps
    } = props;

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
        containerClassName: "rounded-none border-0 shadow-none flex-1",
    };

    return (
        <Card className={cn("overflow-hidden flex flex-col h-full", className, classNames?.root)} classNames={{ ...classNames?.card, ...classNames?.header }} title={title} action={headerAction}>
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
                    classNames={classNames?.table}
                />
            )}
        </Card>
    );
};
