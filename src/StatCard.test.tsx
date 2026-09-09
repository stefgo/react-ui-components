import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Activity } from 'lucide-react';
import { StatCard } from './StatCard';

describe('StatCard', () => {
    it('exposes the selection as a pressed state, not just as a ring', () => {
        render(<StatCard label="Snapshots" value="12" icon={Activity} onClick={vi.fn()} selected />);
        // Without aria-pressed a screen reader announces three identical
        // buttons and never says which one the view is currently showing.
        expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });

    it('reports an unselected clickable card as not pressed', () => {
        render(<StatCard label="Snapshots" value="12" icon={Activity} onClick={vi.fn()} selected={false} />);
        expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    });

    it('leaves a card without a selection model unmarked', () => {
        render(<StatCard label="Snapshots" value="12" icon={Activity} onClick={vi.fn()} />);
        // A card that is merely clickable is not a toggle, so claiming an
        // unpressed state would be a lie.
        expect(screen.getByRole('button')).not.toHaveAttribute('aria-pressed');
    });

    it('stays a plain container when it does nothing', () => {
        render(<StatCard label="Snapshots" value="12" icon={Activity} selected />);
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('activates by keyboard', async () => {
        const onClick = vi.fn();
        render(<StatCard label="Snapshots" value="12" icon={Activity} onClick={onClick} />);
        await userEvent.tab();
        await userEvent.keyboard('{Enter}');
        expect(onClick).toHaveBeenCalledOnce();
    });
});
