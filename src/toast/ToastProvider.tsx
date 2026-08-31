import { ReactNode, createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { ToastViewport, type ToastPlacement, type ToastViewportClassNames } from './ToastViewport';
import type { Toast, ToastContextValue, ToastOptions } from './types';

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
    children: ReactNode;
    /** Corner the stack appears in. Default: bottom right. */
    placement?: ToastPlacement;
    /** Default milliseconds before a toast disappears. `0` means it stays. */
    duration?: number;
    /**
     * Oldest toasts beyond this are dropped. A stack that outgrows the screen
     * covers the very content the user is being told about.
     */
    limit?: number;
    classNames?: ToastViewportClassNames;
}

/**
 * Holds the toast queue and renders the stack.
 *
 * Toasts are the one thing here that needs a provider: they are raised from
 * event handlers and request callbacks, i.e. from outside the tree that shows
 * them. Everything else in the library is a plain component.
 */
export const ToastProvider = ({
    children,
    placement = 'bottom-right',
    duration = 5000,
    limit = 4,
    classNames
}: ToastProviderProps) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const nextId = useRef(0);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const dismissAll = useCallback(() => setToasts([]), []);

    const show = useCallback((options: ToastOptions) => {
        const id = `toast-${nextId.current++}`;
        setToasts((prev) => [...prev, { ...options, id }].slice(-limit));
        return id;
    }, [limit]);

    const value = useMemo<ToastContextValue>(
        () => ({ toasts, show, dismiss, dismissAll }),
        [toasts, show, dismiss, dismissAll]
    );

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastViewport
                toasts={toasts}
                onDismiss={dismiss}
                placement={placement}
                duration={duration}
                classNames={classNames}
            />
        </ToastContext.Provider>
    );
};

/**
 * Raises toasts from anywhere under a `ToastProvider`.
 *
 * Throws when there is no provider rather than failing quietly: a notification
 * that silently never appears is worse than a crash in development.
 */
export const useToast = (): ToastContextValue => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used inside a <ToastProvider>.');
    }
    return context;
};
