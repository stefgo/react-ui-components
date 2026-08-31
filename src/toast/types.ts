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
}

export interface Toast extends ToastOptions {
    id: string;
}

export interface ToastContextValue {
    toasts: Toast[];
    /** Returns the id, so a long-running toast can be dismissed later. */
    show: (options: ToastOptions) => string;
    dismiss: (id: string) => void;
    dismissAll: () => void;
}
