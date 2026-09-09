import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta = {
    title: 'Forms/Textarea',
    component: Textarea,
    args: { label: 'Notes', placeholder: 'Optional' }
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
    render: (args) => (
        <div className="space-y-4 max-w-sm">
            <Textarea {...args} label="Empty" />
            <Textarea {...args} label="Filled" defaultValue="Runs nightly at 02:00, retention 14 days." />
            <Textarea {...args} label="Required" required />
            <Textarea {...args} label="Disabled" disabled defaultValue="Read only." />
            <Textarea {...args} label="With hint" hint="Shown on the client detail page." />
            <Textarea {...args} label="With error" error="Must be under 500 characters" />
        </div>
    )
};

/** `rows` sets the starting height; the user can still drag it taller. */
export const Rows: Story = {
    render: (args) => (
        <div className="space-y-4 max-w-sm">
            <Textarea {...args} label="rows=2" rows={2} />
            <Textarea {...args} label="rows=8" rows={8} />
        </div>
    )
};
