import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pencil, Trash2 } from 'lucide-react';
import { DataMultiView, DataMultiViewProps, ViewMode } from './DataMultiView';
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
        tableHeader: <span className="sr-only">Actions</span>,
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
    args: { data: clientTree, getChildren, treeExpanded: { all: true } },
};

export const Loading: Story = { args: { data: [], isLoading: true } };
export const Empty: Story = { args: { data: [], emptyMessage: 'No clients registered yet.' } };

/**
 * Every one of the three states — search, view mode and pagination — can be
 * taken over by the caller, and they all take the same shape. The view mode in
 * particular used to be locked to `localStorage`, so a caller could neither
 * preset it nor restore it from the URL.
 */
const ControlledDemo = (props: DataMultiViewProps<DemoClient>) => {
    const [view, setView] = useState<ViewMode>('list');
    const [query, setQuery] = useState('');

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
                <span>Owned by the page:</span>
                <code className="px-2 py-0.5 rounded bg-hover text-text-primary">{view}</code>
                <code className="px-2 py-0.5 rounded bg-hover text-text-primary">
                    {query ? `“${query}”` : 'no query'}
                </code>
                <Button size="sm" variant="secondary" onClick={() => setView('table')}>
                    Force table
                </Button>
            </div>
            <DataMultiView
                {...props}
                searchable
                searchPlaceholder="Search clients…"
                searchFilter={(c, q) => c.hostname.toLowerCase().includes(q.toLowerCase())}
                search={{ value: query, onChange: setQuery }}
                viewMode={{ value: view, onChange: setView }}
            />
        </div>
    );
};

export const ControlledState: Story = {
    render: (args) => <ControlledDemo {...(args as DataMultiViewProps<DemoClient>)} />,
};
