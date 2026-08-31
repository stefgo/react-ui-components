import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Collapsible } from './Collapsible';

describe('Collapsible', () => {
    it('reports its expanded state and points at the content it controls', async () => {
        render(
            <Collapsible title="Advanced">
                <p>Body</p>
            </Collapsible>
        );

        const trigger = screen.getByRole('button', { name: /advanced/i });
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(trigger).toHaveAttribute('aria-controls');

        await userEvent.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    // jsdom does not implement inert's focus/a11y semantics, so this asserts the
    // attribute we control rather than the browser behaviour it triggers.
    it('marks collapsed content inert and releases it when expanded', async () => {
        render(
            <Collapsible title="Advanced">
                <button>Inner</button>
            </Collapsible>
        );

        const trigger = screen.getByRole('button', { name: /advanced/i });
        const content = document.getElementById(trigger.getAttribute('aria-controls')!)!;

        expect(content).toHaveAttribute('inert');
        expect(content).toContainElement(screen.getByRole('button', { name: 'Inner' }));

        await userEvent.click(trigger);
        expect(content).not.toHaveAttribute('inert');
    });

    it('does not submit a surrounding form', async () => {
        const onSubmit = vi.fn(e => e.preventDefault());
        render(
            <form onSubmit={onSubmit}>
                <Collapsible title="Advanced">
                    <p>Body</p>
                </Collapsible>
            </form>
        );

        await userEvent.click(screen.getByRole('button', { name: /advanced/i }));
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('defers to the caller when controlled', async () => {
        const onExpandedChange = vi.fn();
        render(
            <Collapsible title="Advanced" expanded={false} onExpandedChange={onExpandedChange}>
                <p>Body</p>
            </Collapsible>
        );

        const trigger = screen.getByRole('button', { name: /advanced/i });
        await userEvent.click(trigger);

        expect(onExpandedChange).toHaveBeenCalledWith(true);
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
});
