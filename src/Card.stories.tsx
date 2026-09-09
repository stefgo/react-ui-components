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
        padding: 'md',
        children: <p className="text-sm text-text-secondary">Card body.</p>,
    },
};

export const WithoutHeader: Story = {
    args: {
        padding: 'md',
        children: <p className="text-sm text-text-secondary">A card with no header at all.</p>,
    },
};

/** A rich header is the common case in dashboards — icon, title and status together. */
export const RichHeader: Story = {
    args: {
        title: <><HardDrive size={18} aria-hidden /> Daily backup <Badge variant="success" size="sm">active</Badge></>,
        action: <Button size="sm">Run now</Button>,
        padding: 'md',
        children: <p className="text-sm text-text-secondary">Last run 4 minutes ago.</p>,
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
            <Card title="Recent activity" padding="md" action={<Button size="sm" variant="ghost">See all</Button>}>
                <p className="text-sm text-text-secondary">
                    Compare the corner radii and surfaces across these two.
                </p>
            </Card>
        </div>
    ),
};

/**
 * `padding="none"` hands the content area over to the child. A data view or a
 * file list brings its own scroll container and its own spacing, and has to sit
 * directly inside the card to fill it — a wrapper in between would swallow the
 * flex chain. This is what `DataCard` used to be.
 */
export const WithoutPadding: Story = {
    args: {
        title: 'Clients',
        padding: 'none',
        children: (
            <ul className="divide-y divide-border text-sm text-text-secondary">
                {['backup-01', 'backup-02', 'nas-fileserver'].map((name) => (
                    <li key={name} className="px-5 py-3">{name}</li>
                ))}
            </ul>
        ),
    },
};
