import type { Meta, StoryObj } from '@storybook/react-vite';
import { Play, Pencil, Trash2, RefreshCw, Download } from 'lucide-react';
import { DataAction, DataActionProps } from './DataAction';

const RowActions = (props: DataActionProps<string>) => <DataAction {...props} />;

const meta = {
    title: 'Data/DataAction',
    component: RowActions,
    args: {
        rowId: 'row-1',
        actions: [
            { icon: Play, tooltip: 'Run now', onClick: () => {} },
            { icon: RefreshCw, tooltip: 'Refresh', onClick: () => {} },
        ],
        menuEntries: [
            { label: 'Edit', icon: Pencil, onClick: () => {} },
            { label: 'Download log', icon: Download, onClick: () => {} },
            { label: 'Delete', icon: Trash2, onClick: () => {}, variant: 'danger' },
        ],
    },
} satisfies Meta<typeof RowActions>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Open the menu and use the keyboard: arrows move between entries, Home/End jump,
 * Escape closes and returns focus to the trigger.
 */
export const Default: Story = {};

export const InlineOnly: Story = { args: { menuEntries: [] } };
export const MenuOnly: Story = { args: { actions: [] } };

export const WithDisabledEntries: Story = {
    args: {
        actions: [{ icon: Play, disabled: true, tooltip: { enabled: 'Run now', disabled: 'Client is offline' }, onClick: () => {} }],
        menuEntries: [
            { label: 'Edit', icon: Pencil, onClick: () => {} },
            { label: { enabled: 'Delete', disabled: 'Delete (running)' }, icon: Trash2, disabled: true, onClick: () => {}, variant: 'danger' },
        ],
    },
};

/**
 * The menu measures itself and stays inside the viewport. Open the last row's menu:
 * it flips above the trigger instead of running off the bottom.
 */
export const NearTheViewportEdge: Story = {
    render: (args) => (
        <div className="h-[80vh] flex flex-col justify-end">
            <div className="flex justify-end border-t border-border dark:border-border-dark pt-3">
                <RowActions {...args} />
            </div>
        </div>
    ),
};
