import { ReactNode } from 'react';
import { Card, CardClassNames } from './Card';
import { CardHeader, CardHeaderClassNames } from './CardHeader';
import { cn } from './utils';

export interface DataCardClassNames {
    root?: string;
    card?: CardClassNames;
    header?: CardHeaderClassNames;
    content?: string;
}

interface DataCardProps {
    children: ReactNode;
    className?: string; // Standard root className
    title?: ReactNode;
    action?: ReactNode;
    noPadding?: boolean;
    classNames?: DataCardClassNames;
}

export const DataCard = ({ children, className = '', title, action, noPadding = false, classNames }: DataCardProps) => {
    return (
        <Card className={cn(className, classNames?.root)} classNames={classNames?.card}>
            <CardHeader title={title} action={action} classNames={classNames?.header} />
            <div className={cn(noPadding ? '' : 'p-6', classNames?.content)}>
                {children}
            </div>
        </Card>
    );
};
