import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EntityHeader, type EntityDetail } from './EntityHeader';

const ALWAYS: EntityDetail[] = [{ label: 'Agent', value: 'v1.4.2', visibility: 'always' }];
const EXPANDED: EntityDetail[] = [{ label: 'Allowed IP', value: '192.168.1.0/24' }];

/** The element the toggle says it controls. */
const region = (toggle: HTMLElement) => document.getElementById(toggle.getAttribute('aria-controls')!)!;

describe('EntityHeader', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('renders the title as a heading, with meta and actions beside it', () => {
        render(
            <EntityHeader
                title="web-01"
                meta={<span>Inbound</span>}
                actions={<button>Menu</button>}
            />
        );

        expect(screen.getByRole('heading', { level: 2, name: 'web-01' })).toBeInTheDocument();
        expect(screen.getByText('Inbound')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
    });

    it('has no toggle when every detail is always visible', () => {
        render(<EntityHeader title="web-01" details={ALWAYS} />);

        expect(screen.getByText('v1.4.2')).toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('has no toggle and no details area without details', () => {
        render(<EntityHeader title="web-01" />);

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        expect(screen.queryByRole('term')).not.toBeInTheDocument();
    });

    it('puts an icon toggle in the row when every detail is collapsible', async () => {
        render(<EntityHeader title="web-01" details={EXPANDED} />);

        const toggle = screen.getByRole('button', { name: 'Details' });
        expect(toggle).toHaveAttribute('aria-expanded', 'false');
        expect(region(toggle)).toHaveAttribute('inert');
        expect(region(toggle)).toContainElement(screen.getByText('192.168.1.0/24'));

        await userEvent.click(toggle);
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
        expect(region(toggle)).not.toHaveAttribute('inert');
    });

    it('offers "Show more" under the visible details when both kinds are mixed', async () => {
        render(<EntityHeader title="web-01" details={[...EXPANDED, ...ALWAYS]} />);

        expect(screen.queryByRole('button', { name: 'Details' })).not.toBeInTheDocument();
        const toggle = screen.getByRole('button', { name: /show more/i });
        // The always-visible detail sits outside the region the toggle hides.
        expect(region(toggle)).not.toContainElement(screen.getByText('v1.4.2'));
        expect(region(toggle)).toContainElement(screen.getByText('192.168.1.0/24'));

        await userEvent.click(toggle);
        expect(toggle).toHaveAccessibleName(/show less/i);
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
    });

    it('keeps the alert outside the collapsed part', () => {
        render(
            <EntityHeader title="web-01" details={EXPANDED} alert={<p>Two containers conflict</p>} />
        );

        const toggle = screen.getByRole('button', { name: 'Details' });
        expect(region(toggle)).not.toContainElement(screen.getByText('Two containers conflict'));
    });

    it('defers to the caller when controlled', async () => {
        const onChange = vi.fn();
        render(<EntityHeader title="web-01" details={EXPANDED} value={false} onChange={onChange} />);

        const toggle = screen.getByRole('button', { name: 'Details' });
        await userEvent.click(toggle);
        expect(onChange).toHaveBeenCalledWith(true);
        expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });

    it('remembers the open state when asked to', async () => {
        const persist = { key: 'entity.details', scope: 'local' } as const;
        const { unmount } = render(<EntityHeader title="web-01" details={EXPANDED} persist={persist} />);

        await userEvent.click(screen.getByRole('button', { name: 'Details' }));
        expect(localStorage.getItem('entity.details')).toBe('true');
        unmount();

        render(<EntityHeader title="web-01" details={EXPANDED} persist={persist} />);
        expect(screen.getByRole('button', { name: 'Details' })).toHaveAttribute('aria-expanded', 'true');
    });
});
