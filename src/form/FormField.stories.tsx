import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from './FormField';
import { Input } from '../Input';
import { Select } from '../Select';

const meta = {
    title: 'Forms/FormField',
    component: FormField,
    args: {
        label: 'Port',
        children: (ids) => (
            <input
                id={ids.id}
                aria-invalid={ids.invalid}
                aria-describedby={ids.describedBy}
                defaultValue="8007"
                className="block w-full bg-input-bg border border-input-border pl-3 pr-3 py-2.5 rounded-md text-text-primary sm:text-sm"
            />
        )
    }
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/**
 * The four states a field can be in. The interesting pair is the last two: an
 * error replaces the hint on screen *and* in `aria-describedby`, so nothing is
 * announced that is not visible.
 */
export const States: Story = {
    render: (args) => (
        <div className="space-y-6 max-w-sm">
            <FormField {...args} label="Plain" />
            <FormField {...args} label="Required" required />
            <FormField {...args} label="With hint" hint="Defaults to 8007" />
            <FormField {...args} label="With error" hint="Defaults to 8007" error="Must be a number" />
        </div>
    )
};

/**
 * `Input` and `Select` are both built on it, which is why their labels, hints
 * and error messages now line up down to the pixel. They used to differ.
 */
export const SharedByControls: Story = {
    render: () => (
        <div className="space-y-6 max-w-sm">
            <Input label="Server URL" hint="Include the scheme" placeholder="https://pbs.example.com" />
            <Select
                label="Schedule"
                hint="Runs in local time"
                options={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' }
                ]}
            />
            <Input label="Port" error="Must be a number" defaultValue="eighty" />
            <Select
                label="Retention"
                error="Pick a policy"
                options={[{ value: '', label: 'Choose…' }]}
            />
        </div>
    )
};
