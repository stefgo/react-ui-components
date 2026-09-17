import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Layers, Monitor } from 'lucide-react';
import { StatCard } from './StatCard';
import { TabList, TabPanel, type TabMountPolicy } from './Tabs';
import { useTabs } from './hooks/useTabs';

const meta = {
    title: 'Data/Tabs',
    parameters: {
        docs: {
            description: {
                component:
                    'Tabs are a hook, not a component, because a tab is not one shape: here they are '
                    + 'StatCards. What the library owns is the part that is easy to get wrong and '
                    + 'invisible when it is wrong — the roles, the tab-to-panel wiring, the roving '
                    + 'tabindex and the arrow keys — plus how long a panel’s content stays alive.',
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const VIEWS = ['clients', 'containers', 'images'] as const;
const ICONS = { clients: Monitor, containers: Box, images: Layers };

/** Stands in for a real list: it counts the keystrokes it has been given. */
const Notes = ({ view }: { view: string }) => {
    const [text, setText] = useState('');
    return (
        <label className="block space-y-2">
            <span className="block text-sm text-text-muted">
                Type here, switch tabs, and come back.
            </span>
            <input
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder={`Notes on ${view}`}
                className="w-full rounded-lg border border-border bg-input-bg px-3 py-2 text-text-primary"
            />
        </label>
    );
};

const Demo = ({ mount }: { mount: TabMountPolicy }) => {
    const tabs = useTabs({ tabs: VIEWS, defaultValue: 'clients' });
    return (
        <div className="space-y-6">
            <TabList tabs={tabs} aria-label="Project views" className="grid grid-cols-3 gap-4">
                {VIEWS.map((view) => (
                    <StatCard
                        key={view}
                        {...tabs.tabProps(view)}
                        label={view}
                        value={String(view.length)}
                        icon={ICONS[view]}
                    />
                ))}
            </TabList>
            {VIEWS.map((view) => (
                <TabPanel key={view} tabs={tabs} value={view} mount={mount} className="rounded-lg border border-border p-6">
                    <Notes view={view} />
                </TabPanel>
            ))}
        </div>
    );
};

/**
 * The default. A panel is built the first time it is opened and kept from then
 * on, so what you typed is still there when you come back — and a tab nobody
 * opens costs nothing.
 */
export const Visited: Story = { render: () => <Demo mount="visited" /> };

/**
 * Only the open panel exists. Everything the panel held is gone on the way out,
 * which is the right trade for content too heavy to keep — and the behaviour
 * that `{active && <Panel/>}` gives you without ever saying so.
 */
export const Active: Story = { render: () => <Demo mount="active" /> };

/** Every panel is built up front, for content that has to be measured or prefetched. */
export const Eager: Story = { render: () => <Demo mount="eager" /> };
