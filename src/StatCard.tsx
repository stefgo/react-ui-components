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

export interface StatCardProps {
    label: string;
    value: string;
    sub?: string;
    icon: IconComponent;
    onClick?: () => void;
    /**
     * Marks a clickable card as the active choice. It draws the selection ring
     * and, more importantly, is the only thing that tells assistive technology
     * which card of a row is the current one -- a ring alone says nothing.
     */
    selected?: boolean;
    className?: string;
    classNames?: StatCardClassNames;
    ref?: React.Ref<HTMLDivElement & HTMLButtonElement>;
}

export const StatCard = ({ label, value, sub, icon: Icon, onClick, selected, className = '', classNames, ref }: StatCardProps) => {
    // A clickable card has to be a real button, or it is unreachable by keyboard
    // and invisible to assistive technology.
    const Tag = onClick ? 'button' : 'div';

    return (
        <Tag
            ref={ref}
            type={onClick ? 'button' : undefined}
            onClick={onClick}
            // Only a button can be pressed; on a plain card the state would be
            // announced without any way to change it.
            aria-pressed={onClick && selected !== undefined ? selected : undefined}
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
