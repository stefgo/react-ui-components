import { createContext, useContext, ReactNode } from 'react';
import { cn } from './utils';

export type StatusDotTone = 'success' | 'warning' | 'info' | 'error' | 'accent' | 'neutral' | 'unknown';

export interface StatusDotProps {
    /**
     * The role of the state, not the state itself: the caller maps its own words
     * ("online", "restarting", "exited") onto these.
     */
    tone: StatusDotTone;
    /**
     * Whether the dot pulses. Defaults to on for `success` only -- "this is live" --
     * and is worth turning off when nothing is watching the state any more, such as
     * while the dashboard has lost its connection.
     */
    pulse?: boolean;
    /** `md` for a header, `sm` for a row in a list. */
    size?: 'sm' | 'md';
    /**
     * The domain's own word for the state. With it the dot is an image that names
     * the state; without it the dot is decorative, for places that already say the
     * state in text beside it.
     */
    label?: string;
    className?: string;
}

const LiveContext = createContext(true);

export interface StatusDotProviderProps {
    /**
     * Whether the states below are still being watched. While `false`, no dot in the
     * subtree pulses, whatever its `pulse` says.
     */
    live: boolean;
    children: ReactNode;
}

/**
 * Stops every dot below from pulsing while the page has lost its live connection.
 *
 * A pulse says "this is happening now". A dashboard that no longer receives updates
 * cannot know that, and a dot pulsing "online" for a machine nobody is watching any
 * more is exactly the false comfort that let a dropped socket go unnoticed.
 */
export const StatusDotProvider = ({ live, children }: StatusDotProviderProps) => (
    <LiveContext.Provider value={live}>{children}</LiveContext.Provider>
);

const TONES: Record<StatusDotTone, string> = {
    success: 'bg-success shadow-glow-success',
    warning: 'bg-warning',
    info: 'bg-info',
    error: 'bg-error',
    accent: 'bg-accent',
    neutral: 'bg-border',
    unknown: 'bg-transparent border border-text-muted'
};

/**
 * A coloured dot for a live state: a connected client, a running container.
 *
 * The three apps each kept their own, with two different APIs -- one with a tone and
 * a label, one with an `online` boolean and a class string for everything else -- and
 * the second had no way to be announced at all.
 */
export const StatusDot = ({ tone, pulse, size = 'sm', label, className }: StatusDotProps) => {
    const live = useContext(LiveContext);
    const pulsing = live && (pulse ?? tone === 'success');

    return (
        <span
            {...(label ? { role: 'img', 'aria-label': label, title: label } : { 'aria-hidden': true })}
            className={cn(
                'inline-block rounded-full shrink-0',
                size === 'md' ? 'w-3 h-3' : 'w-2 h-2',
                TONES[tone],
                // The glow belongs to success alone; any other tone pulses plainly.
                pulsing && (tone === 'success' ? 'animate-pulse-glow' : 'animate-pulse'),
                !pulsing && tone === 'success' && 'shadow-none',
                className
            )}
        />
    );
};
