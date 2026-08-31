import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Collapsible } from './Collapsible';
import { Badge } from './Badge';

const Body = ({ lines = 3 }: { lines?: number }) => (
    <div className="px-4 pb-4 space-y-2 text-sm text-text-secondary dark:text-text-secondary-dark">
        {Array.from({ length: lines }, (_, i) => (
            <p key={i}>Line {i + 1} of the collapsed content.</p>
        ))}
    </div>
);

const meta = {
    title: 'Foundational/Collapsible',
    component: Collapsible,
    args: { title: 'Advanced options', children: <Body /> },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args) => <Collapsible {...args}><Body /></Collapsible> };

export const Expanded: Story = {
    render: (args) => <Collapsible {...args} defaultValue><Body /></Collapsible>,
};

/**
 * The reason `max-h-[1000px]` had to go: content taller than the guess used to be
 * silently cut off. Expand this one and scroll to the last line.
 */
export const VeryTallContent: Story = {
    render: (args) => <Collapsible {...args} title="80 lines of content" defaultValue><Body lines={80} /></Collapsible>,
};

export const WithRichTitle: Story = {
    render: (args) => (
        <Collapsible {...args} title={<span className="flex items-center gap-2">pbs-node-01 <Badge size="sm" variant="success">online</Badge></span>}>
            <Body />
        </Collapsible>
    ),
};

const AccordionDemo = (args: React.ComponentProps<typeof Collapsible>) => {
    const [open, setOpen] = useState<string | null>('a');
    return (
        <div className="divide-y divide-border dark:divide-border-dark border border-border dark:border-border-dark rounded-xl overflow-hidden">
            {(['a', 'b', 'c'] as const).map((id) => (
                <Collapsible
                    {...args}
                    key={id}
                    title={`Section ${id.toUpperCase()}`}
                    value={open === id}
                    onChange={(next) => setOpen(next ? id : null)}
                >
                    <Body lines={2} />
                </Collapsible>
            ))}
        </div>
    );
};

/** Controlled: the caller owns the state, so only one panel is open at a time. */
export const Controlled: Story = {
    render: (args) => <AccordionDemo {...args} />,
};
