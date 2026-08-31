import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Monitor, HardDrive, Server, Activity, Users, Key, Settings } from 'lucide-react';
import { Dashboard, DashboardNavGroup, DashboardPage, DashboardPageNav } from './Dashboard';
import { Card } from './Card';
import { StatCard } from './StatCard';

const navGroups: DashboardNavGroup[] = [
    { id: 'resources', title: 'Resources' },
    { id: 'administration', title: 'Administration' },
];

const meta = {
    title: 'Shell/Dashboard',
    component: Dashboard,
    parameters: { layout: 'fullscreen' },
    args: {
        username: 'stefan',
        onLogout: () => {},
        theme: 'light',
        onToggleTheme: () => {},
        isSidebarCollapsed: false,
        onToggleSidebar: () => {},
        navGroups,
    },
} satisfies Meta<typeof Dashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The whole shell. `Dashboard` renders navigation only — what is on screen comes
 * in as `children`, here driven by local state instead of a router.
 */
const FullShellDemo = (args: React.ComponentProps<typeof Dashboard>) => {
    const [path, setPath] = useState('/clients');
    const [collapsed, setCollapsed] = useState(false);

        const nav = (
            label: string,
            icon: DashboardPageNav['icon'],
            groupId: string,
            extra: Partial<DashboardPageNav> = {},
        ): DashboardPageNav => ({
            label,
            icon,
            groupId,
            onClick: () => setPath(`/${label.toLowerCase()}`),
            ...extra,
        });

        const pages: DashboardPage[] = [
            { id: 'clients', path: '/clients', nav: nav('Clients', Monitor, 'resources', { badge: '9 / 12' }) },
            { id: 'jobs', path: '/jobs', nav: nav('Jobs', HardDrive, 'resources', { badge: '24 / 48' }) },
            { id: 'repositories', path: '/repositories', nav: nav('Repositories', Server, 'resources', { badgeDot: true }) },
            { id: 'history', path: '/history', nav: nav('History', Activity, 'resources') },
            { id: 'users', path: '/users', nav: nav('Users', Users, 'administration', { placement: 'mobile-more' }) },
            { id: 'tokens', path: '/tokens', nav: nav('Tokens', Key, 'administration', { placement: 'mobile-more' }) },
            { id: 'settings', path: '/settings', nav: nav('Settings', Settings, 'administration', { placement: 'mobile-more' }) },
        ];

        return (
            <Dashboard
                {...args}
                title={<span className="text-xl font-bold">P<span className="text-primary">BC</span>M</span>}
                isSidebarCollapsed={collapsed}
                onToggleSidebar={() => setCollapsed((c) => !c)}
                pages={pages}
                currentPath={path}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <StatCard label="Clients" value="12" sub="3 offline" icon={<Monitor size={20} />} />
                    <StatCard label="Jobs" value="48" sub="Configurations" icon={<HardDrive size={20} />} />
                    <StatCard label="Snapshots" value="1204" sub="Available" icon={<Server size={20} />} />
                </div>
                <Card title={`Content for ${path}`}>
                    <div className="p-5 text-sm text-text-secondary dark:text-text-secondary-dark">
                        Switch pages in the sidebar. On a narrow viewport the bottom nav appears and
                        Administration moves into the “More” sheet.
                    </div>
                </Card>
            </Dashboard>
    );
};

export const FullShell: Story = {
    render: (args) => <FullShellDemo {...args} />,
};

/** An unknown path highlights nothing — it no longer falls back to the first page. */
export const UnknownPath: Story = {
    args: {
        currentPath: '/does-not-exist',
        pages: [
            { id: 'clients', path: '/clients', nav: { label: 'Clients', icon: Monitor, groupId: 'resources', onClick: () => {} } },
            { id: 'jobs', path: '/jobs', nav: { label: 'Jobs', icon: HardDrive, groupId: 'resources', onClick: () => {} } },
        ],
        children: (
            <Card title="404">
                <div className="p-5 text-sm text-text-secondary dark:text-text-secondary-dark">
                    No navigation entry is highlighted.
                </div>
            </Card>
        ),
    },
};
