import { Component, ReactNode } from 'react';
import { PaginationControls, PaginationControlsClassNames } from './PaginationControls';
import { cn } from './utils';

export interface DataViewClassNames {
    root?: string;
    contentWrapper?: string;
    paginationWrapper?: string;
    pagination?: PaginationControlsClassNames;
}

export interface BaseDataViewProps<T> {
    data: T[];
    keyField: keyof T | ((item: T) => string | number);
    isLoading?: boolean;
    emptyMessage?: ReactNode;
    loadingMessage?: ReactNode;
    containerClassName?: string;
    rowClassName?: string | ((item: T) => string);
    onRowClick?: (item: T) => void;
    pagination?: {
        currentPage: number;
        totalPages: number;
        itemsPerPage: number;
        totalItems: number;
        onPageChange: (page: number) => void;
        onItemsPerPageChange: (limit: number) => void;
        /**
         * Pass the *full* data set and let the view take the current page itself.
         *
         * Callers that slice before handing over their data get a table that sorts
         * only what is already on screen — DataTable sorts the rows it is given, so
         * on page 2 of 5 a column sort reorders ten rows and leaves the rest alone.
         * With this set the view sorts first and slices second, which is the order
         * the user expects.
         *
         * Off by default so existing callers keep their current behaviour.
         *
         * Honoured by DataTable and DataList. DataTreeTable ignores it: it sorts each
         * level inside flattenTree, so paging it correctly needs that split up first.
         */
        sliceInternally?: boolean;
        /** Set false when an outer component already draws the controls. Default true. */
        renderControls?: boolean;
    };
    classNames?: DataViewClassNames;
}

export abstract class AbstractDataView<T, P extends BaseDataViewProps<T>, S = object> extends Component<P, S> {
    protected getKey(item: T): string | number {
        const { keyField } = this.props;
        if (typeof keyField === 'function') {
            return (keyField as (i: T) => string | number)(item);
        }
        return item[keyField as keyof T] as unknown as string | number;
    }

    protected getRowClass(item: T): string {
        const { rowClassName } = this.props;
        return typeof rowClassName === 'function' ? rowClassName(item) : (rowClassName ?? '');
    }

    protected getInteractionClasses(): string {
        return this.props.onRowClick
            ? 'cursor-pointer hover:bg-table-row-hover dark:hover:bg-table-row-hover-dark'
            : '';
    }

    /**
     * Takes the current page out of `rows`, but only when the caller opted into
     * `pagination.sliceInternally`. Subclasses call this last, after any sorting,
     * so that the sort runs across the whole data set rather than one page of it.
     */
    protected applyPageSlice(rows: T[]): T[] {
        const { pagination } = this.props;
        if (!pagination?.sliceInternally) return rows;

        const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
        return rows.slice(start, start + pagination.itemsPerPage);
    }

    protected renderPagination(): ReactNode {
        const { pagination, classNames } = this.props;
        if (!pagination || pagination.renderControls === false) return null;

        return (
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
        );
    }

    protected getPlaceholder(): ReactNode {
        const { isLoading, loadingMessage = 'Loading...', emptyMessage = 'No items found', data } = this.props;

        if (isLoading) return loadingMessage;
        if (data.length === 0) return emptyMessage;
        return null;
    }

    /**
     * Abstract method to be implemented by sub-classes to render the core content (table or list)
     */
    protected abstract renderContent(): ReactNode;

    render() {
        const { containerClassName = '', classNames } = this.props;
        const containerClass = cn(
            "bg-table-row dark:bg-table-row-dark border border-card dark:border-card-dark overflow-hidden shadow-lg flex flex-col h-full",
            containerClassName,
            classNames?.root
        );

        return (
            <div className={containerClass}>
                <div className={cn("flex-1 overflow-y-auto min-h-0", classNames?.contentWrapper)}>
                    {this.renderContent()}
                </div>
                {this.renderPagination()}
            </div>
        );
    }
}
