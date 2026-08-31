import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pencil, Trash2 } from 'lucide-react';
import { DataMultiView, DataMultiViewProps } from './DataMultiView';
import { DataTableDef } from './DataTable';
import { DataListColumnDef } from './DataList';
import { Badge } from './Badge';
import { DataAction } from './DataAction';
import { Button } from './Button';
import { clients, clientTree, getChildren, DemoClient } from '../.storybook/fixtures';

const statusVariant = { online: 'success', degraded: 'warning', offline: 'error' } as const;

const tableDef: DataTableDef<DemoClient>[] = [
    { accessorKey: 'hostname', tableHeader: 'Host', sortable: true },
    {
        accessorKey: 'status',
        tableHeader: 'Status',
        sortable: true,
        tableItemRender: (c) => <Badge size="sm" variant={statusVariant[c.status]}>{c.status}</Badge>,
    },
    { accessorKey: 'jobs', tableHeader: 'Jobs', sortable: true },
    { accessorKey: 'lastSeen', tableHeader: 'Last seen' },
    {
        tableHeader: '',
        tableCellClassName: 'w-px',
        tableItemRender: (c) => (
            <DataAction
                rowId={c.id}
                menuEntries={[
                    { label: 'Edit', icon: Pencil, onClick: () => {} },
                    { label: 'Delete', icon: Trash2, onClick: () => {}, variant: 'danger' },
                ]}
            />
        ),
    },
];

const listColumns: DataListColumnDef<DemoClient>[] = [
    {
        grow: true,
        fields: [
            { accessorKey: 'hostname', listLabel: null },
            { listLabel: 'Status', listItemRender: (c) => <Badge size="sm" variant={statusVariant[c.status]}>{c.status}</Badge> },
        ],
    },
    { fields: [{ accessorKey: 'jobs', listLabel: 'Jobs' }, { accessorKey: 'lastSeen', listLabel: 'Last seen' }] },
];

// Storybook cannot infer through a generic component.
const ClientView = (props: DataMultiViewProps<DemoClient>) => <DataMultiView {...props} />;

const meta = {
    title: 'Data/DataMultiView',
    component: ClientView,
    parameters: { layout: 'padded' },
    args: {
        title: 'Managed clients',
        data: clients,
        keyField: 'id',
        tableDef,
        listColumns,
        pagination: { defaultValue: { pageSize: 5 }, pageSizeOptions: [5, 10, 20] },
    },
} satisfies Meta<typeof ClientView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSearch: Story = {
    args: {
        searchable: true,
        searchPlaceholder: 'Search clients…',
        searchFilter: (c: DemoClient, q: string) => c.hostname.toLowerCase().includes(q.toLowerCase()),
    },
};

export const WithHeaderActions: Story = {
    args: { extraActions: <Button size="sm">New client</Button> },
};

/** With `getChildren` the tree view becomes available and replaces the table toggle. */
export const TreeView: Story = {
    args: { data: clientTree, getChildren, treeTableDefaultExpanded: true },
};

export const Loading: Story = { args: { data: [], isLoading: true } };
export const Empty: Story = { args: { data: [], emptyMessage: 'No clients registered yet.' } };
