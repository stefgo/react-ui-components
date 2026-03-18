import { ReactNode } from 'react';
import { cn } from './utils';

export interface CardClassNames {
    root?: string;
    header?: string;
    headerTitle?: string;
    headerAction?: string;
}

interface CardProps {
    children?: ReactNode;
    title?: ReactNode;
    action?: ReactNode;
    className?: string;
    classNames?: CardClassNames;
}

export const Card = ({ children, title, action, className = '', classNames }: CardProps) => {
    const showHeader = title || action;
    return (
        <div className={cn(
            "bg-card dark:bg-card-dark overflow-hidden rounded-xl border border-border dark:border-border-dark shadow-lg",
            className,
            classNames?.root
        )}>
            {showHeader && (
                <div className={cn(
                    "px-5 py-4 border-b border-border dark:border-border-dark flex justify-between items-center bg-card-header dark:bg-card-header-dark rounded-t-xl",
                    classNames?.header
                )}>
                    {title && <h3 className={cn("font-semibold text-text-primary dark:text-text-primary-dark flex items-center gap-2", classNames?.headerTitle)}>{title}</h3>}
                    {action && <div className={cn(classNames?.headerAction)}>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
};
