import { ReactNode } from 'react';
import { cn } from './utils';

export interface CardHeaderClassNames {
    root?: string;
    title?: string;
    action?: string;
}

interface CardHeaderProps {
    title?: ReactNode;
    action?: ReactNode;
    className?: string; // Standard root className
    classNames?: CardHeaderClassNames;
}

export const CardHeader = ({ title, action, className = '', classNames }: CardHeaderProps) => {
    if (!title && !action) return null;
    return (
        <div className={cn(
            "px-5 py-4 border-b dark:border-dark flex justify-between items-center bg-card dark:bg-card-dark rounded-t-xl",
            className,
            classNames?.root
        )}>
            {title && <h3 className={cn("font-semibold text-text-secondary dark:text-text-secondary-dark flex items-center gap-2", classNames?.title)}>{title}</h3>}
            {action && <div className={cn(classNames?.action)}>{action}</div>}
        </div>
    );
};
