import { WifiOff } from 'lucide-react';
import { ICON_SIZE } from './types';
import { cn } from './utils';

export interface ConnectionBannerProps {
    /** Whether the page's live connection is currently up. Nothing renders while it is. */
    connected: boolean;
    message?: string;
    className?: string;
}

/**
 * Says that the page has stopped receiving updates.
 *
 * The apps built on this library do not poll: a dashboard learns about changes only
 * through its socket. When the socket drops, everything on screen quietly freezes
 * while still looking live -- a status dot keeps pulsing "online" for a machine
 * nobody is watching any more. This is the line that says so.
 *
 * `role="status"` rather than `alert`: the page still works, it is only out of date,
 * and the message must not interrupt what the reader is doing.
 */
export const ConnectionBanner = ({
    connected,
    message = 'Connection to the server lost. What you see may be out of date. Reconnecting…',
    className
}: ConnectionBannerProps) => (
    <div role="status" aria-live="polite">
        {!connected && (
            <div
                className={cn(
                    'flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium',
                    'bg-badge-warning-bg text-badge-warning-text border-b border-border',
                    className
                )}
            >
                <WifiOff size={ICON_SIZE.md} aria-hidden className="shrink-0" />
                {message}
            </div>
        )}
    </div>
);
