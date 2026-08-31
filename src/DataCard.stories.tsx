import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataCard } from './DataCard';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';

const meta = {
    title: 'Foundational/DataCard',
    component: DataCard,
    parameters: { layout: 'padded' },
    args: {
        title: 'Repository',
        action: <Button size="sm" variant="secondary">Edit</Button>,
        children: <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Card body with the default padding.</p>,
    },
} satisfies Meta<typeof DataCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoPadding: Story = { args: { noPadding: true, children: <div className="p-2 text-sm">Padding is the caller's job here.</div> } };

/** The common shape: a card that holds a form. */
export const WithForm: Story = {
    args: {
        title: 'New backup job',
        action: <Button size="sm">Save</Button>,
        children: (
            <div className="space-y-4 max-w-lg">
                <Input label="Name" placeholder="Nightly /etc" />
                <Select label="Schedule" options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }]} />
                <Input label="Namespace" hint="Leave empty for the repository root." placeholder="clients/web" />
            </div>
        ),
    },
};
