import { ReactNode } from 'react';
import { PaginationControls } from '../PaginationControls';
import { BaseDataViewProps, DataViewClassNames } from './types';
import { cn } from '../utils';

interface DataViewFrameProps<T> {
    containerClassName?: string;
    classNames?: DataViewClassNames;
    pagination?: BaseDataViewProps<T>['pagination'];
    children: ReactNode;
}

/**
 * The shell every data view sits in: bordered card, scrollable content area and
 * the pagination bar pinned underneath it.
 */
export const DataViewFrame = <T,>({ containerClassName = '', classNames, pagination, children }: DataViewFrameProps<T>) => (
    <div className={cn(
        "bg-table-row dark:bg-table-row-dark border border-card dark:border-card-dark overflow-hidden shadow-lg flex flex-col h-full",
        containerClassName,
        classNames?.root,
    )}>
        <div className={cn("flex-1 overflow-y-auto min-h-0", classNames?.contentWrapper)}>
            {children}
        </div>
        {pagination && pagination.renderControls !== false && (
            <div className={cn("shrink-0 border-t border-card dark:border-card-dark bg-card dark:bg-card-dark", classNames?.paginationWrapper)}>
                <PaginationControls
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    itemsPerPage={pagination.itemsPerPage}
                    totalItems={pagination.totalItems}
                    onPageChange={pagination.onPageChange}
                    onItemsPerPageChange={pagination.onItemsPerPageChange}
                    classNames={classNames?.pagination}
                />
            </div>
        )}
    </div>
);
