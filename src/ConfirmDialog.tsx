import { ReactNode } from 'react';
import { Button } from './Button';
import { Modal, type ModalClassNames, type ModalSize } from './Modal';

export interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: ReactNode;
    /** What is about to happen. Name the consequence, not the button. */
    description?: ReactNode;
    children?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    /** `danger` for anything that destroys data. */
    variant?: 'primary' | 'danger';
    /** Shows a spinner on the confirm button and blocks both buttons. */
    isConfirming?: boolean;
    size?: ModalSize;
    className?: string;
    classNames?: ModalClassNames;
}

/**
 * A `Modal` with the two buttons every confirmation needs.
 *
 * It exists because consumers kept rebuilding exactly this — and their versions
 * had no `role="dialog"`, no focus trap and no Escape handling. The narrow API
 * is the point: there is nothing here to get wrong.
 */
export const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    children,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'primary',
    isConfirming = false,
    size = 'sm',
    className,
    classNames
}: ConfirmDialogProps) => (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        description={description}
        size={size}
        // A confirmation is a question. Dismissing it by clicking beside it is
        // the same answer as Cancel, so there is nothing to protect here.
        closeOnOverlayClick={!isConfirming}
        className={className}
        classNames={classNames}
        footer={
            <>
                <Button variant="secondary" onClick={onClose} disabled={isConfirming}>
                    {cancelLabel}
                </Button>
                <Button
                    variant={variant === 'danger' ? 'danger' : 'primary'}
                    onClick={onConfirm}
                    isLoading={isConfirming}
                >
                    {confirmLabel}
                </Button>
            </>
        }
    >
        {children}
    </Modal>
);
