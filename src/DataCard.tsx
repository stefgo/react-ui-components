import { ReactNode } from 'react';
import { Card, CardClassNames } from './Card';
import { cn } from './utils';

export interface DataCardClassNames {
    root?: string;
    card?: CardClassNames;
    content?: string;
}

interface DataCardProps {
    children: ReactNode;
    className?: string;
    title?: ReactNode;
    action?: ReactNode;
    noPadding?: boolean;
    classNames?: DataCardClassNames;
}

export const DataCard = ({ children, className = '', title, action, noPadding = false, classNames }: DataCardProps) => {
    return (
        <Card
            className={cn(className, classNames?.root)}
            classNames={classNames?.card}
            title={title}
            action={action}
        >
            <div className={cn(noPadding ? '' : 'p-6', classNames?.content)}>
                {children}
            </div>
        </Card>
    );
};
