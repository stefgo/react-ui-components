import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Wizard, type WizardStep } from './Wizard';

const steps = (overrides: Partial<WizardStep>[] = []): WizardStep[] =>
    [
        { id: 'a', label: 'Mode', content: <p>Pick a mode</p> },
        { id: 'b', label: 'Details', content: <p>Fill in details</p> },
        { id: 'c', label: 'Confirm', content: <p>Confirm it</p> }
    ].map((step, i) => ({ ...step, ...overrides[i] }));

describe('Wizard', () => {
    it('shows only the current step', async () => {
        render(<Wizard steps={steps()} />);

        expect(screen.getByText('Pick a mode')).toBeInTheDocument();
        expect(screen.queryByText('Fill in details')).not.toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: 'Next' }));
        expect(screen.getByText('Fill in details')).toBeInTheDocument();
        expect(screen.queryByText('Pick a mode')).not.toBeInTheDocument();
    });

    it('blocks the way forward while the step is incomplete', async () => {
        render(<Wizard steps={steps([{ canContinue: false }])} />);

        expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    });

    it('goes back to the previous step, and offers no Back on the first', async () => {
        render(<Wizard steps={steps()} />);

        expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: 'Next' }));
        await userEvent.click(screen.getByRole('button', { name: /back/i }));

        expect(screen.getByText('Pick a mode')).toBeInTheDocument();
    });

    it('hides Back on a step that cannot be undone', async () => {
        render(<Wizard steps={steps([{}, { hideBack: true }])} defaultValue={1} />);

        expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
    });

    it('replaces Next with the finish action on the last step', async () => {
        const onFinish = vi.fn();
        render(<Wizard steps={steps()} defaultValue={2} onFinish={onFinish} finishLabel="Create" />);

        expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: 'Create' }));
        expect(onFinish).toHaveBeenCalled();
    });

    it('leaves the step index to a controlled caller', async () => {
        const onChange = vi.fn();
        render(<Wizard steps={steps()} value={0} onChange={onChange} />);

        await userEvent.click(screen.getByRole('button', { name: 'Next' }));

        expect(onChange).toHaveBeenCalledWith(1);
        expect(screen.getByText('Pick a mode')).toBeInTheDocument();
    });

    it('survives a branch that got shorter than the current index', () => {
        // A caller that swaps the step list on step 3 for a branch with two
        // steps must not be handed an undefined step.
        const { rerender } = render(<Wizard steps={steps()} value={2} />);
        rerender(<Wizard steps={steps().slice(0, 2)} value={2} />);

        expect(screen.getByText('Fill in details')).toBeInTheDocument();
    });

    it('keeps navigation out of reach while finishing', () => {
        render(<Wizard steps={steps()} defaultValue={2} onFinish={vi.fn()} onCancel={vi.fn()} isFinishing />);

        expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /back/i })).toBeDisabled();
    });
});
