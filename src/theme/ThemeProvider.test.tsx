import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from './ThemeProvider';

const KEY = 'test.app.theme';

const Probe = () => {
    const { theme, toggleTheme } = useTheme();
    return <button onClick={toggleTheme}>{theme}</button>;
};

const renderProbe = (defaultTheme?: 'dark' | 'light') =>
    render(
        <ThemeProvider storageKey={KEY} defaultTheme={defaultTheme}>
            <Probe />
        </ThemeProvider>
    );

describe('ThemeProvider', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.className = '';
    });

    it('starts dark and says so on the root element', () => {
        renderProbe();
        expect(screen.getByRole('button')).toHaveTextContent('dark');
        expect(document.documentElement).toHaveClass('dark');
    });

    it('switches the class and remembers the choice', async () => {
        renderProbe();
        await userEvent.click(screen.getByRole('button'));

        expect(document.documentElement).toHaveClass('light');
        expect(document.documentElement).not.toHaveClass('dark');
        // The plain string, as the apps stored it before the provider moved here.
        expect(localStorage.getItem(KEY)).toBe('light');
    });

    it('comes back with what was stored', () => {
        localStorage.setItem(KEY, 'light');
        renderProbe();
        expect(screen.getByRole('button')).toHaveTextContent('light');
    });

    it('does not turn a stored value it does not know into a class', () => {
        localStorage.setItem(KEY, 'solarized');
        renderProbe('light');

        expect(screen.getByRole('button')).toHaveTextContent('light');
        expect(document.documentElement).not.toHaveClass('solarized');
    });

    it('refuses to be read outside its provider', () => {
        expect(() => render(<Probe />)).toThrow(/within a ThemeProvider/);
    });
});
