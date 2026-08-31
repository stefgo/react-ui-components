import type { ComponentType } from 'react';

/**
 * What every component in this library passes to an icon it renders.
 *
 * Deliberately a subset of `lucide-react`'s `LucideProps`, so any lucide icon
 * satisfies it, but small enough that a hand-written SVG component does too —
 * the library must not force a dependency on one icon set.
 */
export interface IconProps {
    size?: number | string;
    className?: string;
    strokeWidth?: number | string;
    'aria-hidden'?: boolean;
}

/**
 * Icons are passed as components, never as elements.
 *
 * `icon={Save}`, not `icon={<Save size={16} />}`: only the component form lets
 * the surface decide the size and set `aria-hidden` itself. With elements the
 * caller has to know both, and every caller answers differently.
 */
export type IconComponent = ComponentType<IconProps>;

/**
 * The size scale for controls that take one: `Button`, `ActionButton`, `Badge`.
 * The numbers are the icon edge lengths that go with each step.
 *
 * Navigation and display surfaces (`Sidebar`, `BottomNav`, `StatCard`) size
 * their icons from their own layout instead — they are not sized controls, and
 * pretending otherwise would give them a prop with only one sensible value.
 */
export const ICON_SIZE = {
    sm: 14,
    md: 16,
    lg: 20
} as const;

export type ControlSize = keyof typeof ICON_SIZE;
