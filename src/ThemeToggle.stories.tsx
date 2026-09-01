import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeToggle } from './ThemeToggle';

const meta = {
    title: 'Foundational/ThemeToggle',
    component: ThemeToggle,
    args: { theme: 'light', onToggle: () => {} },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The icon shows the theme you would switch *to*, not the current one. */
export const Light: Story = {};
export const Dark: Story = { args: { theme: 'dark' } };

const ToggleDemo = () => {
    const [theme, setTheme] = useState('light');
    return (
        <div className={theme === 'dark' ? 'dark' : undefined}>
            <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
                <ThemeToggle theme={theme} onToggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} />
                <span className="text-sm text-text-secondary">
                    Current theme: <strong className="text-text-primary">{theme}</strong>
                </span>
            </div>
        </div>
    );
};

export const Interactive: Story = { render: () => <ToggleDemo /> };
