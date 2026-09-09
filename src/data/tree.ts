import { Comparator } from './types';

export interface TreeWalkOptions<T> {
    getChildren: (item: T) => T[] | undefined | null;
    getKey: (item: T) => string | number;
    expandedKeys: Set<string | number>;
    /** Applied to every child level. The top level arrives already sorted. */
    comparator?: Comparator<T>;
}

/** Keys of every node that has children, at any depth. */
export function collectExpandableKeys<T>(
    items: T[],
    getChildren: (item: T) => T[] | undefined | null,
    getKey: (item: T) => string | number,
): (string | number)[] {
    const keys: (string | number)[] = [];
    for (const item of items) {
        const children = getChildren(item);
        if (children && children.length > 0) {
            keys.push(getKey(item));
            keys.push(...collectExpandableKeys(children, getChildren, getKey));
        }
    }
    return keys;
}

/**
 * Turns a tree into the flat row list the table renders, following the
 * expanded state and sorting each child level on the way down.
 *
 * `items` is taken as given — it is the top level, which the view has already
 * sorted (and, once paging is on, reduced to the current page). Sorting it
 * again here would undo that page.
 */
export function flattenTree<T>(
    items: T[],
    options: TreeWalkOptions<T>,
    depth = 0,
): Array<{ item: T; depth: number }> {
    const { getChildren, getKey, expandedKeys, comparator } = options;
    const result: Array<{ item: T; depth: number }> = [];

    for (const item of items) {
        result.push({ item, depth });
        if (!expandedKeys.has(getKey(item))) continue;

        const children = getChildren(item);
        if (children && children.length > 0) {
            const sorted = comparator ? [...children].sort(comparator) : children;
            result.push(...flattenTree(sorted, options, depth + 1));
        }
    }
    return result;
}
