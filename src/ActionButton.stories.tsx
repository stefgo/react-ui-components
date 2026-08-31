import type { Meta, StoryObj } from '@storybook/react-vite';
import { Play, Pencil, Trash2, RefreshCw, Download, Settings } from 'lucide-react';
import { ActionButton, ActionButtonColor } from './ActionButton';
import { DataAction } from './DataAction';

const meta = {
    title: 'Foundational/ActionButton',
    component: ActionButton,
    args: { icon: Play, tooltip: 'Run now', onClick: () => {} },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const colors: ActionButtonColor[] = ['gray', 'green', 'blue', 'red', 'orange', 'indigo', 'error'];

/** Colour is the only variation axis, and it only shows on hover. */
export const Colours: Story = {
    render: (args) => (
        <div className="flex flex-wrap items-center gap-2">
            {colors.map((color) => (
                <ActionButton key={color} {...args} color={color} tooltip={color} />
            ))}
        </div>
    ),
};

export const States: Story = {
    render: (args) => (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <ActionButton {...args} icon={Play} tooltip="Enabled" />
                <ActionButton {...args} icon={Pencil} tooltip="Enabled" variant="solid" />
                <ActionButton {...args} icon={Trash2} color="error" disabled tooltip={{ enabled: 'Delete', disabled: 'Cannot delete while running' }} />
            </div>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">
                The tooltip doubles as the accessible name — tab through them with a screen reader on.
            </p>
        </div>
    ),
};

/** The realistic use: a row of actions plus an overflow menu. */
export const InARow: Story = {
    render: () => (
        <div className="flex justify-end">
            <DataAction
                rowId="row-1"
                actions={[
                    { icon: Play, tooltip: 'Run now', onClick: () => {} },
                    { icon: RefreshCw, tooltip: 'Refresh', onClick: () => {} },
                    { icon: Download, tooltip: 'Download log', onClick: () => {} },
                ]}
                menuEntries={[
                    { label: 'Edit', icon: Pencil, onClick: () => {} },
                    { label: 'Settings', icon: Settings, onClick: () => {} },
                    { label: 'Delete', icon: Trash2, onClick: () => {}, variant: 'danger' },
                ]}
            />
        </div>
    ),
};
