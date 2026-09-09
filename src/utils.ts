import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * `tailwind-merge` 3.x is built for Tailwind v4; this library is on Tailwind v3.
 * The two disagree about exactly one class, and it is the one the focus ring is
 * made of: in v4 a bare `outline` sets `outline-width: 1px`, in v3 it sets
 * `outline-style: solid`. Left alone, tailwind-merge files it under *width*,
 * decides it conflicts with `outline-2`, and drops it.
 *
 * The result was invisible in the class strings and in the generated CSS -- the
 * rule `.focus-visible\:outline:focus-visible{outline-style:solid}` was emitted
 * correctly, the class just never reached the DOM. `outline-style` therefore
 * stayed at the user-agent default `auto`, which is not "no outline": it hands
 * the drawing to the browser, which paints its own two-stroke focus ring --
 * tinted with our `outline-color` and wrapped in a white contrast stroke. On a
 * dark surface that reads as a white frame around the orange ring.
 *
 * So: move the bare `outline` out of the width group and into the style group,
 * which is where Tailwind v3 puts it. Everything else keeps merging as before.
 */
type OutlineGroup = { outline: unknown[] };

const twMerge = extendTailwindMerge((config) => {
    // The two groups are replaced rather than mutated: the arrays come from
    // tailwind-merge's own default config and are shared across calls.
    const groups = config.classGroups as unknown as Record<string, OutlineGroup[]>;
    const widths = groups['outline-w'][0].outline;
    const styles = groups['outline-style'][0].outline;

    groups['outline-w'] = [{ outline: widths.filter((value) => value !== '') }];
    groups['outline-style'] = [{ outline: [...styles, ''] }];

    return config;
});

/**
 * Merges multiple class names into a single string, handling Tailwind CSS conflicts.
 * @param inputs - The class names or expressions to merge.
 * @returns A merged string of class names.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
