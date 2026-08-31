import { ReactNode, Ref } from 'react';
import { Card, CardClassNames, CardTitleLevel } from './Card';
import { cn } from './utils';

export interface DataCardClassNames {
    card?: CardClassNames;
    content?: string;
}

interface DataCardProps {
    children: ReactNode;
    className?: string;
    title?: ReactNode;
    action?: ReactNode;
    noPadding?: boolean;
    titleAs?: CardTitleLevel;
    classNames?: DataCardClassNames;
    ref?: Ref<HTMLDivElement>;
}

export const DataCard = ({ children, className = '', title, action, noPadding = false, titleAs, classNames, ref }: DataCardProps) => {
    return (
        <Card
            ref={ref}
            className={className}
            classNames={classNames?.card}
            title={title}
            titleAs={titleAs}
            action={action}
        >
            <div className={cn(noPadding ? '' : 'p-6', classNames?.content)}>
                {children}
            </div>
        </Card>
    );
};
