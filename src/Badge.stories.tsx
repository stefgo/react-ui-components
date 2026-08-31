import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = {
    title: 'Foundational/Badge',
    component: Badge,
    argTypes: {
        variant: { control: 'inline-radio', options: ['success', 'warning', 'error', 'info', 'neutral'] },
        size: { control: 'inline-radio', options: ['sm', 'md'] },
    },
    args: { children: 'online' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/**
 * Side by side this shows the open question in `gray`: its light background comes
 * from the `hover` role, its dark one from `button-secondary`. The other four
 * variants use one role for both.
 */
export const Variants: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-3">
            <Badge variant="success">online</Badge>
            <Badge variant="warning">degraded</Badge>
            <Badge variant="error">offline</Badge>
            <Badge variant="info">pending</Badge>
            <Badge variant="neutral">unknown</Badge>
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div className="flex items-center gap-3">
            <Badge size="sm" variant="success">sm</Badge>
            <Badge size="md" variant="success">md</Badge>
        </div>
    ),
};

/** Badges usually sit inline with text — this is where vertical rhythm shows. */
export const InContext: Story = {
    render: () => (
        <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
            Client <span className="font-medium text-text-primary dark:text-text-primary-dark">pbs-node-01</span>{' '}
            is <Badge variant="success" size="sm">online</Badge> and last ran 4 minutes ago.
        </p>
    ),
};
