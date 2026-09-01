import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { HardDrive, Play, Pencil, Trash2 } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card } from './Card';
import { Checkbox } from './Checkbox';
import { ConfirmDialog } from './ConfirmDialog';
import { DataAction } from './DataAction';
import { DataTable, DataTableDef } from './DataTable';
import { Input } from './Input';
import { Modal } from './Modal';
import { Radio, RadioGroup } from './Radio';
import { Select } from './Select';
import { StatCard } from './StatCard';
import { Switch } from './Switch';
import { Textarea } from './Textarea';
import { Tooltip } from './Tooltip';
import { ToastProvider, useToast } from './toast/ToastProvider';
import { clients, DemoClient } from '../.storybook/fixtures';

const meta = {
    title: 'Composition/Client settings page'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const statusVariant = { online: 'success', degraded: 'warning', offline: 'error' } as const;

const Page = () => {
    const { show } = useToast();
    const [editing, setEditing] = useState<DemoClient | null>(null);
    const [deleting, setDeleting] = useState<DemoClient | null>(null);
    const [tunnel, setTunnel] = useState(true);
    const [schedule, setSchedule] = useState('daily');

    const columns: DataTableDef<DemoClient>[] = [
        { accessorKey: 'hostname', tableHeader: 'Host', sortable: true },
        {
            accessorKey: 'status',
            tableHeader: 'Status',
            sortable: true,
            tableItemRender: (c) => <Badge size="sm" variant={statusVariant[c.status]}>{c.status}</Badge>
        },
        { accessorKey: 'jobs', tableHeader: 'Jobs', sortable: true },
        { accessorKey: 'lastSeen', tableHeader: 'Last seen' },
        {
            tableHeader: <span className="sr-only">Actions</span>,
            tableCellClassName: 'w-px',
            tableItemRender: (c) => (
                <DataAction
                    rowId={c.id}
                    actions={[{
                        icon: Play,
                        color: 'green',
                        tooltip: 'Run all jobs now',
                        onClick: () => show({ title: `Started ${c.hostname}`, variant: 'success' })
                    }]}
                    menuEntries={[
                        { label: 'Edit', icon: Pencil, onClick: () => setEditing(c) },
                        { label: 'Delete', icon: Trash2, variant: 'danger', onClick: () => setDeleting(c) }
                    ]}
                />
            )
        }
    ];

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Clients" value="12" sub="3 offline" icon={HardDrive} />
                <StatCard label="Jobs" value="48" sub="Configurations" icon={HardDrive} />
                <StatCard label="Snapshots" value="1204" sub="Available" icon={HardDrive} />
            </div>

            <Card
                title="Defaults for new clients"
                action={
                    <Tooltip content="Applies only to clients registered from now on">
                        <Button size="sm" variant="secondary" onClick={() => show({ title: 'Defaults saved', variant: 'success' })}>
                            Save
                        </Button>
                    </Tooltip>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Input label="Repository" defaultValue="pbs://backup.local:8007" hint="Include the scheme." />
                        <Select
                            label="Retention"
                            hint="Applied after every successful run."
                            options={[
                                { value: '7', label: 'Keep 7 daily' },
                                { value: '14', label: 'Keep 14 daily' },
                                { value: '30', label: 'Keep 30 daily' }
                            ]}
                        />
                        <Textarea label="Notes" rows={3} placeholder="Optional" />
                    </div>

                    <div className="space-y-5">
                        <RadioGroup label="Schedule" value={schedule} onChange={setSchedule}>
                            <Radio value="daily" label="Daily" />
                            <Radio value="weekly" label="Weekly" />
                            <Radio value="monthly" label="Monthly" />
                        </RadioGroup>
                        <Switch
                            label="Reverse tunnel"
                            hint="Takes effect the next time the agent connects."
                            value={tunnel}
                            onChange={setTunnel}
                        />
                        <Checkbox label="Notify on failure" defaultChecked />
                        <Checkbox label="Verify after backup" hint="Slower, but catches a broken chunk early." />
                    </div>
                </div>
            </Card>

            <Card title="Clients" padding="none">
                <DataTable
                    data={clients}
                    keyField="id"
                    itemDef={columns}
                    className="rounded-none border-0 shadow-none"
                    pagination={{ defaultValue: { pageSize: 5 }, pageSizeOptions: [5, 10] }}
                    sort={{ defaultValue: [{ colIndex: 0, direction: 'asc' }] }}
                />
            </Card>

            <Modal
                isOpen={editing !== null}
                onClose={() => setEditing(null)}
                title={`Edit ${editing?.hostname ?? ''}`}
                description="Changes take effect on the next run."
                closeOnOverlayClick={false}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
                        <Button onClick={() => {
                            show({ title: `${editing?.hostname} saved`, variant: 'success' });
                            setEditing(null);
                        }}>Save</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Input label="Hostname" defaultValue={editing?.hostname} />
                    <Checkbox label="Enabled" defaultChecked />
                </div>
            </Modal>

            <ConfirmDialog
                isOpen={deleting !== null}
                onClose={() => setDeleting(null)}
                onConfirm={() => {
                    show({ title: `${deleting?.hostname} deleted`, variant: 'error', action: { label: 'Undo', onClick: () => {} } });
                    setDeleting(null);
                }}
                title={`Delete ${deleting?.hostname}?`}
                description="The client and its jobs are removed. Snapshots are kept."
                confirmLabel="Delete"
                variant="danger"
            />
        </div>
    );
};

/**
 * The proof that the parts add up to a system rather than a collection.
 *
 * Everything here comes from the library and nothing is styled locally: the
 * spacing, radii and colours line up because they come from one scale, and the
 * form controls line up because they share one `FormField`.
 *
 * Worth trying: run a job (toast), open the row menu and edit (modal, focus
 * trap, Escape), then delete (confirm dialog, then a toast with an undo action).
 */
export const ClientSettings: Story = {
    render: () => (
        <ToastProvider>
            <Page />
        </ToastProvider>
    )
};
