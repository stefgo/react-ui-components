import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * A reference sheet of the design tokens as they actually render.
 *
 * It exists to make the two open questions visible rather than arguable:
 * the corner radii below come from four different steps, and every colour still
 * needs a `dark:` twin written by hand at each call site.
 */
const meta = {
    title: 'Design tokens/Overview',
    parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-10">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">{title}</h2>
        {children}
    </section>
);

const Swatch = ({ className, name }: { className: string; name: string }) => (
    <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-md border border-border dark:border-border-dark ${className}`} />
        <code className="text-xs text-text-secondary dark:text-text-secondary-dark">{name}</code>
    </div>
);

export const Colours: Story = {
    render: () => (
        <>
            <Section title="Brand & state">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Swatch className="bg-primary" name="bg-primary" />
                    <Swatch className="bg-primary-hover" name="bg-primary-hover" />
                    <Swatch className="bg-success" name="bg-success" />
                    <Swatch className="bg-warning" name="bg-warning" />
                    <Swatch className="bg-error" name="bg-error" />
                    <Swatch className="bg-info" name="bg-info" />
                    <Swatch className="bg-accent" name="bg-accent" />
                    <Swatch className="bg-overlay" name="bg-overlay" />
                </div>
            </Section>

            <Section title="Surfaces — each needs a dark: twin at every call site">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Swatch className="bg-app-bg dark:bg-app-bg-dark" name="bg-app-bg" />
                    <Swatch className="bg-card dark:bg-card-dark" name="bg-card" />
                    <Swatch className="bg-card-header dark:bg-card-header-dark" name="bg-card-header" />
                    <Swatch className="bg-hover dark:bg-hover-dark" name="bg-hover" />
                    <Swatch className="bg-input-bg dark:bg-input-bg-dark" name="bg-input-bg" />
                    <Swatch className="bg-sidebar-bg dark:bg-sidebar-bg-dark" name="bg-sidebar-bg" />
                    <Swatch className="bg-table-header dark:bg-table-header-dark" name="bg-table-header" />
                    <Swatch className="bg-statcard-bg dark:bg-statcard-bg-dark" name="bg-statcard-bg" />
                </div>
            </Section>

            <Section title="Text">
                <div className="space-y-2">
                    <p className="text-text-primary dark:text-text-primary-dark">text-primary — headings and emphasis</p>
                    <p className="text-text-secondary dark:text-text-secondary-dark">text-secondary — body copy</p>
                    <p className="text-text-muted dark:text-text-muted-dark">text-muted — labels and inactive text</p>
                </div>
            </Section>
        </>
    ),
};

/** Four different radius steps are in use today. This is what motivates the scale. */
export const Radii: Story = {
    render: () => (
        <Section title="Corner radii in use">
            <div className="flex flex-wrap gap-6">
                {['rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-full'].map((r) => (
                    <div key={r} className="text-center">
                        <div className={`w-20 h-20 bg-card dark:bg-card-dark border border-border dark:border-border-dark ${r}`} />
                        <code className="mt-2 block text-[11px] text-text-muted dark:text-text-muted-dark">{r}</code>
                    </div>
                ))}
            </div>
        </Section>
    ),
};

export const Layering: Story = {
    render: () => (
        <Section title="Z-index scale">
            <ul className="text-sm space-y-1 text-text-secondary dark:text-text-secondary-dark">
                {[
                    ['z-sticky', '10', 'sticky table headers'],
                    ['z-header', '30', 'DashboardHeader'],
                    ['z-bottomnav', '40', 'BottomNav'],
                    ['z-dropdown', '50', 'ActionMenu, UserMenu'],
                    ['z-overlay', '60', 'modal backdrops'],
                    ['z-modal', '70', 'reserved for dialogs'],
                ].map(([cls, value, use]) => (
                    <li key={cls} className="flex gap-4">
                        <code className="w-28 text-text-primary dark:text-text-primary-dark">{cls}</code>
                        <span className="w-10 tabular-nums">{value}</span>
                        <span>{use}</span>
                    </li>
                ))}
            </ul>
        </Section>
    ),
};
