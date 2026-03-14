import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from './utils';

export interface CollapsibleClassNames {
    root?: string;
    header?: string;
    titleWrapper?: string;
    icon?: string;
    content?: string;
}

interface CollapsibleProps {
    title: ReactNode;
    children: ReactNode;
    initiallyExpanded?: boolean;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
    classNames?: CollapsibleClassNames;
}

export const Collapsible = ({
    title,
    children,
    initiallyExpanded = false,
    className = "",
    headerClassName = "",
    contentClassName = "",
    classNames
}: CollapsibleProps) => {
    const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

    return (
        <div className={cn("overflow-hidden transition-all", className, classNames?.root)}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-card dark:hover:bg-card-dark",
                    headerClassName,
                    classNames?.header
                )}
            >
                <div className={cn("flex items-center gap-3 overflow-hidden", classNames?.titleWrapper)}>
                    <span className={cn("text-text-muted dark:text-text-muted-dark group-hover:text-text-primary dark:group-hover:text-text-primary-dark", classNames?.icon)}>
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </span>
                    <div className="flex-1 overflow-hidden">{title}</div>
                </div>
            </button>
            <div
                className={cn(
                    "transition-all duration-300 ease-in-out",
                    isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none',
                    contentClassName,
                    classNames?.content
                )}
            >
                {children}
            </div>
        </div>
    );
};
