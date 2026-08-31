import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Monitor, Settings } from 'lucide-react';
import { Dashboard, DashboardPage } from './Dashboard';

const pages: DashboardPage[] = [
    {
        id: 'clients',
        path: ['/', '/clients'],
        nav: { label: 'Clients', icon: Monitor, onClick: vi.fn() },
    },
    {
        id: 'settings',
        path: '/settings',
        nav: { label: 'Settings', icon: Settings, placement: 'mobile-more', onClick: vi.fn() },
    },
];

const renderDashboard = (currentPath: string) =>
    render(
        <Dashboard
            username="stefan"
            onLogout={vi.fn()}
            theme="light"
            onToggleTheme={vi.fn()}
            isSidebarCollapsed={false}
            onToggleSidebar={vi.fn()}
            pages={pages}
            currentPath={currentPath}
        >
            <p>Page content</p>
        </Dashboard>
    );

describe('Dashboard', () => {
    it('renders the content it is given', () => {
        renderDashboard('/clients');
        expect(screen.getByText('Page content')).toBeInTheDocument();
    });

    it('highlights the entry matching the current path', () => {
        renderDashboard('/clients');
        const [sidebarItem] = screen.getAllByRole('button', { name: 'Clients' });
        expect(sidebarItem).toHaveAttribute('aria-current', 'page');
    });

    // Used to fall back to pages[0], so an unknown URL silently highlighted — and
    // rendered — the first page.
    it('highlights nothing when no page matches', () => {
        renderDashboard('/does-not-exist');
        expect(document.querySelectorAll('[aria-current="page"]')).toHaveLength(0);
    });

    it('shows mobile-more entries in the desktop sidebar', () => {
        renderDashboard('/clients');
        expect(screen.getAllByRole('button', { name: 'Settings' }).length).toBeGreaterThan(0);
    });

    describe('mobile more sheet', () => {
        const openSheet = async () => {
            await userEvent.click(screen.getByRole('button', { name: 'More' }));
            return screen.getByRole('dialog');
        };

        it('opens as a modal dialog', async () => {
            renderDashboard('/clients');
            const dialog = await openSheet();

            expect(dialog).toHaveAttribute('aria-modal', 'true');
            expect(dialog).toHaveAccessibleName('More');
        });

        it('closes on Escape', async () => {
            renderDashboard('/clients');
            await openSheet();

            await userEvent.keyboard('{Escape}');
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('closes when tapping the backdrop', async () => {
            renderDashboard('/clients');
            const dialog = await openSheet();

            await userEvent.click(dialog.parentElement!);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('locks the page behind it', async () => {
            renderDashboard('/clients');
            await openSheet();
            expect(document.body).toHaveStyle({ overflow: 'hidden' });

            await userEvent.keyboard('{Escape}');
            expect(document.body).not.toHaveStyle({ overflow: 'hidden' });
        });
    });
});
