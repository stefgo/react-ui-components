import { ReactNode } from 'react';
import { PaginationControlsClassNames } from '../PaginationControls';

export interface DataViewClassNames {
    root?: string;
    contentWrapper?: string;
    paginationWrapper?: string;
    pagination?: PaginationControlsClassNames;
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

export interface PaginationProps {
    /**
     * 'client' (default): `data` is the complete set; the view filters, sorts
     * and takes the current page itself.
     *
     * 'server': `data` is already the current page. The view then sorts nothing
     * locally — that would only reorder the page — and `totalItems` is required
     * because the view cannot count what it never received.
     */
    mode?: 'client' | 'server';

    /** Set together with `onChange` to hold the page state outside (URL sync, server paging). */
    value?: PaginationState;
    onChange?: (next: PaginationState) => void;

    /** Starting values while the view holds the state itself. Default `{ page: 1, pageSize: 10 }`. */
    defaultValue?: Partial<PaginationState>;

    /** Choices in the "Rows per page" dropdown. Default `[10, 20, 50]`. */
    pageSizeOptions?: number[];

    /** Required with `mode: 'server'`. Pass -1 when the total is unknown. Ignored otherwise. */
    totalItems?: number;

    /** Hide the bar while everything fits on one page. Default false. */
    hideOnSinglePage?: boolean;

    /**
     * Jump back to page 1 when `data` or `filterKey` changes. Default true.
     * Only applies while the view holds the state; a controlled caller decides
     * for itself.
     */
    autoResetPage?: boolean;
}

export interface BaseDataViewProps<T> {
    /**
     * The complete data set. Do not pre-slice it: the view sorts before it takes
     * a page, and a caller that hands over one page already gets a sort across
     * that page only. The single exception is `pagination.mode: 'server'`.
     */
    data: T[];
    keyField: keyof T | ((item: T) => string | number);
    isLoading?: boolean;
    emptyMessage?: ReactNode;
    /** Shown when a filter removed everything. Falls back to `emptyMessage`. */
    noResultsMessage?: ReactNode;
    loadingMessage?: ReactNode;
    containerClassName?: string;
    rowClassName?: string | ((item: T) => string);
    onRowClick?: (item: T) => void;

    /**
     * `true` turns on paging with the defaults; an object configures it.
     *
     * DataTreeTable pages its root nodes: `totalItems` counts roots, and the
     * children of the roots on a page are shown with them.
     */
    pagination?: boolean | PaginationProps;

    /** Runs before sorting and paging, so the page count matches what is shown. */
    filter?: (item: T) => boolean;
    /**
     * Identifies the current filter (typically the search query). Drives the
     * reset to page 1 — the filter function itself cannot, because an inline
     * arrow is a new value on every render.
     */
    filterKey?: string | number;

    classNames?: DataViewClassNames;
}
