import type { ReactNode } from 'react';
import type { DataColumnDef, DataListGroupDef } from './columns';
import type { PaginationProps } from './types';

/*
 * The layout every list of an app shares, so that a `DataMultiView` is given
 * the same two blocks, the same actions column and the same paging wherever it
 * stands. Two apps kept a copy of this file each; the copies differed by the
 * tree helpers one of them had not needed yet.
 */

/** The id of the block the actions sit in, for a list that builds its actions column itself. */
export const ACTIONS_GROUP = 'actions';

/**
 * The two blocks a row of the list view has: what the row says, and its
 * actions at the right edge. A column lands in the first unless it names the
 * other.
 */
export const listGroups = (contentClassName = 'flex-1'): DataListGroupDef[] => [
    { id: 'content', className: contentClassName },
    { id: ACTIONS_GROUP, className: 'md:text-right' },
];

export interface ActionsColumnOptions {
    /** The table heading. Default "Actions". */
    header?: ReactNode;
    /** The box around the actions in the list view. Default: centred below the fields on a narrow screen. */
    listClassName?: string;
}

/**
 * The actions of a row, as the last column of the table and the second block
 * of the list. `render` is the one set of buttons for both views; the list
 * only places it.
 */
export function actionsColumn<T>(
    render: (item: T) => ReactNode,
    { header = 'Actions', listClassName = 'mt-2 md:mt-0 flex justify-center' }: ActionsColumnOptions = {},
): DataColumnDef<T> {
    return {
        header,
        table: { headerClassName: 'text-center', cellClassName: 'content-center' },
        list: { label: null, group: ACTIONS_GROUP },
        render: (item, view) =>
            view === 'list' ? <div className={listClassName}>{render(item)}</div> : render(item),
    };
}

/**
 * The blocks of a tree's row in the list view -- what a narrow screen shows in
 * place of the tree table. The row stays one line high where it can: what it
 * says on the left, cut off rather than wrapped, and its actions on the right,
 * where a thumb reaches them without scrolling sideways.
 */
export const treeListGroups = (): DataListGroupDef[] => [
    { id: 'content', className: 'flex-1 min-w-0' },
    { id: ACTIONS_GROUP, className: 'shrink-0' },
];

/** Keeps the two blocks side by side on a narrow screen too, where a list stacks them. */
export const TREE_LIST = { colWrapper: 'flex-row items-center gap-2' };

/**
 * For a tree that offers no other view: it is the tree table wherever that
 * fits, and the view switches to the list by itself where it does not. Spread
 * it onto the view; it sets `viewMode` and `classNames`.
 */
export const TREE_ONLY = {
    viewMode: { value: 'tree' as const },
    classNames: { toggleRoot: 'hidden', list: TREE_LIST },
};

/** The actions of a tree's row: as they are in the table, at the right edge in the list. */
export const treeActionsColumn = <T,>(
    render: (item: T) => ReactNode,
    options: Pick<ActionsColumnOptions, 'header'> = {},
): DataColumnDef<T> => actionsColumn(render, { ...options, listClassName: 'flex justify-end' });

/**
 * How many rows a list shows per page. A list that is a page of its own has
 * the room for 20; a list that shares its page with a header and other tabs
 * shows 10, so the page does not turn into a scroll past the header.
 */
export const PAGE_SIZE = {
    page: 20,
    embedded: 10,
} as const;

/**
 * The pagination every list uses; only the size differs. The view owns the
 * page state and does the slicing: it sorts across the whole set first, so a
 * column sort is never limited to the rows that happen to be on screen.
 */
export const listPagination = (pageSize: number): PaginationProps => ({
    defaultValue: { pageSize },
    hideOnSinglePage: true,
});
