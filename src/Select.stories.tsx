import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const options = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'never', label: 'Never', disabled: true },
];

const meta = {
    title: 'Foundational/Select',
    component: Select,
    args: { label: 'Schedule', options },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
    render: (args) => (
        <div className="max-w-md space-y-6">
            <Select {...args} label="Default" />
            <Select {...args} label="With error" error="Pick a schedule." />
            <Select {...args} label="Required" required />
            <Select {...args} label="Disabled" disabled />
        </div>
    ),
};
