import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plug } from 'lucide-react';
import { Wizard, type WizardStep } from './Wizard';
import { Card } from './Card';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { Radio, RadioGroup } from './Radio';

const Body = ({ children }: { children: React.ReactNode }) => (
    <div className="space-y-4 text-sm text-text-secondary">{children}</div>
);

/**
 * The form state lives here, above the wizard — that is the contract: the
 * wizard renders one step at a time, so a step holding its own `useState`
 * would lose it on Back.
 */
const useDemoSteps = () => {
    const [mode, setMode] = useState('');
    const [host, setHost] = useState('');

    const steps: WizardStep[] = [
        {
            id: 'mode',
            label: 'Connection',
            canContinue: !!mode,
            content: (
                <Body>
                    <RadioGroup label="How do the two reach each other?" name="mode" value={mode} onChange={setMode}>
                        <Radio value="inbound" label="Inbound — the client dials the server" />
                        <Radio value="outbound" label="Outbound — the server dials the client" />
                    </RadioGroup>
                </Body>
            )
        },
        {
            id: 'host',
            label: 'Host',
            canContinue: host.trim().length > 0,
            content: (
                <Body>
                    <Input label="Target address" value={host} onChange={(e) => setHost(e.target.value)} placeholder="192.168.1.50:3001" />
                    <p>Go back and forth — both answers are still here.</p>
                </Body>
            )
        },
        {
            id: 'confirm',
            label: 'Confirm',
            content: (
                <Body>
                    <p>Mode: <span className="text-text-primary">{mode || '—'}</span></p>
                    <p>Address: <span className="text-text-primary">{host || '—'}</span></p>
                </Body>
            )
        }
    ];

    return steps;
};

const meta = {
    title: 'Foundational/Wizard',
    component: Wizard,
    parameters: { layout: 'padded' },
    args: { steps: [] }
} satisfies Meta<typeof Wizard>;

export default meta;
type Story = StoryObj<typeof meta>;

const InlineDemo = () => {
    const steps = useDemoSteps();
    return (
        <Card title="Add client" className="mx-auto flex max-w-2xl flex-col" padding="none">
            <Wizard steps={steps} onFinish={() => alert('created')} finishLabel="Create client" finishIcon={Plug} onCancel={() => alert('cancelled')} />
        </Card>
    );
};

/** Inline in a `Card` — the layout a page-level flow uses. */
export const InCard: Story = { render: () => <InlineDemo /> };

const ModalDemo = () => {
    const [open, setOpen] = useState(true);
    const steps = useDemoSteps();
    return (
        <>
            <Button onClick={() => setOpen(true)}>Add client</Button>
            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Add client"
                size="lg"
                closeOnOverlayClick={false}
                classNames={{ body: 'flex p-0' }}
            >
                <Wizard steps={steps} onCancel={() => setOpen(false)} onFinish={() => setOpen(false)} finishLabel="Create client" finishIcon={Plug} />
            </Modal>
        </>
    );
};

/**
 * In a `Modal`: the wizard brings its own footer, so the modal gets none —
 * `classNames={{ body: 'flex p-0' }}` hands the padding and the scroll
 * container to the wizard instead.
 */
export const InModal: Story = { render: () => <ModalDemo /> };

const BranchingDemo = () => {
    const [mode, setMode] = useState<'inbound' | 'outbound' | ''>('');
    const [index, setIndex] = useState(0);

    const first: WizardStep = {
        id: 'mode',
        label: 'Connection',
        canContinue: !!mode,
        content: (
            <Body>
                <RadioGroup label="Connection mode" name="branch" value={mode} onChange={(v) => setMode(v as 'inbound' | 'outbound')}>
                    <Radio value="inbound" label="Inbound (2 steps)" />
                    <Radio value="outbound" label="Outbound (4 steps)" />
                </RadioGroup>
            </Body>
        )
    };

    const rest: WizardStep[] =
        mode === 'outbound'
            ? [
                { id: 'agent', label: 'Agent', content: <Body><p>Agent details</p></Body> },
                { id: 'ssh', label: 'SSH', content: <Body><p>SSH details</p></Body> },
                { id: 'verify', label: 'Verify', content: <Body><p>Test the connection</p></Body> }
            ]
            : [{ id: 'token', label: 'Token', hideBack: true, content: <Body><p>The token has been issued — there is no way back from here.</p></Body> }];

    return (
        <Card className="mx-auto flex max-w-2xl flex-col">
            <Wizard
                steps={[first, ...rest]}
                value={index}
                onChange={setIndex}
                onFinish={() => alert('done')}
                finishLabel="Done"
                onCancel={() => setIndex(0)}
            />
        </Card>
    );
};

/**
 * A branching flow: the step list depends on the answer given in step 1, which
 * is why the index has to be controlled. The last inbound step sets `hideBack`
 * — it has already issued a token, and going back would suggest that can be
 * taken back.
 */
export const Branching: Story = { render: () => <BranchingDemo /> };

const SelectableDemo = () => {
    const steps = useDemoSteps();
    return (
        <Card className="mx-auto flex max-w-2xl flex-col">
            <Wizard steps={steps} allowStepSelect onFinish={() => alert('done')} />
        </Card>
    );
};

/** `allowStepSelect` turns the finished steps in the strip into the way back. */
export const StepSelect: Story = { render: () => <SelectableDemo /> };
