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
        "bg-table-row border border-card overflow-hidden shadow-lg flex flex-col h-full",
        containerClassName,
        classNames?.root,
    )}>
        <div className={cn("flex-1 overflow-y-auto min-h-0", classNames?.contentWrapper)}>
            {children}
        </div>
        {pagination && (
            <div className={cn("shrink-0 border-t border-card bg-card", classNames?.paginationWrapper)}>
                <PaginationControls
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    pageSize={pagination.pageSize}
                    totalItems={pagination.totalItems}
                    onPageChange={pagination.onPageChange}
                    onPageSizeChange={pagination.onPageSizeChange}
                    pageSizeOptions={pagination.pageSizeOptions}
                    hideOnSinglePage={pagination.hideOnSinglePage}
                    classNames={classNames?.pagination}
                />
            </div>
        )}
    </div>
);
