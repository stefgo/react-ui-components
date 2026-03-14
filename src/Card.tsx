import { ReactNode } from 'react';
import { cn } from './utils';

export interface CardClassNames {
    root?: string;
}

interface CardProps {
    children: ReactNode;
    className?: string;
    classNames?: CardClassNames;
}

export const Card = ({ children, className = '', classNames }: CardProps) => {
    return (
        <div className={cn(
            "bg-card dark:bg-card-dark rounded-xl border dark:border-dark shadow-lg",
            className,
            classNames?.root
        )}>
            {children}
        </div>
    );
};
