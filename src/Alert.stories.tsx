import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, type AlertTone } from './Alert';

const meta = {
    title: 'Feedback/Alert',
    component: Alert,
    args: { title: 'Could not load the users', children: 'connect ECONNREFUSED 127.0.0.1:3000' },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const TONES: { tone: AlertTone; title: string; body: string }[] = [
    { tone: 'error', title: 'Could not save the webhook', body: 'The server refused the URL.' },
    { tone: 'success', title: 'Delivered (HTTP 200)', body: 'The target answered in 84 ms.' },
    { tone: 'warning', title: 'Registry paused', body: 'docker.io answered with a rate limit until 14:30.' },
    { tone: 'info', title: 'A newer agent is available', body: 'Version 1.6.0 was released yesterday.' },
    { tone: 'neutral', title: 'Repository is offline', body: 'Snapshots cannot be listed.' }
];

/** Judge these in the side-by-side theme mode: each tone is one background and one text colour per theme. */
export const Tones: Story = {
    render: () => (
        <div className="space-y-3 max-w-xl">
            {TONES.map(({ tone, title, body }) => (
                <Alert key={tone} tone={tone} title={title}>{body}</Alert>
            ))}
        </div>
    ),
};

/** Without a title the children are the message. */
export const BodyOnly: Story = { args: { title: undefined, children: 'Passwords do not match.' } };

/** A long, unbroken value wraps inside the box instead of widening the page. */
export const LongValue: Story = {
    args: {
        title: 'Failed',
        children: 'https://hooks.example.org/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    },
    render: (args) => (
        <div className="max-w-xs">
            <Alert {...args} />
        </div>
    ),
};
