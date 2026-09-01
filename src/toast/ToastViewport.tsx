import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { ICON_SIZE, type IconComponent } from '../types';
import { cn } from '../utils';
import type { Toast, ToastVariant } from './types';

export type ToastPlacement =
    | 'top-left' | 'top-center' | 'top-right'
    | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface ToastViewportClassNames {
    viewport?: string;
    toast?: string;
    title?: string;
    description?: string;
    action?: string;
    close?: string;
}

export interface ToastViewportProps {
    toasts: Toast[];
    onDismiss: (id: string) => void;
    placement: ToastPlacement;
    duration: number;
    classNames?: ToastViewportClassNames;
}

const PLACEMENTS: Record<ToastPlacement, string> = {
    'top-left': 'top-4 left-4 items-start',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
    'top-right': 'top-4 right-4 items-end',
    'bottom-left': 'bottom-4 left-4 items-start',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
    'bottom-right': 'bottom-4 right-4 items-end'
};

const VARIANTS: Record<ToastVariant, { icon: IconComponent; accent: string }> = {
    info: { icon: Info, accent: 'text-info' },
    success: { icon: CheckCircle2, accent: 'text-success' },
    warning: { icon: AlertTriangle, accent: 'text-warning' },
    error: { icon: AlertCircle, accent: 'text-error' }
};

export interface ToastItemProps {
    toast: Toast;
    /** Stable across renders — the auto-dismiss timer depends on it. */
    onDismiss: (id: string) => void;
    duration: number;
    classNames?: ToastViewportClassNames;
}

const ToastItem = ({ toast, onDismiss, duration, classNames }: ToastItemProps) => {
    const variant = toast.variant ?? 'info';
    // Built here rather than by the parent: an inline arrow would be a new
    // function on every render, restarting the timer below each time, and the
    // toast would never reach the end of its own countdown.
    const dismiss = useCallback(() => onDismiss(toast.id), [onDismiss, toast.id]);
    const { icon: Icon, accent } = VARIANTS[variant];

    // An error is worth interrupting for; the rest can wait for a pause in
    // whatever the screen reader is currently saying.
    const isAssertive = variant === 'error';

    const timeout = toast.duration ?? duration;
    const [paused, setPaused] = useState(false);
    const remaining = useRef(timeout);
    const startedAt = useRef(0);

    useEffect(() => {
        if (timeout <= 0 || paused) return;

        startedAt.current = Date.now();
        const timer = setTimeout(dismiss, remaining.current);

        return () => {
            clearTimeout(timer);
            // Carry the unspent time over, so pausing does not restart the clock.
            remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt.current));
        };
    }, [paused, timeout, dismiss]);

    return (
        <li
            role={isAssertive ? 'alert' : 'status'}
            aria-live={isAssertive ? 'assertive' : 'polite'}
            // Pointer or keyboard: either way the user is engaging with it, and
            // a toast that vanishes mid-read is worse than none at all.
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className={cn(
                "pointer-events-auto w-80 max-w-[calc(100vw-2rem)] flex items-start gap-3",
                "bg-card border border-border rounded-md shadow-lg p-4 animate-fade-in",
                classNames?.toast
            )}
        >
            <Icon size={ICON_SIZE.lg} className={cn("shrink-0 mt-0.5", accent)} aria-hidden />

            <div className="min-w-0 flex-1">
                {toast.title && (
                    <p className={cn("text-sm font-semibold text-text-primary", classNames?.title)}>
                        {toast.title}
                    </p>
                )}
                {toast.description && (
                    <p className={cn("text-sm text-text-secondary", toast.title && "mt-0.5", classNames?.description)}>
                        {toast.description}
                    </p>
                )}
                {toast.action && (
                    <button
                        type="button"
                        onClick={() => {
                            toast.action!.onClick();
                            dismiss();
                        }}
                        className={cn(
                            "mt-2 text-sm font-semibold text-primary hover:text-primary-hover",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm",
                            classNames?.action
                        )}
                    >
                        {toast.action.label}
                    </button>
                )}
            </div>

            <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss notification"
                className={cn(
                    "shrink-0 p-1 -m-1 rounded-full text-text-muted hover:text-text-primary hover:bg-hover transition-colors",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    classNames?.close
                )}
            >
                <X size={ICON_SIZE.md} aria-hidden />
            </button>
        </li>
    );
};

/**
 * The stack itself. Rendered by `ToastProvider`; not exported for direct use.
 *
 * The list stays mounted even while empty. A live region has to be in the
 * document before its content changes, or the change is never announced.
 */
export const ToastViewport = ({ toasts, onDismiss, placement, duration, classNames }: ToastViewportProps) => {
    if (typeof document === 'undefined') return null;

    return createPortal(
        <ol
            // `pointer-events-none` on the container, `auto` on each toast: the
            // empty space around the stack must not swallow clicks on the page.
            className={cn(
                "fixed z-modal flex flex-col gap-2 pointer-events-none",
                PLACEMENTS[placement],
                classNames?.viewport
            )}
            tabIndex={-1}
        >
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    duration={duration}
                    onDismiss={onDismiss}
                    classNames={classNames}
                />
            ))}
        </ol>,
        document.body
    );
};
