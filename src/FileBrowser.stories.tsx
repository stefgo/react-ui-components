import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileBrowser, FsFile } from './FileBrowser';

const tree: Record<string, FsFile[]> = {
    '/': [
        { name: 'etc', path: '/etc', isDirectory: true, size: 4096 },
        { name: 'var', path: '/var', isDirectory: true, size: 4096 },
        { name: 'srv', path: '/srv', isDirectory: true, size: 4096 },
        { name: 'README', path: '/README', isDirectory: false, size: 2048 },
    ],
    '/etc': [
        { name: 'hosts', path: '/etc/hosts', isDirectory: false, size: 2048 },
        { name: 'fstab', path: '/etc/fstab', isDirectory: false, size: 2048 },
        { name: 'ssh', path: '/etc/ssh', isDirectory: true, size: 4096 },
    ],
    '/var': [{ name: 'lib', path: '/var/lib', isDirectory: true, size: 4096 }],
    '/var/lib': [{ name: 'postgresql', path: '/var/lib/postgresql', isDirectory: true, size: 4096 }],
};

const meta = {
    title: 'Data/FileBrowser',
    component: FileBrowser,
    parameters: { layout: 'padded' },
    args: { currentPath: '/', files: tree['/'], isLoading: false, onNavigate: () => {}, onSelect: () => {} },
} satisfies Meta<typeof FileBrowser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Root: Story = {};
export const Loading: Story = { args: { isLoading: true, files: [] } };
export const EmptyDirectory: Story = { args: { currentPath: '/srv', files: [] } };

const NavigableDemo = (args: React.ComponentProps<typeof FileBrowser>) => {
    const [path, setPath] = useState('/');
    return (
        <FileBrowser
            {...args}
            currentPath={path}
            files={tree[path] ?? []}
            onNavigate={setPath}
            onSelect={() => {}}
        />
    );
};

/** Navigating is the whole point — this wires it to the fake tree above. */
export const Navigable: Story = {
    render: (args) => <NavigableDemo {...args} />,
};
