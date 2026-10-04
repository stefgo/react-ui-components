import type { Meta, StoryObj } from '@storybook/react-vite';
import { CopyField } from './CopyField';

const meta = {
    title: 'Forms/CopyField',
    component: CopyField,
    args: {
        value: 'dim_reg_3f9a0e7b5d1c4f0a9c2e8b7d6a5f4c21',
        'aria-label': 'Registration token'
    },
} satisfies Meta<typeof CopyField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Click the field to select the value, the button to copy it. Over plain HTTP
 * the browser has no clipboard: the button then selects the value and a line
 * below says so.
 */
export const Playground: Story = {};

/** A value longer than the field scrolls inside it; the button keeps its place. */
export const LongValue: Story = {
    args: { value: 'SHA256:nThbg6kXUpJWGl7E1IGOCspRomTxdCARLviKw6E5SY8 root@pbs-node-01.internal.example.org' },
    render: (args) => (
        <div className="max-w-sm">
            <CopyField {...args} />
        </div>
    ),
};
