import React from 'react';
import type { IconComponent } from './types';
import { cn } from './utils';
import { FOCUS_RING } from './focus';

/** Edge length of the stat icon. Fixed by the card layout, not a caller choice. */
const STAT_ICON_SIZE = 24;

export interface StatCardClassNames {
    label?: string;
    value?: string;
    iconWrapper?: string;
    icon?: string;
    sub?: string;
}

/**
 * Everything a caller may put on the rendered element, minus what this card
 * decides for itself. `useTabs`' `tabProps` is the reason it exists: a card
 * used as a tab needs `role`, `aria-selected`, `aria-controls` and a roving
 * `tabIndex` on the same element the click is on.
 */
type StatCardElementProps = Omit<
    React.HTMLAttributes<HTMLElement>,
    'onClick' | 'className' | 'children'
>;

export interface StatCardProps extends StatCardElementProps {
    label: string;
    value: string;
    sub?: string;
    icon: IconComponent;
    onClick?: () => void;
    /**
     * Marks a clickable card as the active choice, and draws the selection ring.
     *
     * It carries no semantics of its own. A row of cards that switches a panel
     * is a tab list, a single card that turns something on is a toggle, and the
     * two are announced differently -- so the card takes the ARIA it is given
     * (`useTabs`' `tabProps`, say) and only falls back to `aria-pressed` when
     * nobody said otherwise. It used to assume the toggle reading, which made
     * it unusable as a tab without lying to a screen reader.
     */
    selected?: boolean;
    className?: string;
    classNames?: StatCardClassNames;
    ref?: React.Ref<HTMLDivElement & HTMLButtonElement>;
}

export const StatCard = ({ label, value, sub, icon: Icon, onClick, selected, className = '', classNames, ref, ...rest }: StatCardProps) => {
    // A clickable card has to be a real button, or it is unreachable by keyboard
    // and invisible to assistive technology.
    const Tag = onClick ? 'button' : 'div';

    return (
        <Tag
            ref={ref}
            type={onClick ? 'button' : undefined}
            onClick={onClick}
            // Only a button can be pressed; on a plain card the state would be
            // announced without any way to change it. A caller that brought its
            // own role brought its own way of saying "current" with it.
            aria-pressed={onClick && selected !== undefined && !rest.role ? selected : undefined}
            {...rest}
            className={cn(
                // Label, value and sub are three rows the card borrows from the
                // grid it sits in (`row-span-3` + subgrid), so each of them is as
                // tall as the tallest one in the row of cards and all three line
                // up across the row -- by content, with no height set anywhere.
                // Outside a grid, subgrid falls back to rows of the card's own.
                // The rows touch (`gap-y-0`) and the spacing is a margin on the
                // content, or a row nobody fills would still cost the parent's gap.
                // Half of that gap stays below the value when no card in the row
                // has a `sub` (measured in Chrome): an empty last row is never
                // lower than the card's bottom padding.
                "grid row-span-3 grid-rows-subgrid grid-cols-[1fr_auto] gap-y-0",
                "bg-statcard-bg p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition h-full",
                onClick
                    ? cn('w-full text-left cursor-pointer hover:border-border active:scale-[0.98]', FOCUS_RING)
                    : '',
                // The ring sits on the card itself, so it always follows the
                // card's own corner radius. A wrapper would have to repeat it.
                selected ? 'ring-2 ring-primary' : '',
                className
            )}
        >
            {/*
                Spans, not <p>/<h3>/<div>: a clickable card renders a <button>, whose
                content model is phrasing content only. A stat value is also not
                a document heading — it would only pollute the page outline.
                All four are direct children: a subgrid lines up nothing deeper.
            */}
            <span className={cn("col-start-1 row-start-1 text-sm font-medium text-text-muted uppercase tracking-wide", classNames?.label)}>{label}</span>
            <span className={cn("col-start-1 row-start-2 text-3xl font-bold text-text-primary mt-1", classNames?.value)}>{value}</span>
            <span className={cn("col-start-2 row-start-1 row-span-2 self-start p-3 rounded-lg bg-statcard-icon-bg text-text-secondary", classNames?.iconWrapper)} aria-hidden="true">
                <Icon size={STAT_ICON_SIZE} className={cn(classNames?.icon)} />
            </span>
            {sub && <span className={cn("col-start-1 col-span-2 row-start-3 mt-4 text-xs font-medium text-text-muted", classNames?.sub)}>{sub}</span>}
        </Tag>
    );
};
