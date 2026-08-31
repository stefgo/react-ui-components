import { useCallback, useMemo, useState } from 'react';
import { PaginationProps, PaginationState } from '../data/types';

export interface UsePaginationResult {
    value: PaginationState;
    onChange: (next: PaginationState) => void;
    setPage: (page: number) => void;
    /** Also returns to page 1, where the new page size actually starts. */
    setPageSize: (pageSize: number) => void;
    /** Spread into a view's `pagination` prop: `pagination={{ ...page.props }}`. */
    props: Pick<PaginationProps, 'value' | 'onChange'>;
}

/**
 * Page state held outside the view — for URL synchronisation, a reset from a
 * sibling component, or server-side paging.
 *
 * Not needed for the common case: `<DataTable data={rows} pagination />` keeps
 * the state itself. This hook deliberately no longer returns a slice of the
 * data. Handing a view one page and letting it sort is what produced sorts that
 * only covered the current page; the view now does both, in that order.
 */
export function usePagination(initial?: Partial<PaginationState>): UsePaginationResult {
    const [value, setValue] = useState<PaginationState>({ page: 1, pageSize: 10, ...initial });

    const onChange = useCallback((next: PaginationState) => setValue(next), []);
    const setPage = useCallback((page: number) => setValue(prev => ({ ...prev, page })), []);
    const setPageSize = useCallback((pageSize: number) => setValue({ page: 1, pageSize }), []);

    const props = useMemo(() => ({ value, onChange }), [value, onChange]);

    return { value, onChange, setPage, setPageSize, props };
}
