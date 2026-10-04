import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataMultiView } from '../DataMultiView';
import { ACTIONS_GROUP, actionsColumn, listGroups, listPagination, PAGE_SIZE, treeActionsColumn } from './listLayout';
import { toListColumns } from './columns';
import type { DataColumnDef } from './columns';

interface Row {
    id: string;
    name: string;
}

const ROWS: Row[] = [{ id: 'a', name: 'web-01' }];

const columns = (actions: DataColumnDef<Row>): DataColumnDef<Row>[] => [
    { header: 'Name', accessorKey: 'name' },
    actions,
];

describe('listLayout', () => {
    it('puts the actions into a block of their own in the list view', () => {
        const actions = actionsColumn<Row>((row) => <button>Edit {row.name}</button>);
        const blocks = toListColumns(columns(actions), listGroups());

        // Two blocks, and the actions are alone in the second: a row whose
        // buttons sit among its fields is the layout this exists to prevent.
        expect(blocks).toHaveLength(2);
        expect(blocks[1].fields).toHaveLength(1);
        expect(actions.list).toMatchObject({ group: ACTIONS_GROUP, label: null });
    });

    it('renders the same buttons in the table and in the list', () => {
        const actions = actionsColumn<Row>((row) => <button>Edit {row.name}</button>);

        const { unmount } = render(
            <DataMultiView data={ROWS} keyField="id" columns={columns(actions)} listGroups={listGroups()} viewMode={{ value: 'table' }} />
        );
        expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Edit web-01' })).toBeInTheDocument();
        unmount();

        render(
            <DataMultiView data={ROWS} keyField="id" columns={columns(actions)} listGroups={listGroups()} viewMode={{ value: 'list' }} />
        );
        expect(screen.getByRole('button', { name: 'Edit web-01' })).toBeInTheDocument();
    });

    it('takes another heading for the actions column', () => {
        const actions = treeActionsColumn<Row>(() => null, { header: 'Aktionen' });
        expect(actions.header).toBe('Aktionen');
    });

    it('hides the pagination bar while one page holds everything', () => {
        expect(listPagination(PAGE_SIZE.embedded)).toEqual({
            defaultValue: { pageSize: 10 },
            hideOnSinglePage: true,
        });
    });
});
