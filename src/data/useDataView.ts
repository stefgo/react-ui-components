import { ReactNode, useCallback, useMemo } from 'react';
import { BaseDataViewProps, Comparator } from './types';

export interface UseDataViewResult<T> {
    /** Exactly the rows to render — already sorted and reduced to the current page. */
    rows: T[];
    /** Loading or empty text, or null when there are rows to show. */
    placeholder: ReactNode | null;
    getKey: (item: T) => string | number;
    getRowClass: (item: T) => string;
    interactionClasses: string;
}

/**
 * Turns the props of a data view into the rows it should render.
 *
 * Every view goes through here so that the order — sort first, take the page
 * second — exists in one place instead of once per view.
 */
export function useDataView<T>(
    props: BaseDataViewProps<T>,
    comparator?: Comparator<T>,
): UseDataViewResult<T> {
    const { data, keyField, rowClassName, onRowClick, isLoading, pagination } = props;
    const { loadingMessage = 'Loading...', emptyMessage = 'No items found' } = props;

    const getKey = useCallback((item: T): string | number => {
        if (typeof keyField === 'function') return keyField(item);
        return item[keyField] as unknown as string | number;
    }, [keyField]);

    const getRowClass = useCallback((item: T): string => (
        typeof rowClassName === 'function' ? rowClassName(item) : (rowClassName ?? '')
    ), [rowClassName]);

    const interactionClasses = onRowClick
        ? 'cursor-pointer hover:bg-table-row-hover dark:hover:bg-table-row-hover-dark'
        : '';

    const rows = useMemo(() => {
        const sorted = comparator ? [...data].sort(comparator) : data;
        if (!pagination?.sliceInternally) return sorted;
        const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
        return sorted.slice(start, start + pagination.itemsPerPage);
    }, [data, comparator, pagination]);

    const placeholder = isLoading ? loadingMessage : data.length === 0 ? emptyMessage : null;

    return { rows, placeholder, getKey, getRowClass, interactionClasses };
}
