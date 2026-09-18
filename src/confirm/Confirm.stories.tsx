import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConfirmProvider, useConfirm } from './ConfirmProvider';
import { Button } from '../Button';

const meta = {
    title: 'Overlays/ConfirmProvider',
    component: ConfirmProvider,
    args: { children: null },
    parameters: {
        docs: {
            description: {
                component:
                    '`useConfirm()` asks with `confirm()` and tells with `alert()`, from any event handler under one `ConfirmProvider`. The provider renders a single `ConfirmDialog` and owns its busy and error state.'
            }
        }
    }
} satisfies Meta<typeof ConfirmProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const Ask = () => {
    const { confirm, alert } = useConfirm();

    return (
        <div className="flex flex-wrap gap-2">
            <Button
                size="sm"
                onClick={async () => {
                    if (await confirm({ title: 'Pull & recreate "nginx:latest"?', confirmLabel: 'Pull & recreate' })) {
                        await alert({ title: 'Pull started' });
                    }
                }}
            >
                Ask
            </Button>
            <Button
                size="sm"
                variant="danger"
                onClick={() =>
                    confirm({
                        title: 'Delete pbs-node-01?',
                        description: 'The client and its 4 jobs are removed. Snapshots are kept.',
                        confirmLabel: 'Delete',
                        variant: 'danger',
                        onConfirm: () => wait(1200)
                    })
                }
            >
                Busy
            </Button>
            <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                    confirm({
                        title: 'Delete pbs-node-01?',
                        confirmLabel: 'Delete',
                        variant: 'danger',
                        onConfirm: async () => {
                            await wait(800);
                            throw new Error('The client is offline. Try again once it is connected.');
                        }
                    })
                }
            >
                Failing
            </Button>
            <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                    alert({
                        title: 'Cannot delete the last user',
                        description: 'Deleting it would lock everyone out. Create a second user first.'
                    })
                }
            >
                Alert
            </Button>
        </div>
    );
};

/**
 * Ask chains an alert after the answer. Busy keeps the dialog open for the 1.2 s
 * the fake request takes, with Escape and Cancel blocked; Failing keeps it open
 * with the error inside, next to the button that retries.
 */
export const Playground: Story = {
    render: () => (
        <ConfirmProvider>
            <Ask />
        </ConfirmProvider>
    )
};
