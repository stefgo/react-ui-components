import { ReactNode, useCallback, useEffect, useMemo } from 'react';
import { BaseDataViewProps, Comparator } from './types';
import { runDataPipeline } from './pipeline';
import { usePaginationState } from './usePaginationState';

/** Everything the pagination bar needs, already resolved. */
export interface PaginationView {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    pageSizeOptions?: number[];
    hideOnSinglePage: boolean;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export interface UseDataViewResult<T> {
    /** Exactly the rows to render — filtered, sorted and reduced to the current page. */
    rows: T[];
    /** Loading, empty or no-results text, or null when there are rows to show. */
    placeholder: ReactNode | null;
    getKey: (item: T) => string | number;
    getRowClass: (item: T) => string;
    interactionClasses: string;
    /** null when the caller did not ask for pagination. */
    pagination: PaginationView | null;
}

/**
 * Turns the props of a data view into the rows it should render.
 *
 * Every view goes through here, so the order — filter, sort, then take the page
 * — exists once rather than once per view.
 */
export function useDataView<T>(
    props: BaseDataViewProps<T>,
    comparator?: Comparator<T>,
): UseDataViewResult<T> {
    const { data, keyField, rowClassName, onRowClick, isLoading, filter, filterKey } = props;
    const { loadingMessage = 'Loading...', emptyMessage = 'No items found' } = props;
    const noResultsMessage = props.noResultsMessage ?? emptyMessage;

    const pagination = usePaginationState(props.pagination, [data, filterKey]);
    const mode = pagination?.mode ?? 'client';
    const page = pagination?.state.page;
    const pageSize = pagination?.state.pageSize;
    const declaredTotal = pagination?.totalItems;

    const result = useMemo(() => runDataPipeline({
        data,
        mode,
        filter,
        compare: comparator,
        state: page != null && pageSize != null ? { page, pageSize } : undefined,
        totalItems: declaredTotal,
    }), [data, mode, filter, comparator, page, pageSize, declaredTotal]);

    // A controlled caller keeps its own copy of the page number. When the page
    // turned out to be past the end, tell them once, or their copy stays wrong.
    const setState = pagination?.setState;
    const notifyClamp = pagination?.isControlled && result.isClamped;
    useEffect(() => {
        if (notifyClamp && setState) setState({ page: result.page, pageSize: result.pageSize });
    }, [notifyClamp, setState, result.page, result.pageSize]);

    const getKey = useCallback((item: T): string | number => {
        if (typeof keyField === 'function') return keyField(item);
        return item[keyField] as unknown as string | number;
    }, [keyField]);

    const getRowClass = useCallback((item: T): string => (
        typeof rowClassName === 'function' ? rowClassName(item) : (rowClassName ?? '')
    ), [rowClassName]);

    const interactionClasses = onRowClick
        ? 'cursor-pointer hover:bg-table-row-hover'
        : '';

    const placeholder = isLoading ? loadingMessage
        : result.rows.length > 0 ? null
        : result.isFiltered && data.length > 0 ? noResultsMessage
        : emptyMessage;

    const paginationView: PaginationView | null = pagination ? {
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        pageSizeOptions: pagination.pageSizeOptions,
        hideOnSinglePage: pagination.hideOnSinglePage,
        onPageChange: (next) => pagination.setState({ page: next, pageSize: result.pageSize }),
        // A different page size makes the current page number meaningless, so
        // start over at the top rather than land somewhere arbitrary.
        onPageSizeChange: (size) => pagination.setState({ page: 1, pageSize: size }),
    } : null;

    return { rows: result.rows, placeholder, getKey, getRowClass, interactionClasses, pagination: paginationView };
}
