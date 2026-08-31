import { ReactNode } from 'react';
import { PaginationControlsClassNames } from '../PaginationControls';

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

export type Comparator<T> = (a: T, b: T) => number;

export interface SortEntry {
    colIndex: number;
    direction: 'asc' | 'desc';
}

/** One-based, matching what the pagination bar shows. */
export interface PaginationState {
    page: number;
    pageSize: number;
}
