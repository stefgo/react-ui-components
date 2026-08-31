import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio, RadioGroup } from './Radio';

const meta = {
    title: 'Forms/RadioGroup',
    component: RadioGroup,
    args: {
        label: 'Schedule',
        children: (
            <>
                <Radio value="daily" label="Daily" />
                <Radio value="weekly" label="Weekly" />
                <Radio value="monthly" label="Monthly" />
            </>
        )
    }
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { defaultValue: 'weekly' } };

export const Horizontal: Story = {
    args: { orientation: 'horizontal', defaultValue: 'daily' }
};

export const States: Story = {
    render: (args) => (
        <div className="space-y-6">
            <RadioGroup {...args} label="Required" required defaultValue="daily" />
            <RadioGroup {...args} label="With a hint" hint="Applies to every job on this client." />
            <RadioGroup {...args} label="With an error" error="Pick a schedule" />
            <RadioGroup {...args} label="Disabled" disabled defaultValue="weekly" />
        </div>
    )
};

const ControlledDemo = () => {
    const [value, setValue] = useState('daily');

    return (
        <div className="space-y-3">
            <RadioGroup label="Schedule" value={value} onChange={setValue}>
                <Radio value="daily" label="Daily" />
                <Radio value="weekly" label="Weekly" />
                <Radio value="monthly" label="Monthly" />
            </RadioGroup>
            <p className="text-sm text-text-muted">
                Owned by the page: <code className="px-1.5 py-0.5 rounded bg-hover text-text-primary">{value}</code>
            </p>
        </div>
    );
};

export const Controlled: Story = { render: () => <ControlledDemo /> };
