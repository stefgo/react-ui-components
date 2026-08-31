import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataTreeTable, DataTreeTableProps } from './DataTreeTable';
import { DataTableDef } from './DataTable';
import { Badge } from './Badge';
import { clientTree, getChildren, DemoClient } from '../.storybook/fixtures';

const statusVariant = { online: 'success', degraded: 'warning', offline: 'error' } as const;

const columns: DataTableDef<DemoClient>[] = [
    { accessorKey: 'hostname', tableHeader: 'Path', sortable: true },
    {
        accessorKey: 'status',
        tableHeader: 'Status',
        tableItemRender: (c) => <Badge size="sm" variant={statusVariant[c.status]}>{c.status}</Badge>,
    },
    { accessorKey: 'jobs', tableHeader: 'Jobs', sortable: true },
    { accessorKey: 'lastSeen', tableHeader: 'Last seen' },
];

const ClientTree = (props: DataTreeTableProps<DemoClient>) => <DataTreeTable {...props} />;

const meta = {
    title: 'Data/DataTreeTable',
    component: ClientTree,
    parameters: { layout: 'padded' },
    args: { data: clientTree, keyField: 'id', itemDef: columns, getChildren },
} satisfies Meta<typeof ClientTree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {};
export const Expanded: Story = { args: { expanded: { all: true } } };
export const DeepIndent: Story = { args: { expanded: { all: true }, indentSize: 40 } };

/** Paging applies to root nodes; the children of a visible root come along with it. */
export const Paginated: Story = {
    args: { expanded: { all: true }, pagination: { defaultValue: { pageSize: 2 } } },
};

export const Empty: Story = { args: { data: [], emptyMessage: 'No archives configured.' } };
