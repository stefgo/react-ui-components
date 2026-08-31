import { ReactNode, cloneElement, isValidElement, useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePopoverPosition, type AnchorRect, type PopoverPlacement } from './hooks/usePopoverPosition';
import { cn } from './utils';

export interface TooltipProps {
    /** The text shown on hover or focus. Keep it short — it is not a dialog. */
    content: ReactNode;
    /** Exactly one element. It receives the ARIA wiring and the event handlers. */
    children: ReactNode;
    placement?: PopoverPlacement;
    /** Milliseconds of hover before it opens. Focus opens it immediately. */
    delay?: number;
    disabled?: boolean;
    className?: string;
}

/**
 * A tooltip that replaces the native `title` attribute.
 *
 * `title` cannot be styled, does not appear on touch devices, and is announced
 * inconsistently. This is `aria-describedby` on a real element instead — so the
 * trigger keeps its own accessible name, and the tooltip only adds to it.
 *
 * It describes; it does not name. If a control has no visible label, give it an
 * `aria-label` as well: a tooltip that never opens leaves an unnamed button.
 */
export const Tooltip = ({
    content,
    children,
    placement = 'top',
    delay = 300,
    disabled = false,
    className = ''
}: TooltipProps) => {
    const id = useId();
    const [anchor, setAnchor] = useState<AnchorRect | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const isOpen = anchor !== null;

    const { ref, style, isPositioned } = usePopoverPosition<HTMLDivElement>({
        isOpen,
        anchor,
        placement,
        align: 'center'
    });

    const close = useCallback(() => {
        clearTimeout(timer.current);
        setAnchor(null);
    }, []);

    /*
     * The anchor comes from the event's own `currentTarget`, which is the
     * trigger itself — so no ref has to be threaded into the child at all.
     * Merging a caller's ref with ours through `cloneElement` is the part of
     * this pattern that usually goes wrong, and here there is nothing to merge.
     */
    const open = useCallback((element: HTMLElement, immediate: boolean) => {
        if (disabled) return;

        const show = () => {
            const { top, bottom, left, right } = element.getBoundingClientRect();
            setAnchor({ top, bottom, left, right });
        };

        clearTimeout(timer.current);
        if (immediate) show();
        else timer.current = setTimeout(show, delay);
    }, [delay, disabled]);

    useEffect(() => () => clearTimeout(timer.current), []);

    // WAI-ARIA requires Escape to dismiss a tooltip even while the trigger keeps
    // focus — otherwise it can cover the very content the user is reading.
    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') close();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [isOpen, close]);

    if (!isValidElement(children)) {
        throw new Error('Tooltip expects exactly one element as its child.');
    }

    /*
     * `aria-describedby` has to land on the focusable element itself. Wrapping
     * the child in a span instead would put it on the wrapper, where assistive
     * technology never looks — which would defeat the entire component.
     *
     * `react-hooks/refs` flags the child being passed to a function, on the
     * assumption that the function might read `ref.current` during render.
     * `cloneElement` does not: it copies the ref onto the new element without
     * ever dereferencing it.
     */
    // eslint-disable-next-line react-hooks/refs -- cloneElement copies the ref, it does not read it
    const trigger = cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        // `describedby`, never `labelledby`: the trigger already has a name, and
        // replacing it with the tooltip text would lose it.
        'aria-describedby': isOpen ? id : undefined,
        onMouseEnter: (event: React.MouseEvent<HTMLElement>) => open(event.currentTarget, false),
        onMouseLeave: close,
        // Focus opens with no delay — a keyboard user has already committed.
        onFocus: (event: React.FocusEvent<HTMLElement>) => open(event.currentTarget, true),
        onBlur: close
    });

    return (
        <>
            {trigger}
            {isOpen && typeof document !== 'undefined' && createPortal(
                <div
                    ref={ref}
                    id={id}
                    role="tooltip"
                    className={cn(
                        "z-dropdown max-w-xs px-2 py-1 rounded-sm text-xs font-medium",
                        "bg-card text-text-primary border border-border shadow-lg pointer-events-none",
                        isPositioned ? "visible" : "invisible",
                        className
                    )}
                    style={style}
                >
                    {content}
                </div>,
                document.body
            )}
        </>
    );
};
