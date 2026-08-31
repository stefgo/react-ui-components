import { ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useMenuBehavior } from './hooks/useMenuBehavior';
import { usePopoverPosition, type AnchorRect } from './hooks/usePopoverPosition';
import { cn } from './utils';

interface ActionMenuProps {
    isOpen: boolean;
    onClose: () => void;
    /** The trigger's bounding rect. `useActionMenu` produces it. */
    anchor: AnchorRect | null;
    children: ReactNode;
    /** Focus returns here when the menu closes. */
    triggerRef?: RefObject<HTMLElement | null>;
    className?: string;
}

export const ActionMenu = ({
    isOpen,
    onClose,
    anchor,
    children,
    triggerRef,
    className = ''
}: ActionMenuProps) => {
    const { containerRef } = useMenuBehavior<HTMLDivElement>({
        isOpen,
        onClose,
        mode: 'menu',
        triggerRef,
        closeOnViewportChange: true
    });

    // Right-aligned under the trigger, flipping above it when the page bottom
    // is closer than the menu is tall.
    const { ref: positionRef, style, isPositioned } = usePopoverPosition<HTMLDivElement>({
        isOpen,
        anchor,
        placement: 'bottom',
        align: 'end'
    });

    if (!isOpen) return null;

    return createPortal(
        <div
            ref={(node) => {
                containerRef.current = node;
                positionRef.current = node;
            }}
            role="menu"
            tabIndex={-1}
            className={cn(
                "w-48 bg-card rounded-md shadow-lg border border-border z-dropdown py-1 focus:outline-none",
                // In the DOM but not yet measured: it needs a size before it can
                // be placed, and it has no size until it is rendered.
                isPositioned ? "visible" : "invisible",
                className
            )}
            style={style}
        >
            {children}
        </div>,
        document.body
    );
};
