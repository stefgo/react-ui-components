import { useLayoutEffect, useState, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useMenuBehavior } from './hooks/useMenuBehavior';
import { cn } from './utils';

export interface ActionMenuClassNames {
    /** @deprecated The menu no longer renders a full-screen overlay. */
    overlay?: string;
    root?: string;
}

export interface ActionMenuPosition {
    /** Right edge of the trigger – the menu is right-aligned to it. */
    x: number;
    /** Bottom edge of the trigger – the menu opens below it. */
    y: number;
    /** Top edge of the trigger. Lets the menu flip above when space runs out. */
    top?: number;
}

interface ActionMenuProps {
    isOpen: boolean;
    onClose: () => void;
    position: ActionMenuPosition;
    children: React.ReactNode;
    /** Focus returns here when the menu closes. */
    triggerRef?: RefObject<HTMLElement | null>;
    className?: string;
    classNames?: ActionMenuClassNames;
}

const VIEWPORT_MARGIN = 8;

export const ActionMenu = ({
    isOpen,
    onClose,
    position,
    children,
    triggerRef,
    className = '',
    classNames
}: ActionMenuProps) => {
    const { containerRef } = useMenuBehavior<HTMLDivElement>({
        isOpen,
        onClose,
        mode: 'menu',
        triggerRef,
        closeOnViewportChange: true
    });

    const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

    // Measure the rendered menu and keep it inside the viewport. Runs before paint,
    // so the menu never shows up at the unclamped position first.
    // A closed menu renders nothing, so there is no stale position to clear – the
    // next open re-measures before the browser paints.
    useLayoutEffect(() => {
        const el = containerRef.current;
        if (!isOpen || !el) return;

        const { width, height } = el.getBoundingClientRect();
        const maxLeft = window.innerWidth - width - VIEWPORT_MARGIN;
        const maxTop = window.innerHeight - height - VIEWPORT_MARGIN;

        const left = Math.max(VIEWPORT_MARGIN, Math.min(position.x - width, maxLeft));

        let top = position.y + VIEWPORT_MARGIN;
        if (top > maxTop) {
            // Flip above the trigger when we know where it starts, otherwise clamp.
            top = position.top !== undefined
                ? position.top - height - VIEWPORT_MARGIN
                : maxTop;
        }
        top = Math.max(VIEWPORT_MARGIN, top);

        setCoords({ top, left });
    }, [isOpen, position.x, position.y, position.top, containerRef]);

    if (!isOpen) return null;

    return createPortal(
        <div
            ref={containerRef}
            role="menu"
            tabIndex={-1}
            className={cn(
                "fixed w-48 bg-card dark:bg-card-dark rounded-md shadow-lg border border-border dark:border-border-dark z-dropdown py-1 focus:outline-none",
                coords ? "visible" : "invisible",
                className,
                classNames?.root
            )}
            style={coords ?? { top: position.y, left: position.x }}
        >
            {children}
        </div>,
        document.body
    );
};
