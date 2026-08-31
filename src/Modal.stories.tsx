import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal, type ModalSize } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';

const meta = {
    title: 'Overlays/Modal',
    component: Modal,
    args: { isOpen: true, onClose: () => {}, title: 'Delete client' }
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Rendered open, because a closed modal has nothing to look at. Use the
 * `Interactive` story below to check focus and Escape.
 */
export const Playground: Story = {
    args: {
        description: 'This removes the client and every job attached to it.',
        children: <p>The snapshots already in the repository are not affected.</p>,
        footer: (
            <>
                <Button variant="secondary">Cancel</Button>
                <Button variant="danger">Delete</Button>
            </>
        )
    }
};

export const WithoutFooter: Story = {
    args: { children: <p>Nothing to decide here — just something to read.</p> }
};

export const TitleOnly: Story = {};

export const ScrollingBody: Story = {
    args: {
        title: 'Release notes',
        children: (
            <div className="space-y-3">
                {Array.from({ length: 20 }, (_, i) => (
                    <p key={i}>Paragraph {i + 1} — the body scrolls, the header and footer do not.</p>
                ))}
            </div>
        ),
        footer: <Button>Close</Button>
    }
};

const SizeDemo = () => {
    const [size, setSize] = useState<ModalSize | null>(null);

    return (
        <>
            <div className="flex flex-wrap gap-2">
                {(['sm', 'md', 'lg', 'xl', 'full'] as const).map((option) => (
                    <Button key={option} variant="secondary" size="sm" onClick={() => setSize(option)}>
                        {option}
                    </Button>
                ))}
            </div>
            <Modal
                isOpen={size !== null}
                onClose={() => setSize(null)}
                title={`size="${size}"`}
                description="Only the width changes; the header, body and footer keep their proportions."
                size={size ?? 'md'}
                footer={<Button onClick={() => setSize(null)}>Close</Button>}
            >
                <p>Two modals cannot be compared side by side, so open them in turn.</p>
            </Modal>
        </>
    );
};

/** The size scale. `full` is for content that genuinely needs the width. */
export const Sizes: Story = { render: () => <SizeDemo /> };

const InteractiveDemo = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>Edit client</Button>
            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Edit client"
                description="Changes take effect on the next run."
                // A form with typed-in text: a stray click beside the dialog
                // should not throw the work away.
                closeOnOverlayClick={false}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={() => setOpen(false)}>Save</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Input label="Hostname" defaultValue="pbs-node-01" />
                    <Textarea label="Notes" placeholder="Optional" />
                </div>
            </Modal>
        </>
    );
};

/** Tab through it: focus starts inside, never leaves, and comes back on close. */
export const Interactive: Story = { render: () => <InteractiveDemo /> };
