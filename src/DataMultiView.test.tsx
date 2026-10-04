import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataMultiView } from './DataMultiView';
import type { DataColumnDef } from './data/columns';

interface Row {
    id: number;
    name: string;
    size: number;
}

const data: Row[] = [
    { id: 1, name: 'beta', size: 3 },
    { id: 2, name: 'alpha', size: 1 },
];

const columns: DataColumnDef<Row>[] = [
    { header: 'Name', accessorKey: 'name', sortable: true },
    { header: 'Size', render: (row, view) => `${row.size} (${view})` },
    { header: 'ID', accessorKey: 'id', table: false },
];

afterEach(() => {
    vi.restoreAllMocks();
});

describe('DataMultiView', () => {
    it('builds the table from columns', () => {
        render(<DataMultiView data={data} keyField="id" columns={columns} />);

        expect(screen.getAllByRole('columnheader').map((th) => th.textContent)).toEqual(['Name', 'Size']);
        expect(screen.getByText('3 (table)')).toBeInTheDocument();
    });

    it('builds the list from the same columns', () => {
        render(<DataMultiView data={data} keyField="id" columns={columns} viewMode={{ value: 'list' }} />);

        expect(screen.queryByRole('table')).not.toBeInTheDocument();
        expect(screen.getByText('3 (list)')).toBeInTheDocument();
        // The column the table leaves out is a field here.
        expect(screen.getAllByText('ID:')).toHaveLength(data.length);
    });

    it('offers both views for columns alone', () => {
        render(<DataMultiView data={data} keyField="id" columns={columns} />);

        expect(screen.getByRole('button', { name: 'Table View' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'List View' })).toBeInTheDocument();
    });

    it('shows columns and says so when tableDef is passed next to them', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(
            <DataMultiView
                data={data}
                keyField="id"
                columns={columns}
                tableDef={[{ tableHeader: 'Legacy', accessorKey: 'name' }]}
            />,
        );

        expect(screen.queryByText('Legacy')).not.toBeInTheDocument();
        expect(warn).toHaveBeenCalledWith(expect.stringContaining('columns replaces tableDef'));
    });

    it('keeps the children of a tree in the list view', async () => {
        interface Node { id: string; name: string; children?: Node[] }
        const tree: Node[] = [{ id: 'web', name: 'web', children: [{ id: 'web@a', name: 'host-a' }] }];
        const treeColumns: DataColumnDef<Node>[] = [{ header: 'Name', accessorKey: 'name' }];

        render(
            <DataMultiView
                data={tree}
                keyField="id"
                columns={treeColumns}
                getChildren={(node) => node.children}
                treeExpanded={{ all: true }}
                viewMode={{ value: 'list' }}
            />,
        );

        // The list a narrow screen is shown instead of the tree table: a flat list
        // of the roots would have lost this row.
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
        expect(screen.getByText('host-a')).toBeInTheDocument();
    });
});
