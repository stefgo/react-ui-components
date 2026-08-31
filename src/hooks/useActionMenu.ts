import { useState, useCallback, useRef } from 'react';

interface MenuState<T = string | number> {
    id: T;
    x: number;
    y: number;
    top: number;
}

export const useActionMenu = <T = string | number>() => {
    const [menuState, setMenuState] = useState<MenuState<T> | null>(null);
    // Kept so focus can go back to the button that opened the menu.
    const triggerRef = useRef<HTMLElement | null>(null);

    const openMenu = useCallback((e: React.MouseEvent, id: T) => {
        e.stopPropagation();
        const trigger = e.currentTarget as HTMLElement;
        const rect = trigger.getBoundingClientRect();

        setMenuState(current => {
            if (current?.id === id) return null;
            triggerRef.current = trigger;
            return { id, x: rect.right, y: rect.bottom, top: rect.top };
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
