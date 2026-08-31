import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';

/**
 * A switch acts at once; a checkbox states an intention that a later submit
 * carries out. Screen readers announce the two differently, so the choice
 * between them is not cosmetic.
 */
const meta = {
    title: 'Forms/Switch',
    component: Switch,
    args: { label: 'Enable reverse tunnel' }
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
    render: (args) => (
        <div className="space-y-3">
            <Switch {...args} label="Off" />
            <Switch {...args} label="On" defaultValue />
            <Switch {...args} label="Disabled" disabled />
            <Switch {...args} label="Disabled and on" disabled defaultValue />
        </div>
    )
};

export const WithMessages: Story = {
    render: (args) => (
        <div className="space-y-4 max-w-sm">
            <Switch {...args} label="Reverse tunnel" hint="Takes effect the next time the agent connects." />
            <Switch {...args} label="Maintenance mode" error="Not available while a job is running" />
        </div>
    )
};

const ControlledDemo = () => {
    const [on, setOn] = useState(false);

    return (
        <div className="space-y-3">
            <Switch label="Enable reverse tunnel" value={on} onChange={setOn} />
            <p className="text-sm text-text-muted">
                The page decides: <code className="px-1.5 py-0.5 rounded bg-hover text-text-primary">{String(on)}</code>
            </p>
        </div>
    );
};

export const Controlled: Story = { render: () => <ControlledDemo /> };
