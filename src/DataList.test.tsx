import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataList, type DataListColumnDef } from './DataList';

interface Node {
    id: string;
    name: string;
    children?: Node[];
}

const data: Node[] = [
    { id: 'web', name: 'web', children: [{ id: 'web@a', name: 'host-a' }, { id: 'web@b', name: 'host-b' }] },
    { id: 'db', name: 'db' },
];

const columns: DataListColumnDef<Node>[] = [{ fields: [{ accessorKey: 'name', listLabel: null }] }];
const getChildren = (node: Node) => node.children;

describe('DataList as a tree', () => {
    it('shows the roots and keeps the children behind an expand button', () => {
        render(<DataList data={data} keyField="id" columns={columns} getChildren={getChildren} />);

        expect(screen.getByText('web')).toBeInTheDocument();
        expect(screen.getByText('db')).toBeInTheDocument();
        expect(screen.queryByText('host-a')).not.toBeInTheDocument();
        // Only the row that has children can be expanded; the leaf offers nothing.
        expect(screen.getAllByRole('button', { name: 'Expand row' })).toHaveLength(1);
    });

    it('opens and closes a row from the keyboard and says which it is', async () => {
        const user = userEvent.setup();
        render(<DataList data={data} keyField="id" columns={columns} getChildren={getChildren} />);

        const toggle = screen.getByRole('button', { name: 'Expand row' });
        expect(toggle).toHaveAttribute('aria-expanded', 'false');
        toggle.focus();
        await user.keyboard('{Enter}');

        expect(screen.getByText('host-a')).toBeInTheDocument();
        expect(screen.getByText('host-b')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Collapse row' })).toHaveAttribute('aria-expanded', 'true');

        await user.keyboard('{Enter}');
        expect(screen.queryByText('host-a')).not.toBeInTheDocument();
    });

    it('does not open the row when it is expanded', async () => {
        const user = userEvent.setup();
        const onRowClick = vi.fn();
        render(<DataList data={data} keyField="id" columns={columns} getChildren={getChildren} onRowClick={onRowClick} />);

        await user.click(screen.getByRole('button', { name: 'Expand row' }));
        expect(onRowClick).not.toHaveBeenCalled();

        await user.click(screen.getByText('host-a'));
        expect(onRowClick).toHaveBeenCalledWith(data[0].children![0]);
    });

    it('takes its expansion from outside when it is given one', () => {
        render(
            <DataList
                data={data}
                keyField="id"
                columns={columns}
                getChildren={getChildren}
                expanded={{ value: new Set(['web']), onChange: () => {} }}
            />,
        );
        expect(screen.getByText('host-a')).toBeInTheDocument();
    });

    it('stays a flat list without getChildren', () => {
        render(<DataList data={data} keyField="id" columns={columns} />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
});
