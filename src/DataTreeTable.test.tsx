import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTreeTable } from './DataTreeTable';

interface Node {
    id: number;
    name: string;
    children?: Node[];
}

const data: Node[] = [
    { id: 1, name: 'parent', children: [{ id: 2, name: 'child' }] },
    { id: 3, name: 'leaf' },
];

const itemDef = [{ tableHeader: 'Name', accessorKey: 'name' as const, sortable: true }];

const renderTree = (onRowClick?: (item: Node) => void) =>
    render(
        <DataTreeTable
            data={data}
            keyField="id"
            itemDef={itemDef}
            getChildren={(item) => item.children}
            onRowClick={onRowClick}
        />
    );

describe('DataTreeTable', () => {
    it('expands a row from the keyboard and says so', async () => {
        renderTree();

        const chevron = screen.getByRole('button', { name: 'Expand row' });
        expect(chevron).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByText('child')).not.toBeInTheDocument();

        chevron.focus();
        await userEvent.keyboard('{Enter}');

        expect(screen.getByText('child')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Collapse row' })).toHaveAttribute('aria-expanded', 'true');
    });

    it('gives a leaf no control at all', () => {
        renderTree();

        // One expandable row, so exactly one row chevron — the leaf must not
        // contribute a disabled button that announces nothing.
        expect(screen.getAllByRole('button', { name: /row$/ })).toHaveLength(1);
    });

    it('expands everything from the header toggle', async () => {
        renderTree();

        const toggleAll = screen.getByRole('button', { name: 'Expand all rows' });
        expect(toggleAll).toHaveAttribute('aria-expanded', 'false');

        toggleAll.focus();
        await userEvent.keyboard('{Enter}');

        expect(screen.getByText('child')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Collapse all rows' })).toHaveAttribute('aria-expanded', 'true');
    });

    it('separates expanding a row from opening it', async () => {
        const onRowClick = vi.fn();
        renderTree(onRowClick);

        await userEvent.click(screen.getByRole('button', { name: 'Expand row' }));

        expect(screen.getByText('child')).toBeInTheDocument();
        expect(onRowClick).not.toHaveBeenCalled();
    });

    it('sorts from the header button, keyboard included', async () => {
        renderTree();

        const header = screen.getByRole('button', { name: /Name/ });
        header.focus();
        await userEvent.keyboard('{Enter}');

        expect(screen.getAllByRole('columnheader')[0]).toHaveAttribute('aria-sort', 'ascending');
    });
});
