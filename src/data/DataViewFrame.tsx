import { ReactNode } from 'react';
import { PaginationControls } from '../PaginationControls';
import { DataViewClassNames } from './types';
import { PaginationView } from './useDataView';
import { cn } from '../utils';

interface DataViewFrameProps {
    containerClassName?: string;
    classNames?: DataViewClassNames;
    pagination: PaginationView | null;
    children: ReactNode;
}

/**
 * The shell every data view sits in: bordered card, scrollable content area and
 * the pagination bar pinned underneath it.
 */
export const DataViewFrame = ({ containerClassName = '', classNames, pagination, children }: DataViewFrameProps) => (
    <div className={cn(
        "bg-table-row dark:bg-table-row-dark border border-card dark:border-card-dark overflow-hidden shadow-lg flex flex-col h-full",
        containerClassName,
        classNames?.root,
    )}>
        <div className={cn("flex-1 overflow-y-auto min-h-0", classNames?.contentWrapper)}>
            {children}
        </div>
        {pagination && (
            <div className={cn("shrink-0 border-t border-card dark:border-card-dark bg-card dark:bg-card-dark", classNames?.paginationWrapper)}>
                <PaginationControls
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    itemsPerPage={pagination.pageSize}
                    totalItems={pagination.totalItems}
                    onPageChange={pagination.onPageChange}
                    onItemsPerPageChange={pagination.onPageSizeChange}
                    classNames={classNames?.pagination}
                />
            </div>
        )}
    </div>
);
