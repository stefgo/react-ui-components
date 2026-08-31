import { useState, useCallback, useRef } from 'react';
import type { AnchorRect } from './usePopoverPosition';

interface MenuState<T = string | number> {
    id: T;
    /** The trigger's rect at the moment it was clicked. */
    anchor: AnchorRect;
}

export const useActionMenu = <T = string | number>() => {
    const [menuState, setMenuState] = useState<MenuState<T> | null>(null);
    // Kept so focus can go back to the button that opened the menu.
    const triggerRef = useRef<HTMLElement | null>(null);

    const openMenu = useCallback((e: React.MouseEvent, id: T) => {
        e.stopPropagation();
        const trigger = e.currentTarget as HTMLElement;
        const { top, bottom, left, right } = trigger.getBoundingClientRect();

        setMenuState(current => {
            if (current?.id === id) return null;
            triggerRef.current = trigger;
            return { id, anchor: { top, bottom, left, right } };
        });
    }, []);

    const closeMenu = useCallback(() => {
        setMenuState(null);
    }, []);

    return {
        menuState,
        triggerRef,
        openMenu,
        closeMenu
    };
};
