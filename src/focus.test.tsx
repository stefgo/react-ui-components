import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';
import { cn } from './utils';
import { FOCUS_RING, FOCUS_RING_ERROR, FOCUS_RING_INSET, FOCUS_RING_NONE, FOCUS_RING_PEER } from './focus';

/**
 * `cn` used to swallow the bare `outline` out of every one of these.
 *
 * tailwind-merge 3.x is built for Tailwind v4, where `outline` is a *width*;
 * on Tailwind v3 it is `outline-style: solid`. So it looked like a conflict
 * with `outline-2` and lost. Nothing failed and nothing looked empty -- the
 * ring still had a colour, a width and an offset, and `outline-style` simply
 * stayed `auto`, which makes the browser draw its own ring instead: two
 * strokes, the outer one white. On a dark surface, a white frame around the
 * orange one.
 *
 * Each constant is asserted whole. A ring that loses a part is still a ring,
 * and that is exactly why the bug survived so long.
 */
describe('focus constants survive cn()', () => {
    it.each([
        ['FOCUS_RING', FOCUS_RING],
        ['FOCUS_RING_INSET', FOCUS_RING_INSET],
        ['FOCUS_RING_PEER', FOCUS_RING_PEER],
        ['FOCUS_RING_ERROR', FOCUS_RING_ERROR],
        ['FOCUS_RING_NONE', FOCUS_RING_NONE],
    ])('%s passes through unchanged', (_name, ring) => {
        expect(cn(ring)).toBe(ring);
    });

    it('keeps the ring when it is merged with the classes around it', () => {
        // The real call shape: a component's own classes, then the ring, then
        // whatever the consumer passed.
        const merged = cn('rounded-md bg-card px-4', FOCUS_RING, 'text-sm');
        for (const part of FOCUS_RING.split(' ')) {
            expect(merged).toContain(part);
        }
    });

    it('still lets a later outline class win a genuine conflict', () => {
        expect(cn('outline-2', 'outline-4')).toBe('outline-4');
        expect(cn('outline-dashed', 'outline-dotted')).toBe('outline-dotted');
        expect(cn(FOCUS_RING, 'focus-visible:outline-none')).toContain('focus-visible:outline-none');
    });
});

/**
 * The conventions test resolves one level of indirection -- it sees that
 * `Button`'s `variants` table mentions a ring somewhere. It cannot see that
 * *every* entry does, and a table is exactly where one entry gets forgotten.
 * So this asks the rendered element instead.
 */
describe('Button draws a ring in every variant', () => {
    it.each([
        ['primary', 'focus-visible:outline-primary'],
        ['secondary', 'focus-visible:outline-primary'],
        ['ghost', 'focus-visible:outline-primary'],
        ['outline', 'focus-visible:outline-primary'],
        ['danger', 'focus-visible:outline-error'],
        ['outline-danger', 'focus-visible:outline-error'],
    ] as const)('%s', (variant, colourClass) => {
        render(<Button variant={variant}>Save</Button>);
        const classes = screen.getByRole('button', { name: 'Save' }).className;

        // The style matters as much as the colour: without the bare `outline`
        // the browser falls back to `outline-style: auto` and draws its own.
        expect(classes).toContain('focus-visible:outline ');
        expect(classes).toContain('focus-visible:outline-2');
        expect(classes).toContain('focus-visible:outline-offset-2');
        expect(classes).toContain(colourClass);
    });
});
