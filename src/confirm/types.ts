import type { ReactNode } from 'react';

export interface ConfirmOptions {
    title: ReactNode;
    /** What is about to happen. Name the consequence, not the button. */
    description?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    /** `danger` for anything that destroys data. */
    variant?: 'primary' | 'danger';
    /**
     * Runs while the dialog stays open, with the confirm button busy. Returning
     * `false` keeps the dialog open without a message — for a caller that has
     * already reported the failure. Throwing keeps it open and shows the error's
     * message inside it, next to the button that retries.
     */
    onConfirm?: () => void | boolean | Promise<void | boolean>;
}

export interface AlertOptions {
    title: ReactNode;
    description?: ReactNode;
    okLabel?: string;
}

export interface ConfirmContextValue {
    /**
     * Asks, and resolves `true` once confirmed — after `onConfirm` succeeded, if
     * one was given — or `false` when dismissed.
     */
    confirm: (options: ConfirmOptions) => Promise<boolean>;
    /** Tells, with a single button. Resolves once the notice is closed. */
    alert: (options: AlertOptions) => Promise<void>;
}
