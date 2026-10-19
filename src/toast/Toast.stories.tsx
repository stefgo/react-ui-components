import { useRef } from 'react';
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

const RunJob = () => {
    const { show, update } = useToast();
    const timer = useRef<ReturnType<typeof setInterval>>(undefined);

    const start = (fails: boolean) => {
        clearInterval(timer.current);
        const max = 8;
        let value = 0;
        const id = show({ title: 'Pulling 8 images', duration: 0, progress: { value, max } });
        timer.current = setInterval(() => {
            value++;
            const failed = fails && value > 5 ? 1 : 0;
            if (value < max) {
                update(id, { progress: { value, max }, description: failed ? '1 failed' : undefined });
                return;
            }
            clearInterval(timer.current);
            const done = failed
                ? { title: 'Could not pull 1 of 8 images', description: 'pbs-node-02: manifest unknown', variant: 'warning' as const }
                : { title: 'Pulled 8 images', description: undefined, variant: 'success' as const, duration: 5000 };
            // Dismissed meanwhile: the outcome still has to be seen.
            if (!update(id, { ...done, progress: undefined })) show(done);
        }, 600);
    };

    return (
        <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => start(false)}>Run job</Button>
            <Button size="sm" variant="secondary" onClick={() => start(true)}>Run job with a failure</Button>
        </div>
    );
};

/**
 * A job reported by one toast: `progress` draws the bar, `update` moves it on
 * and turns the toast into the outcome. It stays while the job runs and counts
 * down once it is given a duration. Dismiss it halfway and the outcome comes
 * as a new toast, because `update` answers `false`.
 */
export const Progress: Story = {
    render: () => (
        <ToastProvider>
            <RunJob />
        </ToastProvider>
    )
};
