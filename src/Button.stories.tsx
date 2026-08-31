import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from './Button';

const meta = {
    title: 'Foundational/Button',
    component: Button,
    argTypes: {
        variant: { control: 'select', options: ['primary', 'secondary', 'danger', 'ghost'] },
        size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    },
    args: { children: 'Save changes' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="mb-6 last:mb-0">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
            {label}
        </div>
        <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
);

export const Playground: Story = {};

/** Every variant next to every other — the only way to see that they belong together. */
export const Variants: Story = {
    render: (args) => (
        <>
            <Row label="Variants">
                <Button {...args} variant="primary">Primary</Button>
                <Button {...args} variant="secondary">Secondary</Button>
                <Button {...args} variant="danger">Danger</Button>
                <Button {...args} variant="ghost">Ghost</Button>
            </Row>
            <Row label="Sizes">
                <Button {...args} size="sm">Small</Button>
                <Button {...args} size="md">Medium</Button>
                <Button {...args} size="lg">Large</Button>
            </Row>
        </>
    ),
};

/** The states that are easy to forget: they are where inconsistency hides. */
export const States: Story = {
    render: (args) => (
        <>
            <Row label="Disabled">
                <Button {...args} variant="primary" disabled>Primary</Button>
                <Button {...args} variant="secondary" disabled>Secondary</Button>
                <Button {...args} variant="danger" disabled>Danger</Button>
                <Button {...args} variant="ghost" disabled>Ghost</Button>
            </Row>
            <Row label="Loading">
                <Button {...args} variant="primary" isLoading>Saving</Button>
                <Button {...args} variant="secondary" isLoading>Saving</Button>
            </Row>
            <Row label="With icon">
                <Button {...args} variant="primary" icon={<Plus size={16} />}>New client</Button>
                <Button {...args} variant="danger" icon={<Trash2 size={16} />}>Delete</Button>
            </Row>
        </>
    ),
};

/** `type` defaults to "button" so a Button inside a form does not submit by accident. */
export const InsideAForm: Story = {
    render: (args) => (
        <form
            onSubmit={(e) => { e.preventDefault(); alert('submitted'); }}
            className="flex items-center gap-3"
        >
            <Button {...args} variant="secondary">Does not submit</Button>
            <Button {...args} type="submit" variant="primary">Submits</Button>
        </form>
    ),
};
