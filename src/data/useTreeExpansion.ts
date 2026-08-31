import { useCallback, useMemo, useState } from 'react';
import { collectExpandableKeys } from './tree';

export interface UseTreeExpansionOptions<T> {
    /** The whole tree — seeds `defaultExpanded`. */
    data: T[];
    /**
     * The root rows currently on screen. "Expand all" acts on these, so the
     * header chevron describes the page the user is looking at rather than
     * rows on some other page. Defaults to `data`.
     */
    visibleRows?: T[];
    getChildren: (item: T) => T[] | undefined | null;
    getKey: (item: T) => string | number;
    defaultExpanded?: boolean;
}

export interface UseTreeExpansionResult {
    expandedKeys: Set<string | number>;
    /** True when every expandable node is open — drives the header chevron. */
    allExpanded: boolean;
    toggleRow: (key: string | number) => void;
    toggleAll: () => void;
}

export function useTreeExpansion<T>({ data, visibleRows, getChildren, getKey, defaultExpanded }: UseTreeExpansionOptions<T>): UseTreeExpansionResult {
    const [expandedKeys, setExpandedKeys] = useState<Set<string | number>>(
        () => defaultExpanded ? new Set(collectExpandableKeys(data, getChildren, getKey)) : new Set(),
    );

    const expandableKeys = useMemo(
        () => collectExpandableKeys(visibleRows ?? data, getChildren, getKey),
        [visibleRows, data, getChildren, getKey],
    );

    const allExpanded = expandableKeys.length > 0 && expandableKeys.every((k) => expandedKeys.has(k));

    const toggleAll = useCallback(() => {
        setExpandedKeys((prev) => {
            const everyOpen = expandableKeys.length > 0 && expandableKeys.every((k) => prev.has(k));
            return everyOpen ? new Set() : new Set(expandableKeys);
        });
    }, [expandableKeys]);

    const toggleRow = useCallback((key: string | number) => {
        setExpandedKeys((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }, []);

    return { expandedKeys, allExpanded, toggleRow, toggleAll };
}
