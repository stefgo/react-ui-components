import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertTriangle, Database, HardDrive, Monitor, ShieldCheck } from 'lucide-react';
import { StatCard } from './StatCard';
import { StatCardGrid } from './StatCardGrid';

const meta = {
    title: 'Foundational/StatCardGrid',
    component: StatCardGrid,
    args: { children: null },
} satisfies Meta<typeof StatCardGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Drag the frame's corner: the row goes from stacked to 3 + 2 to five across,
 * by the width of the frame, not of the window. It skips 2 + 2 + 1 and 4 + 1,
 * which would leave a card alone on a row.
 */
export const FiveCards: Story = {
    render: () => (
        <div className="resize-x overflow-auto border border-dashed border-border p-2 w-[960px] max-w-full">
            <StatCardGrid>
                <StatCard label="Backups" value="Degraded" sub="3 findings" icon={ShieldCheck} classNames={{ icon: 'text-warning' }} />
                <StatCard label="Hosts online" value="3 / 4" sub="1 offline" icon={Monitor} />
                <StatCard label="Repositories online" value="2 / 2" sub="All reachable" icon={Database} />
                <StatCard label="Jobs active" value="5" sub="On clients that are online" icon={HardDrive} />
                <StatCard label="Errors / Warnings" value="2" sub="1 failed, 1 missed" icon={AlertTriangle} />
            </StatCardGrid>
        </div>
    ),
};

/** Four cards go 2 + 2, then four across -- never 3 + 1. */
export const FourCards: Story = {
    render: () => (
        <div className="resize-x overflow-auto border border-dashed border-border p-2 w-[960px] max-w-full">
            <StatCardGrid>
                <StatCard label="Clients" value="12" sub="3 offline" icon={Monitor} />
                <StatCard label="Jobs" value="48" sub="Configurations" icon={HardDrive} />
                <StatCard label="Repositories" value="4" icon={Database} />
                <StatCard label="Status" value="Healthy" sub="Nothing needs attention" icon={ShieldCheck} classNames={{ icon: 'text-success' }} />
            </StatCardGrid>
        </div>
    ),
};
