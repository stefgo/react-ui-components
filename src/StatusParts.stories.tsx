import type { Meta, StoryObj } from '@storybook/react-vite';
import { Monitor, Plus } from 'lucide-react';
import { StatusDot } from './StatusDot';
import { LoadingIndicator } from './LoadingIndicator';
import { EmptyState } from './EmptyState';
import { ConnectionBanner } from './ConnectionBanner';
import { Button } from './Button';

const meta = {
    title: 'Foundational/Status',
    component: StatusDot,
    args: { tone: 'success' },
} satisfies Meta<typeof StatusDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Every tone, first with its default pulse, then with the pulse turned off. */
export const Tones: Story = {
    render: () => (
        <div className="space-y-3">
            {([undefined, false] as const).map((pulse) => (
                <div key={String(pulse)} className="flex items-center gap-4 text-sm text-text-secondary">
                    {(['success', 'warning', 'info', 'error', 'accent', 'neutral', 'unknown'] as const).map((tone) => (
                        <span key={tone} className="flex items-center gap-2">
                            <StatusDot tone={tone} pulse={pulse} size="md" label={tone} />
                            {tone}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    ),
};

export const Loading: Story = {
    render: () => <LoadingIndicator label="Loading clients…" />,
};

export const Empty: Story = {
    render: () => (
        <EmptyState
            icon={Monitor}
            title="No clients registered yet"
            description="A client appears here once its agent has connected with a registration token."
            action={<Button size="sm" icon={Plus}>Add Client</Button>}
        />
    ),
};

export const Disconnected: Story = {
    render: () => <ConnectionBanner connected={false} />,
};
