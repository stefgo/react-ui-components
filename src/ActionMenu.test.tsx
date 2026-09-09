import { describe, it, expect, vi } from 'vitest';
import { useRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionMenu } from './ActionMenu';

/**
 * Menu semantics, Escape and arrow-key movement live in `useMenuBehavior` and
 * are covered through `DataAction`. What is tested here is what only
 * `ActionMenu` does: the portal, the gate that keeps it hidden until it has
 * been measured, and handing focus back to the trigger.
 */

const anchor = { top: 100, bottom: 120, left: 40, right: 90 };

const Harness = ({ onClose = vi.fn() }: { onClose?: () => void }) => {
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div data-testid="host">
            <button ref={triggerRef} type="button" onClick={() => setIsOpen(true)}>
                Open
            </button>
            <ActionMenu
                isOpen={isOpen}
                onClose={() => { setIsOpen(false); onClose(); }}
                anchor={anchor}
                triggerRef={triggerRef}
            >
                <button type="button" role="menuitem">Edit</button>
            </ActionMenu>
        </div>
    );
};

describe('ActionMenu', () => {
    it('renders nothing at all while closed', () => {
        render(
            <ActionMenu isOpen={false} onClose={vi.fn()} anchor={anchor}>
                <button type="button" role="menuitem">Edit</button>
            </ActionMenu>
        );

        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('escapes its parent through a portal', async () => {
        render(<Harness />);
        await userEvent.click(screen.getByRole('button', { name: 'Open' }));

        const menu = screen.getByRole('menu');
        // Rendered into the body, not into the host: a menu inside a scrolling
        // or overflow-hidden ancestor would be clipped by it.
        expect(menu.closest('[data-testid="host"]')).toBeNull();
        expect(document.body.contains(menu)).toBe(true);
    });

    it('is placed under the trigger and right-aligned before it is shown', async () => {
        render(<Harness />);
        await userEvent.click(screen.getByRole('button', { name: 'Open' }));

        const menu = screen.getByRole('menu');
        // Measured in a layout effect, so by the time the click settles the gate
        // has opened. `invisible` is the state before that, never a resting one.
        expect(menu).toHaveClass('visible');
        expect(menu).toHaveAttribute('tabindex', '-1');

        // Below the anchor's bottom by POPOVER_GAP, and aligned to its right
        // edge — the placement ActionMenu asks for, on top of the shared hook.
        expect(menu).toHaveStyle({ position: 'fixed', top: '128px', left: '90px' });
    });

    // The counterpart to the test below: focus goes back to the trigger on
    // close, but a menu that was never open must not touch focus at all. The
    // shared hook's restore effect runs on mount too, and the programmatic
    // focus it did there showed up as a :focus-visible ring on the trigger.
    it('leaves focus alone while it has never been opened', () => {
        render(<Harness />);
        expect(screen.getByRole('button', { name: 'Open' })).not.toHaveFocus();
        expect(document.body).toHaveFocus();
    });

    it('gives focus back to the trigger when it closes', async () => {
        render(<Harness />);
        const trigger = screen.getByRole('button', { name: 'Open' });
        await userEvent.click(trigger);

        await userEvent.keyboard('{Escape}');

        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        expect(trigger).toHaveFocus();
    });
});
