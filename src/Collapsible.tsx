import { useId, ReactNode, Ref } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useControllableState } from './hooks/useControllableState';
import type { Controllable } from './types';
import { cn } from './utils';
import { FOCUS_RING_INSET } from './focus';

export interface CollapsibleClassNames {
    header?: string;
    titleWrapper?: string;
    icon?: string;
    content?: string;
}

export interface CollapsibleProps extends Controllable<boolean> {
    title: ReactNode;
    children: ReactNode;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
    classNames?: CollapsibleClassNames;
    ref?: Ref<HTMLDivElement>;
}

export const Collapsible = ({
    title,
    children,
    value,
    defaultValue,
    onChange,
    className = "",
    headerClassName = "",
    contentClassName = "",
    classNames,
    ref
}: CollapsibleProps) => {
    const [isExpanded, setExpanded] = useControllableState({
        value,
        defaultValue,
        onChange,
        fallback: false
    });

    const contentId = useId();

    const toggle = () => setExpanded((prev) => !prev);

    return (
        <div ref={ref} className={cn("overflow-hidden transition-all", className)}>
            <button
                type="button"
                onClick={toggle}
                aria-expanded={isExpanded}
                aria-controls={contentId}
                className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-card",
                    FOCUS_RING_INSET,
                    headerClassName,
                    classNames?.header
                )}
            >
                <div className={cn("flex items-center gap-3 overflow-hidden", classNames?.titleWrapper)}>
                    <span className={cn("text-text-muted group-hover:text-text-primary", classNames?.icon)} aria-hidden="true">
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
                    "grid transition-[grid-template-rows,opacity] duration-slow ease-in-out",
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
