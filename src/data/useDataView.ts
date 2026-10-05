import { KeyboardEvent, MouseEvent, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { BaseDataViewProps, Comparator, RowKey } from './types';
import { selectAllState, toggleAll, toggleKey } from './selection';
import { useControllableState } from '../hooks/useControllableState';
import { runDataPipeline } from './pipeline';
import { usePaginationState } from './usePaginationState';
import { FOCUS_RING_INSET } from '../focus';
import { cn } from '../utils';

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

/**
 * Anything inside a row that is a control in its own right. A click on one of
 * these is that control's click, not the row's.
 */
const INTERACTIVE_DESCENDANT = 'button, a[href], input, select, textarea, [role="button"], [role="menuitem"]';

/** True when the event started on a control inside the row rather than on the row. */
function startedOnAControl(event: { target: EventTarget | null; currentTarget: EventTarget | null }): boolean {
    const target = event.target;
    if (!(target instanceof Element)) return false;
    const control = target.closest(INTERACTIVE_DESCENDANT);
    return !!control && control !== event.currentTarget;
}

/** What a view needs to draw a row's checkbox. */
export interface RowSelection<T> {
    isSelectable: (item: T) => boolean;
    isSelected: (item: T) => boolean;
    toggle: (item: T) => void;
    label: (item: T) => string;
    /**
     * How much of what "select all" would pick is picked. A view with a header
     * row draws its box from this; the list has no such row and leaves it out.
     */
    allState: 'all' | 'some' | 'none';
    /** Picks everything "select all" stands for, or -- when all of it is picked -- none of it. */
    toggleAll: () => void;
    /** False when there is no row "select all" could pick. */
    hasCandidates: boolean;
}

const NO_SELECTION: ReadonlySet<RowKey> = new Set();

/**
 * What a clickable row spreads onto its element. Empty when `onRowClick` is unset
 * or `isRowClickable` turns the row down.
 */
export interface RowActivationProps {
    tabIndex?: number;
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
}

export interface UseDataViewResult<T> {
    /** Exactly the rows to render — filtered, sorted and reduced to the current page. */
    rows: T[];
    /** Loading, empty or no-results text, or null when there are rows to show. */
    placeholder: ReactNode | null;
    getKey: (item: T) => string | number;
    getRowClass: (item: T) => string;
    /**
     * Spread onto the row element. A row with `onRowClick` is reachable by Tab
     * and fires on Enter or Space, not on click alone.
     */
    rowActivationProps: (item: T) => RowActivationProps;
    /** Pointer, hover and focus ring of a clickable row; empty for any other. */
    interactionClasses: (item: T) => string;
    /** null when the caller did not ask for pagination. */
    pagination: PaginationView | null;
    /** null when the rows cannot be picked. */
    selection: RowSelection<T> | null;
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
    const { data, keyField, rowClassName, onRowClick, isRowClickable, isLoading, filter, filterKey } = props;
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

    const selectionOptions = props.selection;
    const [selected, setSelected] = useControllableState<ReadonlySet<RowKey>>({
        value: selectionOptions?.value,
        defaultValue: selectionOptions?.defaultValue,
        onChange: selectionOptions?.onChange,
        fallback: NO_SELECTION,
    });
    const isSelectable = selectionOptions?.isSelectable;
    const rowLabel = selectionOptions?.rowLabel;
    // What "select all" picks: the rows the filter leaves, not the page of them
    // that is on screen -- an action on "everything that matches" must not stop
    // at the page break. In a tree these are the root rows.
    const hasSelection = selectionOptions != null;
    const selectAllKeys = useMemo(() => {
        if (!hasSelection) return [];
        return (filter ? data.filter(filter) : data)
            .filter((item) => isSelectable?.(item) ?? true)
            .map(getKey);
    }, [hasSelection, data, filter, isSelectable, getKey]);
    const selection = useMemo<RowSelection<T> | null>(() => (hasSelection ? {
        isSelectable: (item) => isSelectable?.(item) ?? true,
        isSelected: (item) => selected.has(getKey(item)),
        toggle: (item) => setSelected((prev) => toggleKey(prev, getKey(item))),
        label: (item) => rowLabel?.(item) ?? 'Select row',
        allState: selectAllState(selectAllKeys, selected),
        toggleAll: () => setSelected((prev) => toggleAll(prev, selectAllKeys)),
        hasCandidates: selectAllKeys.length > 0,
    } : null), [hasSelection, isSelectable, rowLabel, selected, setSelected, getKey, selectAllKeys]);

    const getRowClass = useCallback((item: T): string => (
        typeof rowClassName === 'function' ? rowClassName(item) : (rowClassName ?? '')
    ), [rowClassName]);

    // One answer for the handlers and the classes: a row that shows a pointer
    // and does nothing, or takes the focus and ignores Enter, is the bug.
    const isClickable = useCallback((item: T): boolean => (
        !!onRowClick && (isRowClickable?.(item) ?? true)
    ), [onRowClick, isRowClickable]);

    const rowActivationProps = useCallback((item: T): RowActivationProps => {
        if (!onRowClick || !isClickable(item)) return {};
        return {
            tabIndex: 0,
            // A row action, a link, a checkbox in a cell: their click bubbles
            // to the row, and without this the row fires alongside them.
            onClick: (event) => {
                if (startedOnAControl(event)) return;
                onRowClick(item);
            },
            onKeyDown: (event) => {
                // Only the row's own keystrokes. A button inside a cell — the
                // tree chevron, a row action — handles its own Enter, and
                // without this guard it would trigger the row as well.
                if (event.target !== event.currentTarget) return;
                if (event.key !== 'Enter' && event.key !== ' ') return;
                // Space on a focused element scrolls the page otherwise.
                event.preventDefault();
                onRowClick(item);
            },
        };
    }, [onRowClick, isClickable]);

    // No `role="button"`: it would replace the row semantics that let a screen
    // reader announce the column a cell belongs to. Focusable and operable is
    // what the row is missing, not a different role.
    const interactionClasses = useCallback((item: T): string => (
        isClickable(item) ? cn('cursor-pointer hover:bg-table-row-hover', FOCUS_RING_INSET) : ''
    ), [isClickable]);

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

    return { rows: result.rows, placeholder, getKey, getRowClass, rowActivationProps, interactionClasses, pagination: paginationView, selection };
}
