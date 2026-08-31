import React from 'react';
import { cn } from './utils';

export interface StatCardClassNames {
    root?: string;
    labelWrapper?: string;
    label?: string;
    value?: string;
    iconWrapper?: string;
    icon?: string;
    sub?: string;
}

interface StatCardProps {
    label: string;
    value: string;
    sub?: string;
    icon: React.ReactNode;
    onClick?: () => void;
    className?: string;
    classNames?: StatCardClassNames;
    ref?: React.Ref<HTMLDivElement & HTMLButtonElement>;
}

export const StatCard = ({ label, value, sub, icon, onClick, className = '', classNames, ref }: StatCardProps) => {
    // A clickable card has to be a real button, or it is unreachable by keyboard
    // and invisible to assistive technology.
    const Tag = onClick ? 'button' : 'div';

    return (
        <Tag
            ref={ref}
            type={onClick ? 'button' : undefined}
            onClick={onClick}
            className={cn(
                "bg-statcard-bg dark:bg-statcard-bg-dark p-6 rounded-xl border border-border dark:border-border-dark shadow-sm hover:shadow-md transition-all h-full",
                onClick
                    ? 'w-full text-left cursor-pointer hover:border-border dark:hover:border-border-dark active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                    : '',
                className,
                classNames?.root
            )}
        >
            <div className={cn("flex justify-between items-start mb-4", classNames?.labelWrapper)}>
                {/*
                    Spans, not <p>/<h3>: a clickable card renders a <button>, whose
                    content model is phrasing content only. A stat value is also not
                    a document heading — it would only pollute the page outline.
                */}
                <div>
                    <span className={cn("block text-sm font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide", classNames?.label)}>{label}</span>
                    <span className={cn("block text-3xl font-bold text-text-primary dark:text-text-primary-dark mt-1", classNames?.value)}>{value}</span>
                </div>
                <div className={cn("p-3 rounded-xl bg-statcard-icon-bg dark:bg-statcard-icon-bg-dark text-text-secondary dark:text-text-muted-dark", classNames?.iconWrapper)} aria-hidden="true">
                    {icon}
                </div>
            </div>
            {sub && <div className={cn("text-xs font-medium text-text-muted dark:text-text-muted-dark", classNames?.sub)}>{sub}</div>}
        </Tag>
    );
};
