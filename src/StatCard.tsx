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
}

export const StatCard = ({ label, value, sub, icon, onClick, className = '', classNames }: StatCardProps) => (
    <div
        onClick={onClick}
        className={cn(
            "bg-statcard-bg dark:bg-statcard-bg-dark p-6 rounded-xl border border-gray-200 dark:border-dark shadow-sm hover:shadow-md transition-all h-full",
            onClick ? 'cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 active:scale-[0.98]' : '',
            className,
            classNames?.root
        )}
    >
        <div className={cn("flex justify-between items-start mb-4", classNames?.labelWrapper)}>
            <div>
                <p className={cn("text-sm font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide", classNames?.label)}>{label}</p>
                <h3 className={cn("text-3xl font-bold text-text-primary dark:text-text-primary-dark mt-1", classNames?.value)}>{value}</h3>
            </div>
            <div className={cn("p-3 rounded-xl bg-statcard-icon-bg dark:bg-statcard-icon-bg-dark text-text-secondary dark:text-text-muted-dark", classNames?.iconWrapper)}>
                {icon}
            </div>
        </div>
        {sub && <div className={cn("text-xs font-medium text-text-muted dark:text-text-muted-dark", classNames?.sub)}>{sub}</div>}
    </div>
);
