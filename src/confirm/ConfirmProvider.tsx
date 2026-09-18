import { ReactNode, createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { ConfirmDialog } from '../ConfirmDialog';
import type { AlertOptions, ConfirmContextValue, ConfirmOptions } from './types';

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

type Request =
    | { id: number; kind: 'confirm'; options: ConfirmOptions; resolve: (confirmed: boolean) => void }
    | { id: number; kind: 'alert'; options: AlertOptions; resolve: () => void };

export interface ConfirmProviderProps {
    children: ReactNode;
}

const messageOf = (e: unknown): string => (e instanceof Error ? e.message : String(e));

/**
 * Holds the pending confirmations and renders one `ConfirmDialog` for all of them.
 *
 * Like toasts, a confirmation is raised from an event handler rather than
 * rendered where it appears, and every consumer kept rebuilding the same three
 * pieces of state for it: what is pending, whether it is running, and the
 * dialog. Requests that arrive while one is open wait their turn instead of
 * replacing it — the one on screen is what the user is reading.
 */
export const ConfirmProvider = ({ children }: ConfirmProviderProps) => {
    const [queue, setQueue] = useState<Request[]>([]);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const nextId = useRef(0);

    const current = queue[0];

    const finish = useCallback(() => {
        setQueue((prev) => prev.slice(1));
        setIsConfirming(false);
        setError(null);
    }, []);

    const confirm = useCallback(
        (options: ConfirmOptions) =>
            new Promise<boolean>((resolve) => {
                setQueue((prev) => [...prev, { id: nextId.current++, kind: 'confirm', options, resolve }]);
            }),
        []
    );

    const alert = useCallback(
        (options: AlertOptions) =>
            new Promise<void>((resolve) => {
                setQueue((prev) => [...prev, { id: nextId.current++, kind: 'alert', options, resolve }]);
            }),
        []
    );

    const handleConfirm = async () => {
        if (!current) return;
        if (current.kind === 'alert') {
            current.resolve();
            finish();
            return;
        }
        const { onConfirm } = current.options;
        if (onConfirm) {
            setIsConfirming(true);
            setError(null);
            try {
                if ((await onConfirm()) === false) {
                    setIsConfirming(false);
                    return;
                }
            } catch (e) {
                setError(messageOf(e));
                setIsConfirming(false);
                return;
            }
        }
        current.resolve(true);
        finish();
    };

    // Escape, × and the backdrop land here too. While the action runs there is no
    // answer left to give: the request is already on its way.
    const handleClose = () => {
        if (!current || isConfirming) return;
        if (current.kind === 'alert') current.resolve();
        else current.resolve(false);
        finish();
    };

    const value = useMemo<ConfirmContextValue>(() => ({ confirm, alert }), [confirm, alert]);

    return (
        <ConfirmContext.Provider value={value}>
            {children}
            {current && (
                <ConfirmDialog
                    // One mount per request, so focus moves into each dialog afresh.
                    key={current.id}
                    isOpen
                    onClose={handleClose}
                    onConfirm={handleConfirm}
                    title={current.options.title}
                    description={current.options.description}
                    {...(current.kind === 'alert'
                        ? { confirmLabel: current.options.okLabel ?? 'OK', cancelLabel: null }
                        : {
                            confirmLabel: current.options.confirmLabel,
                            cancelLabel: current.options.cancelLabel,
                            variant: current.options.variant
                        })}
                    isConfirming={isConfirming}
                >
                    {error ? (
                        <p role="alert" className="text-sm text-error">
                            {error}
                        </p>
                    ) : undefined}
                </ConfirmDialog>
            )}
        </ConfirmContext.Provider>
    );
};

/**
 * Asks for confirmation, or tells something, from anywhere under a
 * `ConfirmProvider`.
 *
 * Throws when there is no provider rather than failing quietly: a question that
 * never appears would leave the action it guards waiting forever.
 */
export const useConfirm = (): ConfirmContextValue => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used inside a <ConfirmProvider>.');
    }
    return context;
};
