import type { Meta, StoryObj } from '@storybook/react-vite';
import { Search, Server } from 'lucide-react';
import { Input } from './Input';
import { Select } from './Select';

const meta = {
    title: 'Foundational/Input',
    component: Input,
    args: { label: 'Repository', placeholder: 'backup@pbs.example.com' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Error, hint and required are the states that carry the ARIA wiring. */
export const States: Story = {
    render: () => (
        <div className="max-w-md space-y-6">
            <Input label="Default" placeholder="Enter a value" />
            <Input label="With hint" placeholder="8007" hint="Leave empty to use the default port." />
            <Input label="With error" defaultValue="not-a-port" error="Must be a number between 1 and 65535." />
            <Input label="Required" required placeholder="Cannot be empty" />
            <Input label="With icon" icon={Search} placeholder="Search clients" />
            <Input label="Disabled" disabled defaultValue="Read only" />
        </div>
    ),
};

/**
 * The reason `Input` was moved onto the `input-bg` token: the two controls sit
 * next to each other constantly and used to render different backgrounds.
 */
export const NextToSelect: Story = {
    render: () => (
        <div className="max-w-md grid grid-cols-2 gap-4">
            <Input label="Host" icon={Server} placeholder="pbs.example.com" />
            <Select
                label="Schedule"
                options={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                ]}
            />
        </div>
    ),
};
