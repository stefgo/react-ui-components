import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pencil, Trash2, Play } from 'lucide-react';
import { DataTable, DataTableDef, DataTableProps } from './DataTable';
import { Badge } from './Badge';
import { DataAction } from './DataAction';
import { clients, DemoClient } from '../.storybook/fixtures';

const statusVariant = { online: 'success', degraded: 'warning', offline: 'error' } as const;

const columns: DataTableDef<DemoClient>[] = [
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
                actions={[{ icon: Play, tooltip: 'Run now', onClick: () => {} }]}
                menuEntries={[
                    { label: 'Edit', icon: Pencil, onClick: () => {} },
                    { label: 'Delete', icon: Trash2, onClick: () => {}, variant: 'danger' },
                ]}
            />
        ),
    },
];

// Storybook cannot infer through a generic component, so the stories target a
// concrete instantiation of it.
const ClientTable = (props: DataTableProps<DemoClient>) => <DataTable {...props} />;

const meta = {
    title: 'Data/DataTable',
    component: ClientTable,
    args: { data: clients, keyField: 'id', itemDef: columns },
    parameters: { layout: 'padded' },
} satisfies Meta<typeof ClientTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sorted: Story = {
    args: { sort: { defaultValue: [{ colIndex: 2, direction: 'desc' }] } },
};

export const Paginated: Story = {
    args: { pagination: { defaultValue: { pageSize: 5 }, pageSizeOptions: [5, 10, 20] } },
};

/** The three states that are usually an afterthought — and usually just text. */
export const Loading: Story = { args: { data: [], isLoading: true } };
export const Empty: Story = { args: { data: [] } };
export const NoResults: Story = {
    args: { filter: () => false, filterKey: 'zzz', noResultsMessage: 'No client matches "zzz".' },
};

/** Rows react to a click: the whole row becomes the target, not just a cell. */
export const Clickable: Story = {
    args: { onRowClick: (c: DemoClient) => alert(c.hostname) },
};
