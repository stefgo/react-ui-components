import type { Meta, StoryObj } from '@storybook/react-vite';
import { Monitor, HardDrive, Server, Activity, Users, Key, Settings } from 'lucide-react';
import { Sidebar, SidebarGroup } from './Sidebar';

const groups: SidebarGroup[] = [
    {
        title: 'Resources',
        items: [
            { id: 'clients', label: 'Clients', icon: Monitor, badge: '9 / 12', active: true, onClick: () => {} },
            { id: 'jobs', label: 'Jobs', icon: HardDrive, badge: '24 / 48', onClick: () => {} },
            { id: 'repos', label: 'Repositories', icon: Server, badgeDot: true, onClick: () => {} },
            { id: 'history', label: 'History', icon: Activity, onClick: () => {} },
        ],
    },
    {
        title: 'Administration',
        items: [
            { id: 'users', label: 'Users', icon: Users, onClick: () => {} },
            { id: 'tokens', label: 'Client Tokens', icon: Key, onClick: () => {} },
            { id: 'settings', label: 'Settings', icon: Settings, onClick: () => {} },
        ],
    },
];

const meta = {
    title: 'Shell/Sidebar',
    component: Sidebar,
    args: { groups },
    // The sidebar is `hidden md:flex`; give it a frame tall enough to judge.
    decorators: [(Story) => <div className="h-[32rem] flex">{Story()}</div>],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {};

/** Collapsed hides the labels, so they have to reach assistive tech another way. */
export const Collapsed: Story = { args: { isCollapsed: true } };

export const WithoutGroups: Story = {
    args: { groups: [{ items: groups[0].items }] },
};
