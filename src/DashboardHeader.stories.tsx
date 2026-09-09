import type { Meta, StoryObj } from '@storybook/react-vite';
import { Server } from 'lucide-react';
import { DashboardHeader } from './DashboardHeader';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './Button';

const logo = (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-button-primary-text">
        <Server size={20} aria-hidden />
    </div>
);

const meta = {
    title: 'Shell/DashboardHeader',
    component: DashboardHeader,
    parameters: { layout: 'fullscreen' },
    args: {
        logo,
        title: <span className="text-xl font-bold">P<span className="text-primary">BC</span>M</span>,
        onToggleSidebar: () => {},
    },
} satisfies Meta<typeof DashboardHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
    args: {
        leftActions: <Button size="sm" variant="ghost">Docs</Button>,
        rightActions: (
            <div className="flex items-center gap-3">
                <ThemeToggle theme="light" onToggle={() => {}} />
                <Button size="sm">New client</Button>
            </div>
        ),
    },
};

export const TitleOnly: Story = { args: { logo: undefined } };
export const WithoutSidebarToggle: Story = { args: { showSidebarToggle: false } };
