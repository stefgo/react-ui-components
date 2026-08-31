import { useCallback, useEffect, useRef, RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
].join(', ');

export type MenuBehaviorMode = 'menu' | 'dialog';

export interface UseMenuBehaviorOptions {
    isOpen: boolean;
    onClose: () => void;
    /**
     * `menu` – arrow keys move between items, Tab closes (WAI-ARIA menu pattern).
     * `dialog` – Tab is trapped inside, arrow keys are left to the content.
     */
    mode?: MenuBehaviorMode;
    /** Focus returns here on close. Defaults to whatever had focus when the menu opened. */
    triggerRef?: RefObject<HTMLElement | null>;
    /** Close on scroll/resize – for menus anchored to a fixed viewport position. */
    closeOnViewportChange?: boolean;
    /** Prevent the page behind a dialog from scrolling. */
    lockScroll?: boolean;
}

/**
 * Shared open-menu behaviour: outside click, Escape, focus movement and focus
 * restoration. Used by ActionMenu, UserMenu and MobileMoreSheet so the three do
 * not drift apart again.
 */
export const useMenuBehavior = <T extends HTMLElement = HTMLDivElement>({
    isOpen,
    onClose,
    mode = 'menu',
    triggerRef,
    closeOnViewportChange = false,
    lockScroll = false
}: UseMenuBehaviorOptions) => {
    const containerRef = useRef<T>(null);
    const previouslyFocused = useRef<HTMLElement | null>(null);

    const getItems = useCallback((): HTMLElement[] => {
        const container = containerRef.current;
        if (!container) return [];

        const explicit = container.querySelectorAll<HTMLElement>('[role="menuitem"]');
        const nodes = explicit.length > 0
            ? explicit
            : container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

        return Array.from(nodes).filter(el => !el.hasAttribute('disabled'));
    }, []);

    // Remember the trigger and move focus into the menu.
    useEffect(() => {
        if (!isOpen) return;

        previouslyFocused.current = document.activeElement as HTMLElement | null;
        const items = getItems();
        (items[0] ?? containerRef.current)?.focus();
    }, [isOpen, getItems]);

    // Restore focus when the menu closes, but never steal it back on unmount of
    // a component that was already gone from the page.
    useEffect(() => {
        if (isOpen) return;
        const target = triggerRef?.current ?? previouslyFocused.current;
        if (target?.isConnected) target.focus();
        // Only react to the open→closed transition.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Outside click – registered only while open, so a closed menu costs nothing.
    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node;
            if (containerRef.current?.contains(target)) return;
            if (triggerRef?.current?.contains(target)) return;
            onClose();
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('touchstart', handlePointerDown);
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('touchstart', handlePointerDown);
        };
    }, [isOpen, onClose, triggerRef]);

    // Keyboard handling.
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                onClose();
                return;
            }

            const items = getItems();
            if (items.length === 0) return;

            const currentIndex = items.indexOf(document.activeElement as HTMLElement);

            const focusAt = (index: number) => {
                event.preventDefault();
                items[(index + items.length) % items.length].focus();
            };

            if (mode === 'menu') {
                switch (event.key) {
                    case 'ArrowDown': return focusAt(currentIndex + 1);
                    case 'ArrowUp': return focusAt(currentIndex - 1);
                    case 'Home': return focusAt(0);
                    case 'End': return focusAt(items.length - 1);
                    case 'Tab': return onClose();
                }
                return;
            }

            if (event.key === 'Tab') {
                // Dialog: keep focus inside.
                const first = items[0];
                const last = items[items.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, mode, getItems]);

    // A menu anchored to a viewport coordinate goes stale once the page moves.
    useEffect(() => {
        if (!isOpen || !closeOnViewportChange) return;

        const handle = () => onClose();
        window.addEventListener('scroll', handle, true);
        window.addEventListener('resize', handle);
        return () => {
            window.removeEventListener('scroll', handle, true);
            window.removeEventListener('resize', handle);
        };
    }, [isOpen, closeOnViewportChange, onClose]);

    useEffect(() => {
        if (!isOpen || !lockScroll) return;

        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = previous; };
    }, [isOpen, lockScroll]);

    return { containerRef };
};
