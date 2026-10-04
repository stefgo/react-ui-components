import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Clock, Globe, Save, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { FieldLabel } from './form/FieldLabel';
import { NumberField } from './NumberField';
import { SectionHeader } from './SectionHeader';
import { SideTab } from './SideTab';
import { TabList, TabPanel } from './Tabs';
import { useTabs } from './hooks/useTabs';

const meta = {
    title: 'Composition/Settings page',
    parameters: {
        docs: {
            description: {
                component:
                    'The pieces a settings page is made of: a column of `SideTab`s in a `TabList`, and per '
                    + 'panel a `SectionHeader` over its fields. `NumberField` is the field most sections '
                    + 'consist of; `FieldLabel` captions what is not one of the library’s controls.',
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SECTIONS = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'retention', label: 'Retention', icon: Clock },
    { id: 'cleanup', label: 'Cleanup', icon: Trash2 },
] as const;

const Page = () => {
    const tabs = useTabs({ tabs: SECTIONS.map((s) => s.id), orientation: 'vertical' });
    const [days, setDays] = useState('30');
    const dirty = days !== '30';

    return (
        <Card title="Settings" padding="none" className="overflow-visible">
            <div className="flex flex-col md:flex-row min-h-[360px]">
                <TabList
                    tabs={tabs}
                    aria-label="Settings sections"
                    className="w-full md:w-64 shrink-0 bg-app-bg border-b md:border-b-0 md:border-r md:rounded-bl-lg border-border py-4 flex flex-col gap-1"
                >
                    {SECTIONS.map((section) => (
                        <SideTab
                            key={section.id}
                            tabs={tabs}
                            value={section.id}
                            icon={section.icon}
                            trailing={
                                section.id === 'retention' && dirty && (
                                    <>
                                        <span aria-hidden="true" className="w-2 h-2 rounded-full bg-warning" />
                                        <span className="sr-only">(unsaved changes)</span>
                                    </>
                                )
                            }
                        >
                            {section.label}
                        </SideTab>
                    ))}
                </TabList>

                <div className="flex-1 min-w-0">
                    <TabPanel tabs={tabs} value="general" className="p-8">
                        <SectionHeader title="General">Where this server is reached, and by what name.</SectionHeader>
                        <FieldLabel as="p">Public address</FieldLabel>
                        <p className="ml-1 font-mono text-sm text-text-primary">https://dim.example.org</p>
                    </TabPanel>
                    <TabPanel tabs={tabs} value="retention" className="p-8 space-y-6">
                        <SectionHeader title="Retention of activity">
                            How long events are kept. A scheduled cleanup removes the ones older than that.
                        </SectionHeader>
                        <NumberField
                            label="Retention (days)"
                            min={1}
                            value={days}
                            onChange={setDays}
                            hint="Anything below 1 becomes 1."
                        />
                        <div className="flex justify-end border-t border-border pt-4">
                            <Button variant="primary" icon={Save} disabled={!dirty}>Save</Button>
                        </div>
                    </TabPanel>
                    <TabPanel tabs={tabs} value="cleanup" className="p-8">
                        <SectionHeader title="Cleanup">Nothing to configure here yet.</SectionHeader>
                    </TabPanel>
                </div>
            </div>
        </Card>
    );
};

/** Change the number under Retention: the tab gets its marker. Arrow Up and Down walk the column. */
export const SettingsPage: Story = { render: () => <Page /> };
