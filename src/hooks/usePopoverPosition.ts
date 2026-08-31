import { useLayoutEffect, useRef, useState } from 'react';

/** Where the popover is anchored, in viewport coordinates. */
export interface AnchorRect {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';
export type PopoverAlign = 'start' | 'center' | 'end';

/** Distance kept from the viewport edge and from the anchor. */
export const POPOVER_GAP = 8;

export interface UsePopoverPositionOptions {
    isOpen: boolean;
    anchor: AnchorRect | null;
    /** Preferred side. Flips to the opposite one when that side has no room. */
    placement?: PopoverPlacement;
    align?: PopoverAlign;
    gap?: number;
    margin?: number;
}

export interface PopoverPosition<T extends HTMLElement> {
    ref: React.RefObject<T | null>;
    /** `position: fixed` coordinates. Apply directly to `style`. */
    style: { position: 'fixed'; top: number; left: number };
    /**
     * False until the element has been measured. Render it invisible rather than
     * absent until then — it has to be in the DOM to have a size at all.
     */
    isPositioned: boolean;
    /** The side actually used, which is not the preferred one after a flip. */
    placement: PopoverPlacement;
}

const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(value, max));

/**
 * Places a floating element next to an anchor and keeps it inside the viewport.
 *
 * Measuring happens in a layout effect, before the browser paints, so the
 * element never appears at the unclamped position first. `ActionMenu` had this
 * logic inline; `Tooltip` needs the same thing on all four sides.
 */
export const usePopoverPosition = <T extends HTMLElement>({
    isOpen,
    anchor,
    placement = 'bottom',
    align = 'start',
    gap = POPOVER_GAP,
    margin = POPOVER_GAP
}: UsePopoverPositionOptions): PopoverPosition<T> => {
    const ref = useRef<T>(null);
    const [resolved, setResolved] = useState<{ top: number; left: number; placement: PopoverPlacement } | null>(null);

    const anchorTop = anchor?.top;
    const anchorBottom = anchor?.bottom;
    const anchorLeft = anchor?.left;
    const anchorRight = anchor?.right;

    useLayoutEffect(() => {
        const el = ref.current;
        if (!isOpen || !el || anchorTop === undefined) return;

        const rect: AnchorRect = {
            top: anchorTop,
            bottom: anchorBottom!,
            left: anchorLeft!,
            right: anchorRight!
        };
        const { width, height } = el.getBoundingClientRect();
        const maxLeft = window.innerWidth - width - margin;
        const maxTop = window.innerHeight - height - margin;

        const crossAxis = (start: number, end: number, size: number) => {
            if (align === 'start') return start;
            if (align === 'end') return end - size;
            return start + (end - start) / 2 - size / 2;
        };

        let used = placement;
        let top: number;
        let left: number;

        if (placement === 'bottom' || placement === 'top') {
            const below = rect.bottom + gap;
            const above = rect.top - height - gap;

            // Flip only when the preferred side genuinely has no room *and* the
            // other one does. Flipping into an even tighter space helps nobody.
            if (placement === 'bottom' && below > maxTop && above >= margin) used = 'top';
            if (placement === 'top' && above < margin && below <= maxTop) used = 'bottom';

            top = used === 'bottom' ? below : above;
            left = crossAxis(rect.left, rect.right, width);
        } else {
            const after = rect.right + gap;
            const before = rect.left - width - gap;

            if (placement === 'right' && after > maxLeft && before >= margin) used = 'left';
            if (placement === 'left' && before < margin && after <= maxLeft) used = 'right';

            left = used === 'right' ? after : before;
            top = crossAxis(rect.top, rect.bottom, height);
        }

        setResolved({
            top: clamp(top, margin, Math.max(margin, maxTop)),
            left: clamp(left, margin, Math.max(margin, maxLeft)),
            placement: used
        });
    }, [isOpen, anchorTop, anchorBottom, anchorLeft, anchorRight, placement, align, gap, margin]);

    return {
        ref,
        style: {
            position: 'fixed',
            top: resolved?.top ?? anchorTop ?? 0,
            left: resolved?.left ?? anchorLeft ?? 0
        },
        isPositioned: resolved !== null,
        placement: resolved?.placement ?? placement
    };
};
