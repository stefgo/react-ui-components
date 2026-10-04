import type { RowKey } from './types';

/** The selection with `key` added, or taken out when it was in. */
export function toggleKey(selected: ReadonlySet<RowKey>, key: RowKey): Set<RowKey> {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
}

/**
 * How much of what "select all" would pick is picked already. `some` is what
 * the box shows as its third state; with nothing to pick there is nothing to
 * be all of, so that is `none`.
 */
export function selectAllState(
    candidates: readonly RowKey[],
    selected: ReadonlySet<RowKey>,
): 'all' | 'some' | 'none' {
    const picked = candidates.filter((key) => selected.has(key)).length;
    if (picked === 0) return 'none';
    return picked === candidates.length ? 'all' : 'some';
}

/**
 * What a click on "select all" leaves: every candidate picked, or -- when all
 * of them were -- none of them. Keys outside the candidates stay as they are:
 * a row a filter has hidden is not unselected by a click that cannot see it,
 * and neither is a child row of a tree.
 */
export function toggleAll(selected: ReadonlySet<RowKey>, candidates: readonly RowKey[]): Set<RowKey> {
    const next = new Set(selected);
    if (selectAllState(candidates, selected) === 'all') {
        for (const key of candidates) next.delete(key);
    } else {
        for (const key of candidates) next.add(key);
    }
    return next;
}
