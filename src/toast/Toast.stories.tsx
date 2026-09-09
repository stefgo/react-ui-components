import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastProvider } from './ToastProvider';
import { useToast } from './ToastProvider';
import { Button } from '../Button';
import type { ToastPlacement } from './ToastViewport';

const meta = {
    title: 'Feedback/Toast',
    component: ToastProvider,
    args: { children: null }
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

const Raise = () => {
    const { show, dismissAll } = useToast();

    return (
        <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => show({ title: 'Backup started', description: 'pbs-node-01', variant: 'info' })}>
                Info
            </Button>
            <Button size="sm" variant="secondary" onClick={() => show({ title: 'Job saved', variant: 'success' })}>
                Success
            </Button>
            <Button size="sm" variant="secondary" onClick={() => show({ title: 'Repository almost full', description: '92 % used', variant: 'warning' })}>
                Warning
            </Button>
            <Button size="sm" variant="danger" onClick={() => show({ title: 'Backup failed', description: 'Connection refused', variant: 'error', duration: 0 })}>
                Error (stays)
            </Button>
            <Button size="sm" variant="ghost" onClick={() => show({ title: 'Client deleted', duration: 8000, action: { label: 'Undo', onClick: () => {} } })}>
                With action
            </Button>
            <Button size="sm" variant="ghost" onClick={dismissAll}>Clear</Button>
        </div>
    );
};

/**
 * Raise a few and hover one: the countdown stops while the pointer is on it,
 * and picks up where it left off rather than starting over.
 */
export const Playground: Story = {
    render: () => (
        <ToastProvider>
            <Raise />
        </ToastProvider>
    )
};

const placements: ToastPlacement[] = [
    'top-left', 'top-center', 'top-right',
    'bottom-left', 'bottom-center', 'bottom-right'
];

/** One provider per placement would overlap, so pick one at a time. */
export const Placements: Story = {
    render: () => (
        <div className="space-y-2">
            <p className="text-sm text-text-muted">
                Six corners are available. Shown here: bottom-center.
            </p>
            <ul className="text-xs text-text-muted grid grid-cols-3 gap-1">
                {placements.map((p) => <li key={p}><code>{p}</code></li>)}
            </ul>
            <ToastProvider placement="bottom-center">
                <Raise />
            </ToastProvider>
        </div>
    )
};

/** Beyond the limit the oldest is dropped: a stack taller than the screen hides the page. */
export const Limit: Story = {
    render: () => (
        <ToastProvider limit={2}>
            <Raise />
        </ToastProvider>
    )
};
