import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertCircle, Box, Edit, Layers, Monitor, MoreVertical, RefreshCw } from 'lucide-react';
import { EntityHeader, type EntityDetail, type EntityDetailGroup } from './EntityHeader';
import { ActionButton } from './ActionButton';
import { Badge } from './Badge';

const Dot = () => <span className="block h-3 w-3 rounded-full bg-success" aria-hidden />;

const Actions = () => (
    <>
        <ActionButton icon={RefreshCw} tooltip="Reload" onClick={() => {}} />
        <ActionButton icon={Edit} tooltip="Edit" onClick={() => {}} />
        <ActionButton icon={MoreVertical} tooltip="More actions" onClick={() => {}} />
    </>
);

const ALWAYS: EntityDetail[] = [
    { label: 'Agent', value: 'v1.4.2', visibility: 'always' },
    { label: 'Docker state', value: '18.09.2026, 12:04:31', visibility: 'always' }
];

const EXPANDED: EntityDetail[] = [
    { label: 'ID', value: '3f9a0e7b-5d1c-4f0a-9c2e-8b7d6a5f4c21', mono: true, copyable: '3f9a0e7b-5d1c-4f0a-9c2e-8b7d6a5f4c21' },
    { label: 'Allowed IP', value: '192.168.1.0/24', mono: true },
    { label: 'Last IP', value: '192.168.1.50', mono: true },
    { label: 'Auto-Update', value: '0 3 * * * (own schedule)', mono: true }
];

const meta = {
    title: 'Foundational/EntityHeader',
    component: EntityHeader,
    args: {
        title: 'web-01',
        leading: <Dot />,
        meta: (
            <>
                <Badge variant="info">Inbound</Badge>
                <Badge variant="neutral">v1.4.2</Badge>
            </>
        ),
        actions: <Actions />,
        details: [...ALWAYS, ...EXPANDED]
    },
} satisfies Meta<typeof EntityHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Both kinds of detail: the always-visible ones stay, "Show more" opens the rest. */
export const Playground: Story = {};

/** Nothing to open, so no toggle. */
export const AlwaysOnly: Story = { args: { details: ALWAYS } };

/** Closed, the header is a single row; the icon beside the actions opens the details. */
export const ExpandedOnly: Story = { args: { details: EXPANDED } };

export const Open: Story = { args: { defaultValue: true } };

export const WithoutDetails: Story = { args: { details: [] } };

/** The alert sits outside the collapsing part, so a closed header still shows it. */
export const WithAlert: Story = {
    args: {
        details: EXPANDED,
        alert: (
            <div className="flex items-start gap-2 rounded-lg border border-error px-3 py-2 text-sm text-error">
                <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden />
                <span>2 containers match this project and another one.</span>
            </div>
        )
    }
};

/** A long title truncates; the badges wrap below it and the actions keep their place. */
export const Narrow: Story = {
    args: { title: 'a-rather-long-hostname.internal.example.org' },
    parameters: { viewport: { defaultViewport: 'mobile1' } },
};

/** Open it, then reload the story: the choice is kept in localStorage. */
export const Persisted: Story = {
    args: { persist: { key: 'storybook.entity-header.details', scope: 'local' } },
};

const GROUPS: EntityDetailGroup[] = [
    {
        key: 'host',
        title: 'Host',
        leading: <Monitor size={16} />,
        details: [
            { label: 'Hostname', value: 'web-01', visibility: 'always' },
            { label: 'IP', value: '192.168.1.50', mono: true, visibility: 'always' }
        ]
    },
    {
        key: 'container',
        title: 'Container',
        leading: <Box size={16} />,
        details: [
            { label: 'Status', value: 'Up 2 hours', visibility: 'always' },
            { label: 'Container ID', value: '4f1c2d3e4a5b', mono: true, copyable: '4f1c2d3e4a5b', visibility: 'always' },
            { label: 'Command', value: 'nginx -g "daemon off;"', mono: true },
            { label: 'Ports', value: '0.0.0.0:8080 → 80/tcp', mono: true }
        ]
    },
    {
        key: 'image',
        title: 'nginx:latest',
        leading: <Layers size={16} />,
        meta: <Badge variant="warning">Superseded</Badge>,
        details: [
            { label: 'Image ID', value: 'sha256:1a2b3c4d', mono: true, visibility: 'always' },
            { label: 'Size', value: '187 MB', visibility: 'always' },
            { label: 'Digest', value: 'sha256:9f8e7d6c', mono: true }
        ]
    }
];

/** Details about several things, one titled group each; one "Show more" opens them all. */
export const Grouped: Story = { args: { title: 'dim-client', detailGroups: GROUPS, details: undefined } };
