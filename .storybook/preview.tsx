import type { Preview, Decorator } from '@storybook/react-vite';
import React from 'react';
import '../src/index.css';

/**
 * Every story renders inside the library's own page background, so components
 * are judged on the surface they actually sit on rather than on white.
 *
 * The `side-by-side` mode is the one that matters for token work: it renders the
 * same story in light and dark next to each other, which is the only way to see
 * that a pair of colours belongs to the same semantic role.
 */
const Surface = ({ dark, label, children }: { dark?: boolean; label?: string; children: React.ReactNode }) => (
    <div className={dark ? 'dark' : undefined}>
        <div className="bg-app-bg dark:bg-app-bg-dark text-text-primary dark:text-text-primary-dark p-6 min-h-[8rem]">
            {label && (
                <div className="mb-4 text-[10px] font-bold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
                    {label}
                </div>
            )}
            {children}
        </div>
    </div>
);

const withTheme: Decorator = (Story, context) => {
    const theme = context.globals.theme ?? 'light';

    if (theme === 'side-by-side') {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border dark:bg-border-dark">
                <Surface label="Light"><Story /></Surface>
                <Surface dark label="Dark"><Story /></Surface>
            </div>
        );
    }

    return (
        <Surface dark={theme === 'dark'}>
            <Story />
        </Surface>
    );
};

const preview: Preview = {
    decorators: [withTheme],
    globalTypes: {
        theme: {
            description: 'Colour scheme',
            toolbar: {
                title: 'Theme',
                icon: 'contrast',
                items: [
                    { value: 'light', title: 'Light', icon: 'sun' },
                    { value: 'dark', title: 'Dark', icon: 'moon' },
                    { value: 'side-by-side', title: 'Side by side', icon: 'sidebyside' },
                ],
                dynamicTitle: true,
            },
        },
    },
    initialGlobals: {
        theme: 'light',
    },
    parameters: {
        controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
        // Every axe rule stays at 'error' — a violation fails the test run rather
        // than sitting in the panel. The one exception is contrast: it is turned
        // off globally by request. Nothing checks colour pairs automatically any
        // more, so a token change has to be judged by eye in `side-by-side`.
        a11y: {
            test: 'error',
            options: {
                rules: { 'color-contrast': { enabled: false } },
            },
        },
        layout: 'fullscreen',
    },
};

export default preview;
