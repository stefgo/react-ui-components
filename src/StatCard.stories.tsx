import type { Meta, StoryObj } from '@storybook/react-vite';
import { Monitor, HardDrive, Server } from 'lucide-react';
import { StatCard } from './StatCard';

const meta = {
    title: 'Foundational/StatCard',
    component: StatCard,
    args: { label: 'Clients', value: '12', sub: '3 offline', icon: <Monitor size={20} /> },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = {};

/**
 * With `onClick` the card renders a real `<button>` — reachable by keyboard and
 * announced as an action. Tab onto it to see the focus ring.
 */
export const Clickable: Story = { args: { onClick: () => alert('clicked') } };

export const Row: Story = {
    render: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard label="Clients" value="12" sub="3 offline" icon={<Monitor size={20} />} onClick={() => {}} />
            <StatCard label="Jobs" value="48" sub="Configurations" icon={<HardDrive size={20} />} onClick={() => {}} />
            <StatCard label="Snapshots" value="1204" sub="Available backups" icon={<Server size={20} />} onClick={() => {}} />
        </div>
    ),
};

/** Long values must not break the layout. */
export const LongContent: Story = {
    args: { label: 'Total transferred this month', value: '1 284 902 GiB', sub: 'Across all repositories and clients' },
};
