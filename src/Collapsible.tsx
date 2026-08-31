import { useState, useId, ReactNode, Ref } from 'react';
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
    /** Initial state when uncontrolled. Ignored once `expanded` is passed. */
    initiallyExpanded?: boolean;
    /** Controlled state. Pass together with `onExpandedChange`. */
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
    classNames?: CollapsibleClassNames;
    ref?: Ref<HTMLDivElement>;
}

export const Collapsible = ({
    title,
    children,
    initiallyExpanded = false,
    expanded,
    onExpandedChange,
    className = "",
    headerClassName = "",
    contentClassName = "",
    classNames,
    ref
}: CollapsibleProps) => {
    const [uncontrolledExpanded, setUncontrolledExpanded] = useState(initiallyExpanded);

    const isControlled = expanded !== undefined;
    const isExpanded = isControlled ? expanded : uncontrolledExpanded;

    const contentId = useId();

    const toggle = () => {
        const next = !isExpanded;
        if (!isControlled) setUncontrolledExpanded(next);
        onExpandedChange?.(next);
    };

    return (
        <div ref={ref} className={cn("overflow-hidden transition-all", className, classNames?.root)}>
            <button
                type="button"
                onClick={toggle}
                aria-expanded={isExpanded}
                aria-controls={contentId}
                className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-card dark:hover:bg-card-dark",
                    headerClassName,
                    classNames?.header
                )}
            >
                <div className={cn("flex items-center gap-3 overflow-hidden", classNames?.titleWrapper)}>
                    <span className={cn("text-text-muted dark:text-text-muted-dark group-hover:text-text-primary dark:group-hover:text-text-primary-dark", classNames?.icon)} aria-hidden="true">
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </span>
                    <div className="flex-1 overflow-hidden">{title}</div>
                </div>
            </button>
            {/*
                Animating grid-template-rows from 0fr to 1fr collapses to the content's own
                height without a max-height guess, so arbitrarily tall content is never cut off.
                `inert` keeps collapsed content out of the tab order and off the a11y tree.
            */}
            <div
                id={contentId}
                inert={!isExpanded}
                className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
                    isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                    contentClassName,
                    classNames?.content
                )}
            >
                <div className="min-h-0 overflow-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
};
