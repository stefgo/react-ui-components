import { Comparator, PaginationState } from './types';

export interface DataPipelineInput<T> {
    data: T[];
    /**
     * 'client' (default): `data` is the complete set and every stage runs here.
     * 'server': `data` is already the current page — filter, sort and slice are
     * skipped, because doing any of them would only reorder one page.
     */
    mode?: 'client' | 'server';
    filter?: (item: T) => boolean;
    compare?: Comparator<T>;
    /** Omitted means: no paging, render everything that survived the filter. */
    state?: PaginationState;
    /** Required in server mode. -1 declares the total as unknown. */
    totalItems?: number;
}

export interface DataPipelineResult<T> {
    /** Exactly the rows to render. */
    rows: T[];
    /** After filtering, before slicing — the number the controls show. */
    totalItems: number;
    /** At least 1, or -1 when the total is unknown. */
    totalPages: number;
    /** The requested page, brought into range. */
    page: number;
    pageSize: number;
    /** A filter was in effect, so an empty result means "no matches". */
    isFiltered: boolean;
    /** The requested page was out of range and had to be corrected. */
    isClamped: boolean;
}

/**
 * Filter, then sort, then slice — in that order, once, for every data view.
 *
 * The order is the whole point. Sorting after slicing reorders the rows that
 * happen to be on screen and leaves the rest of the data alone, and counting
 * before filtering produces page numbers that do not match what is rendered.
 */
export function runDataPipeline<T>(input: DataPipelineInput<T>): DataPipelineResult<T> {
    const { data, mode = 'client', filter, compare, state } = input;
    const pageSize = Math.max(1, Math.floor(state?.pageSize ?? data.length ?? 1));

    if (mode === 'server') {
        const totalItems = input.totalItems ?? data.length;
        const totalPages = totalItems < 0 ? -1 : Math.max(1, Math.ceil(totalItems / pageSize));
        const requested = state?.page ?? 1;
        const page = totalPages < 0 ? Math.max(1, requested) : Math.min(Math.max(1, requested), totalPages);
        return {
            rows: data,
            totalItems,
            totalPages,
            page,
            pageSize,
            isFiltered: false,
            isClamped: page !== requested,
        };
    }

    const filtered = filter ? data.filter(filter) : data;
    const sorted = compare ? [...filtered].sort(compare) : filtered;
    const totalItems = sorted.length;

    if (!state) {
        return {
            rows: sorted,
            totalItems,
            totalPages: 1,
            page: 1,
            pageSize: totalItems,
            isFiltered: filter != null,
            isClamped: false,
        };
    }

    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const page = Math.min(Math.max(1, Math.floor(state.page)), totalPages);
    const start = (page - 1) * pageSize;

    return {
        rows: sorted.slice(start, start + pageSize),
        totalItems,
        totalPages,
        page,
        pageSize,
        isFiltered: filter != null,
        isClamped: page !== state.page,
    };
}
