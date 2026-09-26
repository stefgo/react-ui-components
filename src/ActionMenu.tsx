import { createContext, useContext, ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useMenuBehavior } from './hooks/useMenuBehavior';
import { usePopoverPosition, type AnchorRect } from './hooks/usePopoverPosition';
import { cn } from './utils';
import { FOCUS_RING_NONE } from './focus';
import { ICON_SIZE, type IconComponent } from './types';

/**
 * How an entry closes the menu it sits in. Every consumer wrote `closeMenu()`
 * into each entry's handler by hand; the one that forgot left its menu open.
 */
const ActionMenuContext = createContext<{ close: () => void } | null>(null);

export interface ActionMenuProps {
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
                "w-48 bg-card rounded-md shadow-lg border border-border z-dropdown py-1",
                FOCUS_RING_NONE,
                // In the DOM but not yet measured: it needs a size before it can
                // be placed, and it has no size until it is rendered.
                isPositioned ? "visible" : "invisible",
                className
            )}
            style={style}
        >
            <ActionMenuContext.Provider value={{ close: onClose }}>
                {children}
            </ActionMenuContext.Provider>
        </div>,
        document.body
    );
};

export interface MenuItemProps {
    icon: IconComponent;
    children: ReactNode;
    onClick: () => void;
    /** `danger` for an entry that destroys something. */
    variant?: 'default' | 'danger';
    disabled?: boolean;
    /** Why the entry is disabled. Shown as its title while it is. */
    disabledTitle?: string;
    className?: string;
}

/**
 * One entry of an `ActionMenu`. It closes the menu after running `onClick`.
 *
 * Detail pages used to build these by hand as `<button className={MENU_ENTRY}>`,
 * with the class string copied per project -- and only one of the copies greyed
 * out a disabled entry. `DataAction` renders its entries through this as well,
 * so a row menu and a page menu cannot drift apart.
 */
export const MenuItem = ({
    icon: Icon,
    children,
    onClick,
    variant = 'default',
    disabled = false,
    disabledTitle,
    className
}: MenuItemProps) => {
    const menu = useContext(ActionMenuContext);

    return (
        <button
            type="button"
            role="menuitem"
            onClick={() => {
                if (disabled) return;
                onClick();
                menu?.close();
            }}
            disabled={disabled}
            title={disabled ? disabledTitle : undefined}
            className={cn(
                "w-full text-left px-4 py-2 text-sm flex items-center gap-2",
                // Inside a popover an outward ring is clipped by it, so the entry
                // marks focus with its background instead.
                FOCUS_RING_NONE,
                "focus-visible:bg-hover",
                disabled
                    ? 'text-text-muted cursor-not-allowed'
                    : variant === 'danger'
                        ? 'text-error hover:bg-error-bg'
                        : 'text-text-secondary hover:bg-hover',
                className
            )}
        >
            <Icon size={ICON_SIZE.sm} aria-hidden />
            {children}
        </button>
    );
};
