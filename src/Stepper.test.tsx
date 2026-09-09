import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Stepper } from './Stepper';

const steps = [
    { id: 'mode', label: 'Connection' },
    { id: 'agent', label: 'Agent' },
    { id: 'ssh', label: 'SSH' }
];

describe('Stepper', () => {
    it('marks the current step and only that one', () => {
        render(<Stepper steps={steps} current={1} />);

        const items = screen.getAllByRole('listitem');
        expect(items.map((li) => li.getAttribute('aria-current'))).toEqual([null, 'step', null]);
    });

    it('says which steps are done, so the marker is not the only cue', () => {
        render(<Stepper steps={steps} current={2} />);

        expect(screen.getByText(/^Connection/).textContent).toContain('completed');
        expect(screen.getByText(/^SSH/).textContent).not.toContain('completed');
    });

    it('is inert without onStepSelect', () => {
        render(<Stepper steps={steps} current={2} />);

        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    it('offers completed steps as controls, and nothing else', async () => {
        const onStepSelect = vi.fn();
        render(<Stepper steps={steps} current={2} onStepSelect={onStepSelect} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(2);

        await userEvent.click(buttons[0]);
        expect(onStepSelect).toHaveBeenCalledWith(0);
    });

    it('reaches those controls by keyboard', async () => {
        const onStepSelect = vi.fn();
        render(<Stepper steps={steps} current={1} onStepSelect={onStepSelect} />);

        await userEvent.tab();
        expect(screen.getByRole('button')).toHaveFocus();

        await userEvent.keyboard('{Enter}');
        expect(onStepSelect).toHaveBeenCalledWith(0);
    });
});
