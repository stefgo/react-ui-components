import type { Meta, StoryObj } from '@storybook/react-vite';
import { Monitor, HardDrive, Server, Activity, Shield } from 'lucide-react';
import { BottomNav } from './BottomNav';

const meta = {
    title: 'Shell/BottomNav',
    component: BottomNav,
    parameters: {
        layout: 'fullscreen',
        // The bar is `md:hidden` — it only exists on a narrow viewport.
        viewport: { defaultViewport: 'mobile1' },
    },
    args: {
        items: [
            { id: 'clients', label: 'Clients', icon: <Monitor size={24} />, active: true, onClick: () => {} },
            { id: 'jobs', label: 'Jobs', icon: <HardDrive size={24} />, active: false, onClick: () => {} },
            { id: 'repos', label: 'Repositories', icon: <Server size={24} />, active: false, onClick: () => {} },
            { id: 'history', label: 'History', icon: <Activity size={24} />, active: false, onClick: () => {} },
            { id: 'more', label: 'More', icon: <Shield size={24} />, active: false, onClick: () => {} },
        ],
    },
    decorators: [(Story) => <div className="h-64 relative">{Story()}</div>],
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The tabs render an icon only, so `label` is what a screen reader announces —
 * it used to be declared and then silently dropped.
 */
export const Default: Story = {};

export const TwoItems: Story = {
    args: { items: meta.args.items.slice(0, 2) },
};
