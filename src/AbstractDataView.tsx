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
    };
    classNames?: DataViewClassNames;
}

export abstract class AbstractDataView<T, P extends BaseDataViewProps<T>, S = {}> extends Component<P, S> {
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

    protected renderPagination(): ReactNode {
        const { pagination, classNames } = this.props;
        if (!pagination) return null;

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
