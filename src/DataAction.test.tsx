import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pencil, Trash2 } from 'lucide-react';
import { DataAction } from './DataAction';

const renderMenu = (onEdit = vi.fn(), onDelete = vi.fn()) => {
    render(
        <DataAction
            rowId="row-1"
            menuEntries={[
                { label: 'Edit', icon: Pencil, onClick: onEdit },
                { label: 'Delete', icon: Trash2, onClick: onDelete, variant: 'danger' },
            ]}
        />
    );
};

const openMenu = async () => {
    const trigger = screen.getByRole('button', { name: 'More actions' });
    await userEvent.click(trigger);
    return trigger;
};

describe('DataAction', () => {
    it('exposes the overflow menu with menu semantics', async () => {
        renderMenu();
        const trigger = await openMenu();

        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
        expect(screen.getByRole('menu')).toBeInTheDocument();
        expect(screen.getAllByRole('menuitem')).toHaveLength(2);
    });

    it('moves focus into the menu and back to the trigger on Escape', async () => {
        renderMenu();
        const trigger = await openMenu();

        expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();

        await userEvent.keyboard('{Escape}');

        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        expect(trigger).toHaveFocus();
    });

    it('navigates entries with the arrow keys and wraps around', async () => {
        renderMenu();
        await openMenu();

        await userEvent.keyboard('{ArrowDown}');
        expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();

        await userEvent.keyboard('{ArrowDown}');
        expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();

        await userEvent.keyboard('{ArrowUp}');
        expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    });

    it('runs the entry and closes the menu', async () => {
        const onEdit = vi.fn();
        renderMenu(onEdit);
        await openMenu();

        await userEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));

        expect(onEdit).toHaveBeenCalledOnce();
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('closes when clicking outside', async () => {
        renderMenu();
        await openMenu();

        await userEvent.click(document.body);

        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
});
