import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper } from './Stepper';

const steps = [
    { id: 'mode', label: 'Connection' },
    { id: 'agent', label: 'Agent' },
    { id: 'ssh', label: 'SSH tunnel' },
    { id: 'verify', label: 'Verify' }
];

const meta = {
    title: 'Foundational/Stepper',
    component: Stepper,
    args: { steps, current: 1 },
    parameters: { layout: 'padded' }
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** The three states side by side: done, current, upcoming. */
export const AllStates: Story = {
    render: (args) => (
        <div className="space-y-8">
            {[0, 2, steps.length - 1].map((current) => (
                <Stepper {...args} key={current} current={current} />
            ))}
        </div>
    )
};

export const WithDescriptions: Story = {
    args: {
        steps: steps.map((s, i) => ({ ...s, description: `Step ${i + 1} of ${steps.length}` }))
    }
};

export const Vertical: Story = {
    args: { orientation: 'vertical', current: 2 },
    render: (args) => (
        <div className="max-w-xs">
            <Stepper {...args} />
        </div>
    )
};

const Selectable = (args: React.ComponentProps<typeof Stepper>) => {
    const [current, setCurrent] = useState(3);
    return (
        <div className="space-y-4">
            <Stepper {...args} current={current} onStepSelect={setCurrent} />
            <p className="text-sm text-text-muted">
                Completed steps are buttons; the current and upcoming ones are not controls at all.
            </p>
        </div>
    );
};

/** With `onStepSelect` the finished steps become the way back. */
export const CompletedStepsAreClickable: Story = {
    render: (args) => <Selectable {...args} />
};

/** A long label must not push the connector off the row. */
export const LongLabels: Story = {
    args: {
        current: 1,
        steps: [
            { id: 'a', label: 'Choose how the client and the server reach each other' },
            { id: 'b', label: 'Configure the agent on the client host' },
            { id: 'c', label: 'Verify the SSH host key fingerprint' }
        ]
    }
};
