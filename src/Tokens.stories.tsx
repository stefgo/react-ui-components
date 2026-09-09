import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * A reference sheet of the design tokens as they actually render.
 *
 * Every swatch below carries exactly one class, and that is the point of the
 * sheet: a colour is `bg-card`, never that class paired with a hand-written
 * dark twin. The `.dark` block redefines the variable, so one class covers both
 * themes. Read it in Storybook's side-by-side theme mode, where a token that
 * resolves in only one of the two is immediately visible.
 */
const meta = {
    title: 'Design tokens/Overview',
    parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-10">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-text-muted">{title}</h2>
        {children}
    </section>
);

const Swatch = ({ className, name }: { className: string; name: string }) => (
    <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-md border border-border ${className}`} />
        <code className="text-xs text-text-secondary">{name}</code>
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

            <Section title="Surfaces">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Swatch className="bg-app-bg" name="bg-app-bg" />
                    <Swatch className="bg-card" name="bg-card" />
                    <Swatch className="bg-card-header" name="bg-card-header" />
                    <Swatch className="bg-hover" name="bg-hover" />
                    <Swatch className="bg-input-bg" name="bg-input-bg" />
                    <Swatch className="bg-sidebar-bg" name="bg-sidebar-bg" />
                    <Swatch className="bg-table-header" name="bg-table-header" />
                    <Swatch className="bg-statcard-bg" name="bg-statcard-bg" />
                </div>
            </Section>

            <Section title="Text">
                <div className="space-y-2">
                    <p className="text-text-primary">text-primary — headings and emphasis</p>
                    <p className="text-text-secondary">text-secondary — body copy</p>
                    <p className="text-text-muted">text-muted — labels and inactive text</p>
                </div>
            </Section>
        </>
    ),
};

/**
 * The radius scale, with the role each step is for. `borderRadius` in the preset
 * replaces Tailwind's own steps, so anything outside this list — `rounded-2xl`,
 * say — is a step the library has no opinion about and should not be reached for.
 */
export const Radii: Story = {
    render: () => (
        <Section title="Corner radii">
            <div className="flex flex-wrap gap-6">
                {[
                    ['rounded-sm', 'inline chips, small controls'],
                    ['rounded-md', 'buttons, inputs, menus'],
                    ['rounded-lg', 'cards, panels, sheets'],
                    ['rounded-xl', 'large surfaces, mobile sheets'],
                    ['rounded-full', 'pills and icon buttons'],
                ].map(([r, use]) => (
                    <div key={r} className="w-32 text-center">
                        <div className={`w-20 h-20 mx-auto bg-card border border-border ${r}`} />
                        <code className="mt-2 block text-[11px] text-text-primary">{r}</code>
                        <span className="block text-[11px] text-text-muted">{use}</span>
                    </div>
                ))}
            </div>
        </Section>
    ),
};

export const Layering: Story = {
    render: () => (
        <Section title="Z-index scale">
            <ul className="text-sm space-y-1 text-text-secondary">
                {[
                    ['z-sticky', '10', 'sticky table headers'],
                    ['z-header', '30', 'DashboardHeader'],
                    ['z-bottomnav', '40', 'BottomNav'],
                    ['z-dropdown', '50', 'ActionMenu, UserMenu'],
                    ['z-overlay', '60', 'modal backdrops'],
                    ['z-modal', '70', 'reserved for dialogs'],
                ].map(([cls, value, use]) => (
                    <li key={cls} className="flex gap-4">
                        <code className="w-28 text-text-primary">{cls}</code>
                        <span className="w-10 tabular-nums">{value}</span>
                        <span>{use}</span>
                    </li>
                ))}
            </ul>
        </Section>
    ),
};
