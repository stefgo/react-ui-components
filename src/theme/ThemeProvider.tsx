import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Theme = 'dark' | 'light';

export interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

export interface ThemeProviderProps {
    /**
     * The `localStorage` key the choice is kept under. Required: the name
     * belongs to the app, and two apps on one origin must not share it.
     */
    storageKey: string;
    /** What a first visit sees. Default `'dark'`. */
    defaultTheme?: Theme;
    children: ReactNode;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const isTheme = (value: unknown): value is Theme => value === 'dark' || value === 'light';

const readStored = (key: string): Theme | undefined => {
    try {
        // The plain string, not JSON: that is what the apps stored before the
        // provider moved here, and a reader's choice should survive the move.
        const stored = localStorage.getItem(key);
        return isTheme(stored) ? stored : undefined;
    } catch {
        // Blocked storage reads as "nothing stored".
        return undefined;
    }
};

/**
 * Which theme is on, and the class on `<html>` that makes it so.
 *
 * The preset emits its dark tokens under `.dark` and sets `darkMode: "class"`,
 * so the class on the root element is the whole mechanism -- and every app
 * carried the same thirty lines to put it there. The stored value is checked
 * before it is used: anything but the two names falls back to the default
 * instead of ending up as a class.
 */
export const ThemeProvider = ({ storageKey, defaultTheme = 'dark', children }: ThemeProviderProps) => {
    const [theme, setTheme] = useState<Theme>(() => readStored(storageKey) ?? defaultTheme);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        try {
            localStorage.setItem(storageKey, theme);
        } catch {
            // A private window or a full quota: the theme still applies, it is
            // only not remembered.
        }
    }, [theme, storageKey]);

    const toggleTheme = useCallback(() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')), []);

    const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
