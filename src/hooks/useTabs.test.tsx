import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTabs, type UseTabsOptions } from './useTabs';
import { TabList, TabPanel } from '../Tabs';

const TABS = ['one', 'two', 'three'] as const;

const Harness = (options: Partial<UseTabsOptions> = {}) => {
    const tabs = useTabs({ tabs: TABS, defaultValue: 'one', ...options });
    return (
        <>
            <TabList tabs={tabs} aria-label="Sections">
                {(options.tabs ?? TABS).map((tab) => (
                    <button key={tab} {...tabs.tabProps(tab)}>{tab}</button>
                ))}
            </TabList>
            <TabPanel tabs={tabs} value={tabs.value}>{tabs.value}</TabPanel>
        </>
    );
};

const selected = () => screen.getByRole('tab', { selected: true }).textContent;

describe('useTabs keyboard', () => {
    it('walks the tabs with the arrow keys and selects as it goes', async () => {
        render(<Harness />);
        await userEvent.tab();
        expect(document.activeElement).toHaveTextContent('one');

        await userEvent.keyboard('{ArrowRight}');
        expect(selected()).toBe('two');
        expect(document.activeElement).toHaveTextContent('two');
    });

    it('wraps around at both ends', async () => {
        render(<Harness />);
        await userEvent.tab();
        await userEvent.keyboard('{ArrowLeft}');
        expect(selected()).toBe('three');
        await userEvent.keyboard('{ArrowRight}');
        expect(selected()).toBe('one');
    });

    it('jumps to the ends with Home and End', async () => {
        render(<Harness />);
        await userEvent.tab();
        await userEvent.keyboard('{End}');
        expect(selected()).toBe('three');
        await userEvent.keyboard('{Home}');
        expect(selected()).toBe('one');
    });

    it('moves focus without selecting while activation is manual', async () => {
        render(<Harness activation="manual" />);
        await userEvent.tab();
        await userEvent.keyboard('{ArrowRight}');

        expect(document.activeElement).toHaveTextContent('two');
        // The panel would otherwise load on the way past, which is the whole
        // reason a caller asks for manual activation.
        expect(selected()).toBe('one');

        await userEvent.keyboard('{Enter}');
        expect(selected()).toBe('two');
    });

    it('listens for the arrow keys of its own orientation only', async () => {
        render(<Harness orientation="vertical" />);
        await userEvent.tab();
        await userEvent.keyboard('{ArrowRight}');
        // Left and right belong to the page while the list runs downwards --
        // taking them would break scrolling and text navigation around it.
        expect(selected()).toBe('one');
        await userEvent.keyboard('{ArrowDown}');
        expect(selected()).toBe('two');
    });

    it('leaves one tab in the tab order as the focus moves', async () => {
        render(<Harness />);
        await userEvent.tab();
        await userEvent.keyboard('{ArrowRight}');
        const order = screen.getAllByRole('tab').map((tab) => tab.getAttribute('tabindex'));
        expect(order).toEqual(['-1', '0', '-1']);
    });
});

describe('useTabs state', () => {
    it('reports every change to a controlling caller', async () => {
        const onChange = vi.fn();
        render(<Harness value="one" onChange={onChange} />);
        await userEvent.click(screen.getByRole('tab', { name: 'three' }));
        expect(onChange).toHaveBeenCalledWith('three');
    });

    it('falls back to the first tab when the value names none of them', () => {
        render(<Harness value="gone" onChange={vi.fn()} />);
        // Clamped for rendering only: a tab list that loses an entry -- one
        // behind a permission, say -- must not write state from inside a render.
        expect(selected()).toBe('one');
    });
});
