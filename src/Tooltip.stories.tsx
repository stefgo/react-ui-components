import type { Meta, StoryObj } from '@storybook/react-vite';
import { Play, Pencil, Trash2 } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { Button } from './Button';
import { ActionButton } from './ActionButton';

const meta = {
    title: 'Overlays/Tooltip',
    component: Tooltip,
    args: {
        content: 'Runs the job immediately',
        children: <Button variant="secondary">Run now</Button>
    }
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** All four sides. Each flips to its opposite when the viewport runs out. */
export const Placements: Story = {
    render: (args) => (
        <div className="grid grid-cols-2 gap-8 p-16 place-items-center">
            {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
                <Tooltip key={placement} {...args} placement={placement} content={`placement="${placement}"`}>
                    <Button variant="secondary">{placement}</Button>
                </Tooltip>
            ))}
        </div>
    )
};

/**
 * Against the viewport edge the tooltip flips to the other side rather than
 * being clipped. Narrow the preview pane to see it.
 */
export const NearTheEdge: Story = {
    render: (args) => (
        <div className="flex justify-between">
            <Tooltip {...args} placement="left" content="No room on the left, so it goes right">
                <Button variant="secondary">Left edge</Button>
            </Tooltip>
            <Tooltip {...args} placement="right" content="No room on the right, so it goes left">
                <Button variant="secondary">Right edge</Button>
            </Tooltip>
        </div>
    )
};

/**
 * `ActionButton` uses it for the visible half of its `tooltip` prop. The
 * accessible name still comes from `aria-label`, so the button stays named even
 * if the tooltip never opens.
 */
export const OnIconButtons: Story = {
    render: () => (
        <div className="flex items-center gap-2">
            <ActionButton icon={Play} tooltip="Run now" color="green" onClick={() => {}} />
            <ActionButton icon={Pencil} tooltip="Edit client" color="blue" onClick={() => {}} />
            <ActionButton
                icon={Trash2}
                color="red"
                tooltip={{ enabled: 'Delete client', disabled: 'Cannot delete a running client' }}
                disabled
                onClick={() => {}}
            />
        </div>
    )
};

/** Tab to it: focus opens with no delay, Escape closes it while focus stays put. */
export const KeyboardOnly: Story = {
    render: (args) => (
        <div className="flex gap-3">
            <Tooltip {...args} content="Opens on focus, immediately">
                <Button variant="secondary">First</Button>
            </Tooltip>
            <Tooltip {...args} content="Tab again and the previous one closes">
                <Button variant="secondary">Second</Button>
            </Tooltip>
        </div>
    )
};

export const Disabled: Story = {
    args: { disabled: true, children: <Button variant="secondary">No tooltip here</Button> }
};
