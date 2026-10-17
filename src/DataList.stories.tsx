import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataList, DataListColumnDef, DataListProps } from './DataList';
import { Badge } from './Badge';
import { clients, DemoClient } from '../.storybook/fixtures';

const statusVariant = { online: 'success', degraded: 'warning', offline: 'error' } as const;

const columns: DataListColumnDef<DemoClient>[] = [
    {
        grow: true,
        fields: [
            { accessorKey: 'hostname', listLabel: null },
            { listLabel: 'Status', listItemRender: (c) => <Badge size="sm" variant={statusVariant[c.status]}>{c.status}</Badge> },
        ],
    },
    {
        fields: [
            { accessorKey: 'jobs', listLabel: 'Jobs' },
            { accessorKey: 'lastSeen', listLabel: 'Last seen' },
        ],
    },
];

const ClientList = (props: DataListProps<DemoClient>) => <DataList {...props} />;

const meta = {
    title: 'Data/DataList',
    component: ClientList,
    parameters: { layout: 'padded' },
    args: { data: clients, keyField: 'id', columns },
} satisfies Meta<typeof ClientList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Paginated: Story = { args: { pagination: { defaultValue: { pageSize: 4 } } } };
export const Loading: Story = { args: { data: [], isLoading: true } };
export const Empty: Story = { args: { data: [], emptyMessage: 'Nothing here yet.' } };
export const Clickable: Story = { args: { onRowClick: (c) => alert(c.hostname) } };

/**
 * Every value of a row starts at one edge, however long the labels are. The
 * labels' column is as wide as the longest of them, up to 40% of the row;
 * beyond that a label wraps, and so does a value that does not fit.
 */
export const LongLabels: Story = {
    args: {
        data: clients.slice(0, 3),
        columns: [
            {
                grow: true,
                fields: [
                    { accessorKey: 'hostname', listLabel: null },
                    { accessorKey: 'id', listLabel: 'ID' },
                    { accessorKey: 'lastSeen', listLabel: 'Last Auto-Update' },
                    { listLabel: 'A label long enough to wrap', listItemRender: (c) => `${c.jobs} jobs` },
                    { listLabel: 'Fingerprint', listItemRender: (c) => `sha256:${c.id.repeat(12)}` },
                ],
            },
        ],
    },
    decorators: [(Story) => <div className="max-w-sm"><Story /></div>],
};
