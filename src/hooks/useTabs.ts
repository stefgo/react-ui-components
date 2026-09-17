import { useCallback, useId, useRef, type KeyboardEvent } from 'react';
import { usePersistentState } from './usePersistentState';
import type { Persistable } from '../types';

export interface UseTabsOptions extends Persistable<string> {
    /**
     * Every tab, in the order the arrow keys walk them.
     *
     * Explicit rather than collected from render order: the order a screen
     * reader announces and the order Arrow-Right follows are part of the
     * design, and they should not change because a panel moved in the JSX.
     */
    tabs: readonly string[];
    /**
     * `'automatic'` (default): an arrow key both moves focus and selects, so
     * the panel follows the focus. `'manual'`: arrows only move focus and
     * Enter or Space selects.
     *
     * Automatic is right when switching is cheap, which is the usual case.
     * Manual is for panels that fetch on open, where arrowing past three tabs
     * would fire three requests nobody asked for.
     */
    activation?: 'automatic' | 'manual';
    /** Which arrow keys walk the tabs. Default `'horizontal'`. */
    orientation?: 'horizontal' | 'vertical';
}

/** What `listProps` puts on the element wrapping the tabs. */
export interface TabListAttributes {
    role: 'tablist';
    'aria-orientation': 'horizontal' | 'vertical';
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

/** What `tabProps` puts on one tab, whatever it is drawn as. */
export interface TabAttributes {
    id: string;
    role: 'tab';
    'aria-selected': boolean;
    'aria-controls': string;
    /**
     * The roving tabindex: exactly one tab is in the tab order, and the arrow
     * keys move within the group. Without it, tabbing through a page would
     * stop at every tab of every tablist on the way.
     */
    tabIndex: 0 | -1;
    onClick: () => void;
    ref: (element: HTMLElement | null) => void;
    /** Drawn as selected. The same fact as `aria-selected`, for whatever renders it. */
    selected: boolean;
}

/** What `panelProps` puts on one panel. */
export interface TabPanelAttributes {
    id: string;
    role: 'tabpanel';
    'aria-labelledby': string;
    /**
     * A panel is focusable so that the keyboard can reach its content right
     * after the tab that opened it, which is the whole point of the pattern:
     * Tab out of the tablist and you are in what you just chose.
     */
    tabIndex: 0;
    hidden: boolean;
}

export interface UseTabsResult {
    /** The selected tab, always one of `tabs`. */
    value: string;
    select: (tab: string) => void;
    isActive: (tab: string) => boolean;
    listProps: TabListAttributes;
    tabProps: (tab: string) => TabAttributes;
    panelProps: (tab: string) => TabPanelAttributes;
}

/**
 * The behaviour of a set of tabs: which one is current, the ARIA wiring that
 * ties each tab to its panel, and the keyboard.
 *
 * A hook rather than a component, because a tab is not one shape. In this
 * library alone it is drawn as a `StatCard`; elsewhere it is a pill, an
 * underlined label or an icon. What does not vary is the part that is easy to
 * get wrong and invisible when it is wrong -- `role`, `aria-controls`, the
 * roving tabindex and the arrow keys. That part lives here, and the look stays
 * entirely with the caller.
 *
 * Which tab is open is one controllable state, so a caller can keep it in the
 * URL -- where a tab usually belongs, since it is the one piece of view state a
 * shared link should carry.
 */
export function useTabs({
    tabs,
    value,
    defaultValue,
    onChange,
    persist,
    activation = 'automatic',
    orientation = 'horizontal',
}: UseTabsOptions): UseTabsResult {
    const prefix = useId();
    const elements = useRef(new Map<string, HTMLElement>());

    const [stored, setStored] = usePersistentState<string>({
        value,
        defaultValue,
        onChange,
        persist,
        fallback: () => tabs[0] ?? '',
        revive: (raw) => (typeof raw === 'string' && tabs.includes(raw) ? raw : undefined),
    });

    // Clamped for rendering only, never written back: a controlled caller owns
    // the value, and a tab list that shrinks -- one tab behind a permission,
    // say -- must not turn that into a state write from inside the render.
    const current = tabs.includes(stored) ? stored : tabs[0] ?? '';

    const tabId = (tab: string) => `${prefix}-tab-${tab}`;
    const panelId = (tab: string) => `${prefix}-panel-${tab}`;

    const focus = useCallback((tab: string) => {
        elements.current.get(tab)?.focus();
    }, []);

    const onKeyDown = useCallback((event: KeyboardEvent<HTMLElement>) => {
        const [back, forward] = orientation === 'vertical'
            ? ['ArrowUp', 'ArrowDown']
            : ['ArrowLeft', 'ArrowRight'];

        // Where the focus is, not where the selection is: with manual
        // activation those differ, and the arrow keys follow the focus.
        const active = document.activeElement;
        const focused = tabs.findIndex((tab) => {
            const element = elements.current.get(tab);
            return !!element && (element === active || element.contains(active));
        });
        const from = focused === -1 ? tabs.indexOf(current) : focused;

        let next: number;
        if (event.key === forward) next = (from + 1) % tabs.length;
        else if (event.key === back) next = (from - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;

        // Only now: the arrow keys of an orientation this list does not use
        // still belong to the page, and Home and End to the document unless a
        // tab is what is focused.
        if (from === -1) return;
        event.preventDefault();

        const target = tabs[next];
        focus(target);
        if (activation === 'automatic') setStored(target);
    }, [orientation, tabs, current, focus, activation, setStored]);

    return {
        value: current,
        select: setStored,
        isActive: (tab) => tab === current,
        listProps: { role: 'tablist', 'aria-orientation': orientation, onKeyDown },
        tabProps: (tab) => ({
            id: tabId(tab),
            role: 'tab',
            'aria-selected': tab === current,
            'aria-controls': panelId(tab),
            tabIndex: tab === current ? 0 : -1,
            onClick: () => setStored(tab),
            ref: (element) => {
                if (element) elements.current.set(tab, element);
                else elements.current.delete(tab);
            },
            selected: tab === current,
        }),
        panelProps: (tab) => ({
            id: panelId(tab),
            role: 'tabpanel',
            'aria-labelledby': tabId(tab),
            tabIndex: 0,
            hidden: tab !== current,
        }),
    };
}
