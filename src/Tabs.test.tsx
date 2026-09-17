import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Activity } from 'lucide-react';
import { StatCard } from './StatCard';
import { TabList, TabPanel, type TabMountPolicy } from './Tabs';
import { useTabs } from './hooks/useTabs';

const TABS = ['clients', 'containers', 'images'] as const;

/** Counts how often its content was built, which is what a mount policy decides. */
const Counter = ({ label }: { label: string }) => {
    const [built] = useState(() => ({ at: Date.now() + Math.random() }));
    return <span data-testid={`panel-${label}`} data-instance={String(built.at)}>{label}</span>;
};

const Harness = ({ mount }: { mount?: TabMountPolicy }) => {
    const tabs = useTabs({ tabs: TABS, defaultValue: 'clients' });
    return (
        <>
            <TabList tabs={tabs} aria-label="Project views">
                {TABS.map((tab) => (
                    <StatCard key={tab} {...tabs.tabProps(tab)} label={tab} value="1" icon={Activity} />
                ))}
            </TabList>
            {TABS.map((tab) => (
                <TabPanel key={tab} tabs={tabs} value={tab} mount={mount}>
                    <Counter label={tab} />
                </TabPanel>
            ))}
        </>
    );
};

describe('TabPanel mount policies', () => {
    it('keeps a visited panel alive across a switch, instance and all', async () => {
        // The whole point: the view inside holds the sort order and the expanded
        // rows, and rebuilding it is what threw them away.
        render(<Harness />);
        const first = screen.getByTestId('panel-clients').dataset.instance;

        await userEvent.click(screen.getByRole('tab', { name: /containers/ }));
        await userEvent.click(screen.getByRole('tab', { name: /clients/ }));

        expect(screen.getByTestId('panel-clients').dataset.instance).toBe(first);
    });

    it('does not build a panel nobody opened', () => {
        render(<Harness />);
        expect(screen.queryByTestId('panel-images')).toBeNull();
    });

    it('drops the content again under the active policy', async () => {
        render(<Harness mount="active" />);
        const first = screen.getByTestId('panel-clients').dataset.instance;

        await userEvent.click(screen.getByRole('tab', { name: /containers/ }));
        expect(screen.queryByTestId('panel-clients')).toBeNull();

        await userEvent.click(screen.getByRole('tab', { name: /clients/ }));
        expect(screen.getByTestId('panel-clients').dataset.instance).not.toBe(first);
    });

    it('builds everything up front under the eager policy', () => {
        render(<Harness mount="eager" />);
        expect(screen.getByTestId('panel-images')).toBeInTheDocument();
    });

    it('keeps the panel element even while its content is gone', () => {
        // A tab's aria-controls points at this id. Removing the element would
        // leave that reference dangling, which is a broken tab list to anything
        // reading the page structure.
        render(<Harness mount="active" />);
        const tab = screen.getByRole('tab', { name: /images/ });
        expect(document.getElementById(tab.getAttribute('aria-controls')!)).not.toBeNull();
    });
});

describe('Tabs wiring', () => {
    it('ties every tab to its own panel', () => {
        render(<Harness mount="eager" />);
        for (const name of TABS) {
            const tab = screen.getByRole('tab', { name: new RegExp(name) });
            const panel = document.getElementById(tab.getAttribute('aria-controls')!);
            expect(panel).toHaveAttribute('aria-labelledby', tab.id);
        }
    });

    it('marks the open tab as selected rather than as pressed', () => {
        render(<Harness />);
        const tab = screen.getByRole('tab', { name: /clients/ });
        expect(tab).toHaveAttribute('aria-selected', 'true');
        // A tab list is not a row of toggles. Saying both would announce the
        // card twice, in two different vocabularies.
        expect(tab).not.toHaveAttribute('aria-pressed');
    });

    it('puts exactly one tab in the tab order', () => {
        render(<Harness />);
        const order = screen.getAllByRole('tab').map((tab) => tab.getAttribute('tabindex'));
        expect(order).toEqual(['0', '-1', '-1']);
    });

    it('hides the panels of the closed tabs', () => {
        render(<Harness mount="eager" />);
        const tab = screen.getByRole('tab', { name: /images/ });
        expect(document.getElementById(tab.getAttribute('aria-controls')!)).toHaveAttribute('hidden');
    });
});
