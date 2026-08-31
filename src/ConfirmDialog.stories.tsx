import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';
import { Button } from './Button';
import { Input } from './Input';

const meta = {
    title: 'Overlays/ConfirmDialog',
    component: ConfirmDialog,
    args: {
        isOpen: true,
        onClose: () => {},
        onConfirm: () => {},
        title: 'Delete pbs-node-01?',
        description: 'The client and its 4 jobs are removed. Snapshots are kept.'
    },
    parameters: {
        docs: {
            description: {
                component:
                    'A `Modal` with the two buttons every confirmation needs. Rendered open in most stories, because a closed dialog has nothing to look at — `Interactive` below is the one to use for focus, Escape and the busy state.'
            }
        }
    }
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/**
 * `variant="danger"` for anything that destroys data. The description names the
 * consequence, not the button — "Snapshots are kept" is what the reader needs
 * before deciding, and "Are you sure?" is not.
 */
export const Danger: Story = {
    args: { variant: 'danger', confirmLabel: 'Delete' }
};

/**
 * Both buttons block while the action runs, and the overlay stops dismissing —
 * the one case where clicking beside the dialog is not the same as Cancel.
 */
export const Confirming: Story = {
    args: { variant: 'danger', confirmLabel: 'Delete', isConfirming: true }
};

/** `children` carry anything the question needs beyond a sentence. */
export const WithContent: Story = {
    args: {
        title: 'Rename this repository?',
        description: 'Jobs pointing at the old name keep running.',
        confirmLabel: 'Rename',
        children: <Input label="New name" defaultValue="pbs-archive-02" />
    }
};

/** Wording is the whole API surface here — nothing else can be got wrong. */
export const CustomLabels: Story = {
    args: {
        title: 'Discard unsaved changes?',
        description: 'The job configuration returns to its last saved state.',
        confirmLabel: 'Discard',
        cancelLabel: 'Keep editing',
        variant: 'danger'
    }
};

const InteractiveDemo = () => {
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);

    return (
        <>
            <Button variant="danger" onClick={() => setOpen(true)}>Delete client</Button>
            <ConfirmDialog
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={() => {
                    setBusy(true);
                    setTimeout(() => { setBusy(false); setOpen(false); }, 1200);
                }}
                title="Delete pbs-node-01?"
                description="The client and its 4 jobs are removed. Snapshots are kept."
                confirmLabel="Delete"
                variant="danger"
                isConfirming={busy}
            />
        </>
    );
};

/**
 * Open it to check what only happens live: focus lands inside and is trapped,
 * Escape closes, focus returns to the trigger, and both buttons block for the
 * 1.2 s the fake request takes.
 */
export const Interactive: Story = { render: () => <InteractiveDemo /> };
