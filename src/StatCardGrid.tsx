import React, { Children } from 'react';
import { cn } from './utils';

/** The widest row the preset has a column step for (`STAT_CARD_GRID_MAX_COLUMNS`). */
const MAX_COLUMNS = 6;

/**
 * The column counts beyond one that a row of `count` cards may use: each one
 * up to `count` that does not leave a single card alone on the last row. Five
 * cards go 3 + 2 and then 5 across -- never 2 + 2 + 1 or 4 + 1.
 */
function columnSteps(count: number): number[] {
    const steps: number[] = [];
    for (let columns = 2; columns <= Math.min(count, MAX_COLUMNS); columns++) {
        if (columns === count || count % columns !== 1) steps.push(columns);
    }
    return steps;
}

export interface StatCardGridProps extends React.HTMLAttributes<HTMLDivElement> {
    /** The cards, each a direct child: a `StatCard` lines up its rows with the grid's. */
    children: React.ReactNode;
    className?: string;
}

/**
 * A row of `StatCard`s that takes as many columns as there is room for.
 *
 * The room is the grid's own width, not the window's: a row beside an open
 * sidebar is 256px narrower than one beside a closed one, and a breakpoint on
 * the window cannot tell the two apart. Five cards in a 1280px window with the
 * sidebar open were 186px wide each -- too narrow for "Degraded" beside the
 * icon, which pushed the icon out over the card's edge.
 *
 * A card needs 15rem; below the room for two, the cards stack. Which counts are
 * allowed depends on how many cards there are (see `columnSteps`), the widths at
 * which they apply live in the Tailwind preset, which has to be in use.
 *
 * Two elements, because a container query asks an ancestor, never the element
 * itself: the outer one is the container, the inner one the grid.
 */
export const StatCardGrid = ({ children, className, ...rest }: StatCardGridProps) => {
    // toArray, not Children.count: count includes a `false` from `{cond && <StatCard />}`.
    const steps = columnSteps(Children.toArray(children).length);

    return (
        <div {...rest} className={cn("[container-type:inline-size] [container-name:ruic-stat-card-grid]", className)}>
            <div
                className="ruic-stat-card-grid grid grid-cols-1 gap-4"
                data-columns={steps.length > 0 ? steps.join(' ') : undefined}
            >
                {children}
            </div>
        </div>
    );
};
