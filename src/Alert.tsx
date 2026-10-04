import { ReactNode } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { ICON_SIZE, type IconComponent } from './types';
import { cn } from './utils';

export type AlertTone = 'error' | 'success' | 'warning' | 'info' | 'neutral';

export interface AlertClassNames {
    icon?: string;
    title?: string;
    body?: string;
}

export interface AlertProps {
    /** The role of the message. Default `'error'`: that is what most of them are. */
    tone?: AlertTone;
    /** What happened, in a line: "Could not load the users". */
    title?: ReactNode;
    /** The detail below the title -- or the whole message, without one. */
    children?: ReactNode;
    /** Replaces the tone's icon; `null` shows none. */
    icon?: IconComponent | null;
    className?: string;
    classNames?: AlertClassNames;
}

const TONES: Record<AlertTone, { icon: IconComponent; box: string }> = {
    error: { icon: AlertCircle, box: 'bg-error-bg text-error' },
    success: { icon: CheckCircle2, box: 'bg-success-bg text-success' },
    warning: { icon: AlertTriangle, box: 'bg-warning-bg text-warning' },
    info: { icon: Info, box: 'bg-info-bg text-info' },
    neutral: { icon: Info, box: 'bg-app-bg text-text-muted border border-border' }
};

/**
 * A message that stays in the page: a read that failed, a save the server
 * refused, the result of a test.
 *
 * Two apps wrote this box by hand in eleven places, with two paddings, two
 * radii and -- for the success case -- a background class that did not exist,
 * so a delivered webhook was reported in green text on nothing.
 *
 * An error interrupts (`role="alert"`); every other tone is announced when the
 * reader gets to it (`role="status"`), which is the same split `Toast` makes.
 * What is asked rather than told belongs in a `ConfirmDialog`, and what
 * happened elsewhere and will pass in a toast.
 */
export const Alert = ({ tone = 'error', title, children, icon, className, classNames }: AlertProps) => {
    const { icon: ToneIcon, box } = TONES[tone];
    const Icon = icon === null ? null : icon ?? ToneIcon;

    return (
        <div
            role={tone === 'error' ? 'alert' : 'status'}
            className={cn("flex items-start gap-3 rounded-md p-3 text-sm", box, className)}
        >
            {Icon && <Icon size={ICON_SIZE.md} aria-hidden className={cn("mt-0.5 shrink-0", classNames?.icon)} />}
            <div className="min-w-0 flex-1 break-words">
                {title && <div className={cn("font-medium", classNames?.title)}>{title}</div>}
                {children && <div className={cn(title ? "mt-1" : undefined, classNames?.body)}>{children}</div>}
            </div>
        </div>
    );
};
