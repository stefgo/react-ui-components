import { useMemo, useState } from 'react';
import { useControllableState } from '../hooks/useControllableState';
import type { Controllable } from '../types';
import { collectExpandableKeys } from './tree';

export type TreeKey = string | number;

export interface TreeExpansionOptions extends Controllable<Set<TreeKey>> {
    /**
     * Open every expandable node, including ones that arrive later. A seeding
     * policy, not a starting value — use `defaultValue` for that.
     */
    all?: boolean;
}

export interface UseTreeExpansionOptions<T> {
    /** The whole tree — seeds `expanded.all`. */
    data: T[];
    /**
     * The root rows currently on screen. "Expand all" acts on these, so the
     * header chevron describes the page the user is looking at rather than
     * rows on some other page. Defaults to `data`.
     */
    visibleRows?: T[];
    getChildren: (item: T) => T[] | undefined | null;
    getKey: (item: T) => TreeKey;
    expanded?: TreeExpansionOptions;
}

export interface UseTreeExpansionResult {
    expandedKeys: Set<TreeKey>;
    /** True when every expandable node on this page is open — drives the header chevron. */
    allExpanded: boolean;
    toggleRow: (key: TreeKey) => void;
    toggleAll: () => void;
}

export function useTreeExpansion<T>({ data, visibleRows, getChildren, getKey, expanded }: UseTreeExpansionOptions<T>): UseTreeExpansionResult {
    const all = expanded?.all ?? false;
    const initialKeys = () => collectExpandableKeys(data, getChildren, getKey);

    const [expandedKeys, setExpandedKeys, , correctExpandedKeys] = useControllableState<Set<TreeKey>>({
        value: expanded?.value,
        defaultValue: expanded?.defaultValue,
        onChange: expanded?.onChange,
        fallback: () => all ? new Set(initialKeys()) : new Set(),
    });

    // Which nodes this hook has already made a decision about. Without it,
    // `all` could only act at mount — data arriving later (a websocket update,
    // a finished request) would stay collapsed.
    const [knownKeys, setKnownKeys] = useState<Set<TreeKey>>(() => new Set(initialKeys()));
    const [seenData, setSeenData] = useState(data);

    if (data !== seenData) {
        setSeenData(data);
        const current = collectExpandableKeys(data, getChildren, getKey);
        const fresh = current.filter((key) => !knownKeys.has(key));
        setKnownKeys(new Set(current));
        // Only genuinely new nodes are opened. Re-expanding everything would
        // undo what the user just collapsed on the next data update. This runs
        // during render, so it corrects the state instead of reporting it.
        if (all && fresh.length > 0) {
            correctExpandedKeys((prev) => new Set([...prev, ...fresh]));
        }
    }

    const expandableKeys = useMemo(
        () => collectExpandableKeys(visibleRows ?? data, getChildren, getKey),
        [visibleRows, data, getChildren, getKey],
    );

    const allExpanded = expandableKeys.length > 0 && expandableKeys.every((k) => expandedKeys.has(k));

    const toggleAll = () => {
        setExpandedKeys((prev) => {
            const everyOpen = expandableKeys.length > 0 && expandableKeys.every((k) => prev.has(k));
            if (everyOpen) {
                const next = new Set(prev);
                for (const key of expandableKeys) next.delete(key);
                return next;
            }
            return new Set([...prev, ...expandableKeys]);
        });
    };

    const toggleRow = (key: TreeKey) => {
        setExpandedKeys((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    return { expandedKeys, allExpanded, toggleRow, toggleAll };
}
