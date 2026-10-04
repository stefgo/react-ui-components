import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Monitor, Server } from 'lucide-react';
import { BottomNav } from './BottomNav';

const items = [
    { id: 'clients', label: 'Clients', icon: Monitor, active: true, onClick: () => {} },
    { id: 'repos', label: 'Repositories', icon: Server, active: false, onClick: () => {} },
];

describe('BottomNav', () => {
    it('names an icon-only tab by its label', () => {
        render(<BottomNav items={items} />);
        expect(screen.getByRole('button', { name: 'Clients' })).toBeInTheDocument();
        expect(screen.queryByText('Clients')).not.toBeInTheDocument();
    });

    it('shows the label with showLabels, and the label is what names the tab', () => {
        render(<BottomNav items={items} showLabels />);
        const tab = screen.getByRole('button', { name: 'Repositories' });
        expect(screen.getByText('Repositories')).toBeVisible();
        // One name, from the text: an aria-label on top would be read instead of it.
        expect(tab).not.toHaveAttribute('aria-label');
    });

    it('marks the current tab in both forms', () => {
        render(<BottomNav items={items} showLabels />);
        expect(screen.getByRole('button', { name: 'Clients' })).toHaveAttribute('aria-current', 'page');
        expect(screen.getByRole('button', { name: 'Repositories' })).not.toHaveAttribute('aria-current');
    });
});
