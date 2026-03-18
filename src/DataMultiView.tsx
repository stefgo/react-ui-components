import { ReactNode, useState, useEffect } from 'react';
import { LayoutList, Table as TableIcon } from 'lucide-react';
import { Card, CardClassNames } from './Card';
import { DataTable, DataTableDef, DataTableClassNames } from './DataTable';
import { DataList, DataListDef, DataListColumnDef, DataListClassNames } from './DataList';
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
    extraActionsWrapper?: string;
}

export interface DataMultiViewProps<T> {
    title?: ReactNode;
    extraActions?: ReactNode;
    className?: string;
    viewModeStorageKey?: string;
    data: T[];
    tableDef: DataTableDef<T>[];
    listDef?: DataListDef<T>[];
    listColumns?: DataListColumnDef<T>[];
    keyField: keyof T | ((item: T) => string | number);
    isLoading?: boolean;
    emptyMessage?: ReactNode;
    loadingMessage?: ReactNode;
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

export const DataMultiView = <T,>(props: DataMultiViewProps<T>) => {
    const {
        title,
        extraActions,
        className = '',
        viewModeStorageKey = 'dataViewMode',
        tableDef,
        listDef,
        listColumns,
        classNames,
        ...sharedProps
    } = props;

    // Mobile detection
    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [viewMode, setViewMode] = useState<'table' | 'list'>(() => {
        if (typeof localStorage === 'undefined') return 'table';
        const savedMode = localStorage.getItem(viewModeStorageKey) as 'table' | 'list';
        return savedMode || 'table';
    });

    const changeViewMode = (mode: 'table' | 'list') => {
        setViewMode(mode);
        localStorage.setItem(viewModeStorageKey, mode);
    };

    // Effective view mode is forced to 'list' on mobile
    const effectiveViewMode = isMobile ? 'list' : viewMode;

    const viewToggle = !isMobile ? (
        <div className={cn("bg-table-header-toggle-bg dark:bg-table-header-toggle-bg-dark rounded-lg p-1 flex items-center gap-1", classNames?.toggleRoot)}>
            <button
                onClick={() => changeViewMode('table')}
                className={cn(
                    "p-1 rounded transition-all",
                    effectiveViewMode === 'table'
                        ? 'bg-table-header-toggle-active-bg dark:bg-table-header-toggle-active-bg-dark shadow text-text-primary dark:text-text-primary-dark'
                        : 'text-text-muted dark:text-text-muted-dark hover:text-text-primary dark:hover:text-text-primary-dark',
                    classNames?.toggleButton,
                    effectiveViewMode === 'table' ? classNames?.toggleButtonActive : ''
                )}
                title="Table View"
            >
                <TableIcon size={14} />
            </button>
            <button
                onClick={() => changeViewMode('list')}
                className={cn(
                    "p-1 rounded transition-all",
                    effectiveViewMode === 'list'
                        ? 'bg-table-header-toggle-active-bg dark:bg-table-header-toggle-active-bg-dark shadow text-text-primary dark:text-text-primary-dark'
                        : 'text-text-muted dark:text-text-muted-dark hover:text-text-primary dark:hover:text-text-primary-dark',
                    classNames?.toggleButton,
                    effectiveViewMode === 'list' ? classNames?.toggleButtonActive : ''
                )}
                title="List View"
            >
                <LayoutList size={14} />
            </button>
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
                    itemDef={listDef}
                    columns={listColumns}
                    classNames={classNames?.list}
                />
            ) : (
                <DataTable
                    {...containerProps}
                    itemDef={tableDef}
                    classNames={classNames?.table}
                />
            )}
        </Card>
    );
};

