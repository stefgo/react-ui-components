import { ReactNode, Ref } from 'react';
import { cn } from './utils';

export interface CollapsibleRegionClassNames {
    /** The clipping wrapper directly around `children`. */
    inner?: string;
}

export interface CollapsibleRegionProps {
    expanded: boolean;
    children: ReactNode;
    /** Pass it to the trigger's `aria-controls`. */
    id?: string;
    className?: string;
    classNames?: CollapsibleRegionClassNames;
    ref?: Ref<HTMLDivElement>;
}

/**
 * The part of a disclosure that opens and closes -- without the trigger.
 *
 * `Collapsible` makes its whole header the trigger, which is right for an
 * accordion row and wrong wherever the header holds controls of its own: a
 * menu button inside a `<button>` is invalid markup and reads as one control.
 * Such a surface (`EntityHeader`) draws its own trigger and uses this for the
 * rest, so the animation below exists once.
 *
 * Animating grid-template-rows from 0fr to 1fr collapses to the content's own
 * height without a max-height guess, so arbitrarily tall content is never cut
 * off. `inert` keeps collapsed content out of the tab order and off the a11y
 * tree.
 */
export const CollapsibleRegion = ({
    expanded,
    children,
    id,
    className,
    classNames,
    ref
}: CollapsibleRegionProps) => (
    <div
        ref={ref}
        id={id}
        inert={!expanded}
        className={cn(
            "grid transition-[grid-template-rows,opacity] duration-slow ease-in-out",
            expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
            className
        )}
    >
        <div className={cn("min-h-0 overflow-hidden", classNames?.inner)}>
            {children}
        </div>
    </div>
);
