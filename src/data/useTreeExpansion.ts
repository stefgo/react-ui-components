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
    /** True when every expandable node on this page is open — drives the header chevron. */
    allExpanded: boolean;
    toggleRow: (key: string | number) => void;
    toggleAll: () => void;
}

export function useTreeExpansion<T>({ data, visibleRows, getChildren, getKey, defaultExpanded }: UseTreeExpansionOptions<T>): UseTreeExpansionResult {
    const initialKeys = () => collectExpandableKeys(data, getChildren, getKey);

    const [expandedKeys, setExpandedKeys] = useState<Set<string | number>>(
        () => defaultExpanded ? new Set(initialKeys()) : new Set(),
    );

    // Which nodes this hook has already made a decision about. Without it,
    // defaultExpanded could only act at mount — data arriving later (a websocket
    // update, a finished request) would stay collapsed.
    const [knownKeys, setKnownKeys] = useState<Set<string | number>>(() => new Set(initialKeys()));
    const [seenData, setSeenData] = useState(data);

    if (data !== seenData) {
        setSeenData(data);
        const current = collectExpandableKeys(data, getChildren, getKey);
        const fresh = current.filter((key) => !knownKeys.has(key));
        setKnownKeys(new Set(current));
        // Only genuinely new nodes are opened. Re-expanding everything would
        // undo what the user just collapsed on the next data update.
        if (defaultExpanded && fresh.length > 0) {
            setExpandedKeys((prev) => new Set([...prev, ...fresh]));
        }
    }

    const expandableKeys = useMemo(
        () => collectExpandableKeys(visibleRows ?? data, getChildren, getKey),
        [visibleRows, data, getChildren, getKey],
    );

    const allExpanded = expandableKeys.length > 0 && expandableKeys.every((k) => expandedKeys.has(k));

    const toggleAll = useCallback(() => {
        setExpandedKeys((prev) => {
            const everyOpen = expandableKeys.length > 0 && expandableKeys.every((k) => prev.has(k));
            if (everyOpen) {
                const next = new Set(prev);
                for (const key of expandableKeys) next.delete(key);
                return next;
            }
            return new Set([...prev, ...expandableKeys]);
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
