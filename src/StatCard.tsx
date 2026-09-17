import React from 'react';
import type { IconComponent } from './types';
import { cn } from './utils';
import { FOCUS_RING } from './focus';

/** Edge length of the stat icon. Fixed by the card layout, not a caller choice. */
const STAT_ICON_SIZE = 24;

export interface StatCardClassNames {
    labelWrapper?: string;
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
            <div className={cn("flex justify-between items-start mb-4", classNames?.labelWrapper)}>
                {/*
                    Spans, not <p>/<h3>: a clickable card renders a <button>, whose
                    content model is phrasing content only. A stat value is also not
                    a document heading — it would only pollute the page outline.
                */}
                <div>
                    <span className={cn("block text-sm font-medium text-text-muted uppercase tracking-wide", classNames?.label)}>{label}</span>
                    <span className={cn("block text-3xl font-bold text-text-primary mt-1", classNames?.value)}>{value}</span>
                </div>
                <div className={cn("p-3 rounded-lg bg-statcard-icon-bg text-text-secondary", classNames?.iconWrapper)} aria-hidden="true">
                    <Icon size={STAT_ICON_SIZE} className={cn(classNames?.icon)} />
                </div>
            </div>
            {sub && <div className={cn("text-xs font-medium text-text-muted", classNames?.sub)}>{sub}</div>}
        </Tag>
    );
};
