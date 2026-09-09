import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Monitor, HardDrive, Server, Activity, Settings } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { DashboardHeader } from './DashboardHeader';
import { Sidebar, type SidebarGroup } from './Sidebar';
import { BottomNav, type BottomNavItem } from './BottomNav';
import { Card } from './Card';
import { StatCard } from './StatCard';

const meta = {
    title: 'Shell/DashboardLayout',
    component: DashboardLayout,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'The frame the shell sits in: a fixed header, a sidebar and the scrolling content area between them, with an optional bottom nav below. It composes nothing itself — `header`, `sidebar` and `bottomNav` are slots, and `Dashboard` is what fills them from a page list. Reach for this one when the navigation is your own.'
            }
        }
    },
    args: {
        header: <div className="h-14 bg-card border-b border-border flex items-center px-4 font-semibold">header</div>,
        sidebar: <div className="w-56 bg-sidebar-bg border-r border-border p-4 text-sm text-text-muted">sidebar</div>,
        children: <Card title="content">The area that scrolls.</Card>
    }
} satisfies Meta<typeof DashboardLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The three regions as plain boxes, so the layout itself is what you see: the
 * header stays put, the sidebar spans the full height beneath it, and only the
 * `<main>` in between scrolls.
 */
export const Regions: Story = {};

/**
 * The content area scrolls on its own — the page behind it never does. It also
 * reserves the scrollbar's width (`scrollbar-gutter: stable`), so content does
 * not shift sideways the moment a page grows past one screen.
 */
export const ScrollingContent: Story = {
    args: {
        children: (
            <>
                {Array.from({ length: 12 }, (_, i) => (
                    <Card key={i} title={`Card ${i + 1}`}>
                        Long enough, together, to need the scrollbar.
                    </Card>
                ))}
            </>
        )
    }
};

/**
 * `bottomNav` is rendered last and hides itself from `md` upwards — the layout
 * only leaves room for it (`pb-20 md:pb-4`). Narrow the preview to see it.
 */
export const WithBottomNav: Story = {
    args: {
        bottomNav: (
            <BottomNav
                ariaLabel="Sections"
                items={[
                    { id: 'clients', icon: Monitor, label: 'Clients', active: true, onClick: () => {} },
                    { id: 'jobs', icon: HardDrive, label: 'Jobs', active: false, onClick: () => {} },
                    { id: 'repos', icon: Server, label: 'Repositories', active: false, onClick: () => {} }
                ]}
            />
        )
    }
};

const FilledDemo = () => {
    const [path, setPath] = useState('clients');
    const [collapsed, setCollapsed] = useState(false);

    const pages = [
        { id: 'clients', label: 'Clients', icon: Monitor, badge: '9 / 12' },
        { id: 'jobs', label: 'Jobs', icon: HardDrive, badge: '24 / 48' },
        { id: 'repositories', label: 'Repositories', icon: Server, badgeDot: true },
        { id: 'history', label: 'History', icon: Activity },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    const groups: SidebarGroup[] = [
        {
            title: 'Resources',
            items: pages.slice(0, 4).map((p) => ({
                ...p,
                active: path === p.id,
                onClick: () => setPath(p.id)
            }))
        },
        {
            title: 'Administration',
            items: pages.slice(4).map((p) => ({
                ...p,
                active: path === p.id,
                onClick: () => setPath(p.id)
            }))
        }
    ];

    const tabs: BottomNavItem[] = pages.slice(0, 4).map((p) => ({
        id: p.id,
        icon: p.icon,
        label: p.label,
        active: path === p.id,
        onClick: () => setPath(p.id)
    }));

    return (
        <DashboardLayout
            header={
                <DashboardHeader
                    title={<span className="text-xl font-bold">P<span className="text-primary">BC</span>M</span>}
                    onToggleSidebar={() => setCollapsed((c) => !c)}
                />
            }
            sidebar={<Sidebar groups={groups} isCollapsed={collapsed} ariaLabel="Main" />}
            bottomNav={<BottomNav items={tabs} ariaLabel="Sections" />}
        >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Clients online" value="9 / 12" icon={Monitor} />
                <StatCard label="Jobs today" value="24" icon={HardDrive} sub="3 failed" />
                <StatCard label="Repositories" value="4" icon={Server} />
            </div>
            <Card title={pages.find((p) => p.id === path)?.label}>
                Picking an entry only changes what is rendered here — the layout
                decides nothing about routing.
            </Card>
        </DashboardLayout>
    );
};

/**
 * The slots filled with the components they were cut for. The sidebar toggle in
 * the header collapses it to icons; the content is the consumer's business.
 */
export const Filled: Story = { render: () => <FilledDemo /> };
