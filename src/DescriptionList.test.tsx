import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DescriptionList } from './DescriptionList';

describe('DescriptionList', () => {
    it('pairs every value with its label', () => {
        render(
            <DescriptionList
                items={[
                    { label: 'Agent', value: 'v1.4.2' },
                    { label: 'Mode', value: 'Inbound' }
                ]}
            />
        );

        const terms = screen.getAllByRole('term');
        const definitions = screen.getAllByRole('definition');
        expect(terms.map((t) => t.textContent)).toEqual(['Agent', 'Mode']);
        expect(definitions.map((d) => d.textContent)).toEqual(['v1.4.2', 'Inbound']);
    });

    it('offers a copy button only where one is asked for, and copies the given text', async () => {
        const user = userEvent.setup();
        render(
            <DescriptionList
                items={[
                    { label: 'ID', value: '3f9a…c21', copyable: '3f9a0e7b-c21' },
                    { label: 'Agent', value: 'v1.4.2' }
                ]}
            />
        );

        const buttons = screen.getAllByRole('button', { name: 'Copy to clipboard' });
        expect(buttons).toHaveLength(1);

        await user.click(buttons[0]);
        // The copied text is the full value, not the shortened one on screen.
        await expect(navigator.clipboard.readText()).resolves.toBe('3f9a0e7b-c21');
        expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
    });

    it('lets a full-width item span every column', () => {
        render(
            <DescriptionList
                items={[
                    { label: 'Query', value: 'label=web', span: 'full' },
                    { label: 'Agent', value: 'v1.4.2' }
                ]}
            />
        );

        expect(screen.getByText('Query').parentElement).toHaveClass('col-span-full');
        expect(screen.getByText('Agent').parentElement).not.toHaveClass('col-span-full');
    });
});
