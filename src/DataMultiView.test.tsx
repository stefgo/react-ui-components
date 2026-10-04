import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import type { RowKey } from './data/types';
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

    describe('selection', () => {
        const nameColumns: DataColumnDef<Row>[] = [{ header: 'Name', accessorKey: 'name' }];
        const rowLabel = (row: Row) => `Select ${row.name}`;
        const actions = (selected: ReadonlySet<RowKey>) => <button type="button">Update {selected.size}</button>;

        it('has no checkbox and no selection line unless asked', () => {
            render(<DataMultiView data={data} keyField="id" columns={nameColumns} />);
            expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
        });

        it('picks a row, counts it and offers the actions only then', async () => {
            const user = userEvent.setup();
            render(<DataMultiView data={data} keyField="id" columns={nameColumns} selection={{ rowLabel }} selectionActions={actions} />);

            expect(screen.queryByRole('button', { name: /Update/ })).not.toBeInTheDocument();
            await user.click(screen.getByRole('checkbox', { name: 'Select alpha' }));

            expect(screen.getByRole('checkbox', { name: 'Select alpha' })).toBeChecked();
            expect(screen.getByRole('checkbox', { name: '1 selected' })).toBePartiallyChecked();
            expect(screen.getByRole('button', { name: 'Update 1' })).toBeInTheDocument();
        });

        it('does not open the row that is picked', async () => {
            const user = userEvent.setup();
            const onRowClick = vi.fn();
            render(<DataMultiView data={data} keyField="id" columns={nameColumns} selection={{ rowLabel }} onRowClick={onRowClick} />);

            await user.click(screen.getByRole('checkbox', { name: 'Select alpha' }));
            expect(onRowClick).not.toHaveBeenCalled();
        });

        it('selects all the search leaves, on every page, and clears them again', async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            const many: Row[] = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: i < 3 ? `web-${i}` : `db-${i}`, size: i }));
            render(
                <DataMultiView
                    data={many}
                    keyField="id"
                    columns={nameColumns}
                    selection={{ onChange }}
                    pagination={{ defaultValue: { pageSize: 2 } }}
                    searchable
                    searchFilter={(row, q) => row.name.includes(q)}
                    search={{ defaultValue: 'web' }}
                />,
            );

            await user.click(screen.getByRole('checkbox', { name: 'Select all' }));
            // Three match, two are on the page.
            expect([...onChange.mock.lastCall![0]]).toEqual([1, 2, 3]);
            expect(screen.getByRole('checkbox', { name: '3 selected' })).toBeChecked();

            await user.click(screen.getByRole('checkbox', { name: '3 selected' }));
            expect([...onChange.mock.lastCall![0]]).toEqual([]);
        });

        it('leaves out the rows that cannot be picked', async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            render(
                <DataMultiView
                    data={data}
                    keyField="id"
                    columns={nameColumns}
                    selection={{ rowLabel, onChange, isSelectable: (row) => row.name !== 'beta' }}
                />,
            );

            expect(screen.queryByRole('checkbox', { name: 'Select beta' })).not.toBeInTheDocument();
            await user.click(screen.getByRole('checkbox', { name: 'Select all' }));
            expect([...onChange.mock.lastCall![0]]).toEqual([2]);
        });

        it('keeps the selection when the view changes, and shows it in the list', async () => {
            const user = userEvent.setup();
            render(<DataMultiView data={data} keyField="id" columns={nameColumns} selection={{ rowLabel }} />);

            await user.click(screen.getByRole('checkbox', { name: 'Select alpha' }));
            await user.click(screen.getByRole('button', { name: 'List View' }));

            expect(screen.queryByRole('table')).not.toBeInTheDocument();
            expect(screen.getByRole('checkbox', { name: 'Select alpha' })).toBeChecked();
            expect(screen.getByRole('checkbox', { name: 'Select beta' })).not.toBeChecked();
        });

        it('shows what a caller that owns the selection hands it', async () => {
            const user = userEvent.setup();
            const Owner = () => {
                const [value, setValue] = useState<ReadonlySet<RowKey>>(new Set([1]));
                return <DataMultiView data={data} keyField="id" columns={nameColumns} selection={{ value, onChange: setValue, rowLabel }} />;
            };
            render(<Owner />);

            expect(screen.getByRole('checkbox', { name: 'Select beta' })).toBeChecked();
            await user.click(screen.getByRole('checkbox', { name: 'Select beta' }));
            expect(screen.getByRole('checkbox', { name: 'Select all' })).not.toBeChecked();
        });

        it('says what the selection amounts to in the caller\'s words', async () => {
            const user = userEvent.setup();
            render(
                <DataMultiView
                    data={data}
                    keyField="id"
                    columns={nameColumns}
                    selection={{ rowLabel, label: (selected) => `${selected.size * 2} containers selected` }}
                />,
            );

            await user.click(screen.getByRole('checkbox', { name: 'Select alpha' }));
            expect(screen.getByRole('checkbox', { name: '2 containers selected' })).toBeInTheDocument();
        });

        it('picks a child row of a tree by its own key', async () => {
            const user = userEvent.setup();
            interface Node { id: string; name: string; children?: Node[] }
            const tree: Node[] = [{ id: 'web', name: 'web', children: [{ id: 'web@a', name: 'host-a' }] }];
            const onChange = vi.fn();
            render(
                <DataMultiView
                    data={tree}
                    keyField="id"
                    tableDef={[{ tableHeader: 'Name', accessorKey: 'name' }]}
                    getChildren={(node) => node.children}
                    treeExpanded={{ all: true }}
                    selection={{ onChange, rowLabel: (node) => `Select ${node.name}` }}
                />,
            );

            const row = screen.getByText('host-a').closest('tr')!;
            await user.click(within(row).getByRole('checkbox', { name: 'Select host-a' }));
            expect([...onChange.mock.lastCall![0]]).toEqual(['web@a']);
            // "Select all" is about the root rows; one child does not make it partial.
            expect(screen.getByRole('checkbox', { name: '1 selected' })).not.toBePartiallyChecked();
        });
    });

    it('names the search field, so it can be found and focused', () => {
        render(<DataMultiView data={data} keyField="id" columns={columns} searchable searchPlaceholder="Search clients…" />);
        expect(screen.getByRole('searchbox', { name: 'Search clients…' })).toBeInTheDocument();
    });
});
