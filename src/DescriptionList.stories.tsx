import type { Meta, StoryObj } from '@storybook/react-vite';
import { DescriptionList, type DescriptionItem } from './DescriptionList';
import { Badge } from './Badge';
import { Card } from './Card';
import { Switch } from './Switch';

const ITEMS: DescriptionItem[] = [
    { label: 'Connection', value: <Badge variant="info">Inbound</Badge> },
    { label: 'Agent', value: 'v1.4.2' },
    { label: 'Allowed IP', value: '192.168.1.0/24', mono: true },
    { label: 'Last IP', value: '192.168.1.50', mono: true },
    { label: 'Auto-Update', value: '0 3 * * *', mono: true }
];

const meta = {
    title: 'Data/DescriptionList',
    component: DescriptionList,
    args: { items: ITEMS },
    decorators: [(Story) => <Card padding="md"><Story /></Card>],
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const OneColumn: Story = { args: { columns: 1 } };

export const ThreeColumns: Story = { args: { columns: 3 } };

/** The button copies `copyable`, which may be longer than what is on screen. */
export const Copyable: Story = {
    args: {
        items: [
            { label: 'ID', value: '3f9a0e7b…c21', mono: true, copyable: '3f9a0e7b-5d1c-4f0a-9c2e-8b7d6a5f4c21' },
            { label: 'Agent', value: 'v1.4.2' }
        ]
    }
};

/** A value may be a control. `span: 'full'` gives a long value the whole row. */
export const WithControls: Story = {
    args: {
        items: [
            { label: 'Query', value: 'label com.docker.compose.project = nextcloud', mono: true, span: 'full' },
            { label: 'Auto-Update', value: <Switch label="Enabled" value onChange={() => {}} /> },
            { label: 'Schedule', value: <Switch label="Use the default schedule" value={false} onChange={() => {}} /> }
        ]
    }
};
