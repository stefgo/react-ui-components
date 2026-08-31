import type { Meta, StoryObj } from '@storybook/react-vite';
import { HardDrive } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { StatCard } from './StatCard';

const meta = {
    title: 'Foundational/Card',
    component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithHeader: Story = {
    args: {
        title: 'Backup jobs',
        action: <Button size="sm" variant="secondary">Refresh</Button>,
        children: <div className="p-5 text-sm text-text-secondary dark:text-text-secondary-dark">Card body.</div>,
    },
};

export const WithoutHeader: Story = {
    args: {
        children: <div className="p-5 text-sm text-text-secondary dark:text-text-secondary-dark">A card with no header at all.</div>,
    },
};

/** A rich header is the common case in dashboards — icon, title and status together. */
export const RichHeader: Story = {
    args: {
        title: <><HardDrive size={18} aria-hidden /> Daily backup <Badge variant="success" size="sm">active</Badge></>,
        action: <Button size="sm">Run now</Button>,
        children: <div className="p-5 text-sm text-text-secondary dark:text-text-secondary-dark">Last run 4 minutes ago.</div>,
    },
};

/**
 * Card and StatCard next to each other: today one is `rounded-xl` and the other
 * `rounded-xl`, but Button is `rounded-lg` and ActionMenu `rounded-md`. This is
 * the comparison that motivates the radius scale.
 */
export const AlongsideStatCards: Story = {
    render: () => (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                <StatCard label="Clients" value="12" sub="3 offline" icon={HardDrive} />
                <StatCard label="Jobs" value="48" sub="Configurations" icon={HardDrive} />
                <StatCard label="Snapshots" value="1204" sub="Available" icon={HardDrive} />
            </div>
            <Card title="Recent activity" action={<Button size="sm" variant="ghost">See all</Button>}>
                <div className="p-5 text-sm text-text-secondary dark:text-text-secondary-dark">
                    Compare the corner radii and surfaces across these two.
                </div>
            </Card>
        </div>
    ),
};
