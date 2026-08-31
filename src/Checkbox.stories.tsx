import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta = {
    title: 'Forms/Checkbox',
    component: Checkbox,
    args: { label: 'Run on weekends' }
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
    render: (args) => (
        <div className="space-y-3">
            <Checkbox {...args} label="Unchecked" />
            <Checkbox {...args} label="Checked" defaultChecked />
            <Checkbox {...args} label="Indeterminate" indeterminate />
            <Checkbox {...args} label="Disabled" disabled />
            <Checkbox {...args} label="Disabled and checked" disabled defaultChecked />
            <Checkbox {...args} label="Required" required />
        </div>
    )
};

export const WithMessages: Story = {
    render: (args) => (
        <div className="space-y-4 max-w-sm">
            <Checkbox {...args} label="Notify me" hint="One mail per failed job, at most." />
            <Checkbox {...args} label="Accept the terms" error="Required to continue" />
        </div>
    )
};

const SelectAllDemo = () => {
    const items = ['pbs-node-01', 'pbs-node-02', 'pbs-node-03'];
    const [selected, setSelected] = useState<string[]>([items[0]]);

    const all = selected.length === items.length;
    const some = selected.length > 0 && !all;

    return (
        <div className="space-y-3">
            <Checkbox
                label="Select all"
                checked={all}
                // Neither on nor off: saying "unchecked" here would claim that
                // nothing is selected, which is not what the list shows.
                indeterminate={some}
                onChange={() => setSelected(all ? [] : items)}
            />
            <div className="pl-6 space-y-2 border-l border-border">
                {items.map((item) => (
                    <Checkbox
                        key={item}
                        label={item}
                        checked={selected.includes(item)}
                        onChange={(e) => setSelected((prev) =>
                            e.target.checked ? [...prev, item] : prev.filter((i) => i !== item)
                        )}
                    />
                ))}
            </div>
        </div>
    );
};

/** What the third state is actually for. */
export const SelectAll: Story = { render: () => <SelectAllDemo /> };
