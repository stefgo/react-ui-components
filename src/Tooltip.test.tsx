import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from './Tooltip';

const tip = (props: Partial<Parameters<typeof Tooltip>[0]> = {}) =>
    render(
        <Tooltip content="Runs the job now" delay={0} {...props}>
            <button type="button">Run</button>
        </Tooltip>
    );

describe('Tooltip', () => {
    it('stays closed until asked', () => {
        tip();
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('opens on focus, with no delay', async () => {
        tip({ delay: 5000 });

        await userEvent.tab();
        // A keyboard user has already committed by focusing; making them wait
        // five seconds for the explanation would be absurd.
        expect(screen.getByRole('tooltip')).toHaveTextContent('Runs the job now');
    });

    it('describes the trigger without renaming it', async () => {
        tip();

        await userEvent.tab();
        const trigger = screen.getByRole('button', { name: 'Run' });
        expect(trigger).toHaveAccessibleName('Run');
        expect(trigger).toHaveAccessibleDescription('Runs the job now');
    });

    it('closes again on blur', async () => {
        tip();

        await userEvent.tab();
        expect(screen.getByRole('tooltip')).toBeInTheDocument();

        await userEvent.tab();
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('closes on Escape while the trigger keeps focus', async () => {
        tip();

        await userEvent.tab();
        await userEvent.keyboard('{Escape}');

        // Required by WAI-ARIA: a tooltip can cover the content being read.
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Run' })).toHaveFocus();
    });

    it('opens on hover and closes when the pointer leaves', async () => {
        tip();

        await userEvent.hover(screen.getByRole('button'));
        expect(await screen.findByRole('tooltip')).toBeInTheDocument();

        await userEvent.unhover(screen.getByRole('button'));
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('stays out of the way when disabled', async () => {
        tip({ disabled: true });

        await userEvent.tab();
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        expect(screen.getByRole('button')).not.toHaveAttribute('aria-describedby');
    });
});
