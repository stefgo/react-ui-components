import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Clock, Globe } from 'lucide-react';
import { SideTab } from './SideTab';
import { TabList, TabPanel } from './Tabs';
import { useTabs } from './hooks/useTabs';

const SECTIONS = ['general', 'retention'] as const;

const Page = () => {
    const tabs = useTabs({ tabs: SECTIONS, orientation: 'vertical' });
    return (
        <>
            <TabList tabs={tabs} aria-label="Settings sections">
                <SideTab tabs={tabs} value="general" icon={Globe}>General</SideTab>
                <SideTab tabs={tabs} value="retention" icon={Clock} trailing={<span>(unsaved changes)</span>}>
                    Retention
                </SideTab>
            </TabList>
            <TabPanel tabs={tabs} value="general">General settings</TabPanel>
            <TabPanel tabs={tabs} value="retention">Retention settings</TabPanel>
        </>
    );
};

describe('SideTab', () => {
    it('is a tab that names its panel', () => {
        render(<Page />);

        const general = screen.getByRole('tab', { name: 'General' });
        expect(general).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tabpanel', { name: 'General' })).toHaveTextContent('General settings');
    });

    it('carries what trails the name into the name', () => {
        // The dot that marks unsaved changes is invisible to a screen reader;
        // the words beside it are what make the marker exist there.
        render(<Page />);
        expect(screen.getByRole('tab', { name: /Retention.*unsaved changes/ })).toBeInTheDocument();
    });

    it('opens its panel on a click', async () => {
        render(<Page />);
        await userEvent.click(screen.getByRole('tab', { name: /Retention/ }));

        expect(screen.getByRole('tab', { name: /Retention/ })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tabpanel', { name: /Retention/ })).toHaveTextContent('Retention settings');
    });

    it('is walked with the arrow keys of a column', async () => {
        render(<Page />);
        await userEvent.tab();
        await userEvent.keyboard('{ArrowDown}');

        expect(screen.getByRole('tab', { name: /Retention/ })).toHaveFocus();
        expect(screen.getByRole('tab', { name: /Retention/ })).toHaveAttribute('aria-selected', 'true');
    });
});
