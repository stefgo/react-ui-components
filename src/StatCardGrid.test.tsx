import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Activity } from 'lucide-react';
import { StatCard } from './StatCard';
import { StatCardGrid } from './StatCardGrid';

// The preset is CommonJS; its plugin is called here with stand-ins to read the rules it emits.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const preset = require('../tailwind-preset.js');

const cards = (count: number) =>
    Array.from({ length: count }, (_, i) => <StatCard key={i} label={`Card ${i}`} value="1" icon={Activity} />);

/** The column counts the grid offers the preset, as the preset's selector reads them. */
const stepsOf = (ui: React.ReactElement) => {
    const { container } = render(ui);
    return container.querySelector('.ruic-stat-card-grid')?.getAttribute('data-columns') ?? null;
};

describe('StatCardGrid', () => {
    it('never leaves a single card alone on the last row', () => {
        // Five cards: stacked, 3 + 2, then 5 -- not 2 + 2 + 1, not 4 + 1.
        expect(stepsOf(<StatCardGrid>{cards(5)}</StatCardGrid>)).toBe('3 5');
        expect(stepsOf(<StatCardGrid>{cards(4)}</StatCardGrid>)).toBe('2 4');
        expect(stepsOf(<StatCardGrid>{cards(3)}</StatCardGrid>)).toBe('3');
        expect(stepsOf(<StatCardGrid>{cards(2)}</StatCardGrid>)).toBe('2');
    });

    it('stacks a single card, with no step to offer', () => {
        expect(stepsOf(<StatCardGrid>{cards(1)}</StatCardGrid>)).toBeNull();
    });

    it('stops at the widest step the preset has', () => {
        // Seven cards: 4 + 3 and 5 + 2 qualify; 7 across would need a step the preset lacks.
        expect(stepsOf(<StatCardGrid>{cards(7)}</StatCardGrid>)).toBe('4 5');
    });

    it('does not count a card that is not rendered', () => {
        const hidden = false;
        expect(stepsOf(
            <StatCardGrid>
                {cards(4)}
                {hidden && <StatCard label="Hidden" value="0" icon={Activity} />}
            </StatCardGrid>
        )).toBe('2 4');
    });

    it('puts the caller\'s attributes on the outer element', () => {
        const { container } = render(<StatCardGrid className="mb-2" aria-label="Summary">{cards(2)}</StatCardGrid>);
        const outer = container.firstElementChild!;
        expect(outer).toHaveAttribute('aria-label', 'Summary');
        expect(outer).toHaveClass('mb-2');
    });
});

describe('the preset\'s column steps', () => {
    const emitted = () => {
        let rules: Record<string, Record<string, Record<string, string>>> = {};
        preset.plugins[0]({
            addBase: () => {},
            addUtilities: () => {},
            addComponents: (r: typeof rules) => { rules = { ...rules, ...r }; },
        });
        return Object.entries(rules);
    };

    it('starts a step where n cards of 15rem and the gaps between them fit', () => {
        const five = emitted().find(([, body]) => '.ruic-stat-card-grid[data-columns~="5"]' in body);
        // 5 × 15rem + 4 × 1rem.
        expect(five?.[0]).toBe('@container ruic-stat-card-grid (min-width: 79rem)');
    });

    it('emits the wider steps after the narrower ones, so the wider one wins', () => {
        // Five cards in a wide row match the step for 3 and the one for 5; the later rule decides.
        const widths = emitted().map(([query]) => Number(/min-width: (\d+)rem/.exec(query)?.[1]));
        expect(widths).toEqual([...widths].sort((a, b) => a - b));
        expect(widths).toHaveLength(5);
    });
});
