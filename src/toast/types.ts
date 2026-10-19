import type { ReactNode } from 'react';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastOptions {
    title?: ReactNode;
    description?: ReactNode;
    variant?: ToastVariant;
    /**
     * Milliseconds before it disappears. `0` keeps it until dismissed — use that
     * for errors the user has to actually read.
     */
    duration?: number;
    /** One optional action, e.g. "Undo". Dismisses the toast after running. */
    action?: { label: string; onClick: () => void };
    /**
     * How far a job the toast reports on has come, drawn as a bar. Moved on with
     * `update`; pair it with `duration: 0`, or the toast leaves before the job
     * is done.
     */
    progress?: { value: number; max: number };
}

export interface Toast extends ToastOptions {
    id: string;
}

export interface ToastContextValue {
    toasts: Toast[];
    /** Returns the id, so a long-running toast can be dismissed later. */
    show: (options: ToastOptions) => string;
    /**
     * Changes a toast in place: what is given replaces what it had, a key set
     * to `undefined` removes it. A changed `duration` starts a fresh countdown.
     * Returns `false` when the toast is gone -- dismissed by the user, or
     * dropped by the provider's `limit` -- so the caller can `show` a new one
     * where it has to be seen.
     */
    update: (id: string, options: ToastOptions) => boolean;
    dismiss: (id: string) => void;
    dismissAll: () => void;
}
