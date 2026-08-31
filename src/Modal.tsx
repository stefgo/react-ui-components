import { ReactNode, useId } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useMenuBehavior } from './hooks/useMenuBehavior';
import { ICON_SIZE } from './types';
import { cn } from './utils';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalClassNames {
    overlay?: string;
    dialog?: string;
    header?: string;
    title?: string;
    description?: string;
    close?: string;
    body?: string;
    footer?: string;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Names the dialog for assistive technology. Required — a dialog without a name is unusable. */
    title: ReactNode;
    /** Optional supporting text, wired to `aria-describedby`. */
    description?: ReactNode;
    children?: ReactNode;
    /** Actions, pinned below the body. Usually cancel plus the primary action. */
    footer?: ReactNode;
    size?: ModalSize;
    /**
     * Clicking the backdrop closes the dialog. Turn it off for a form with
     * unsaved input, where a stray click should not discard work.
     */
    closeOnOverlayClick?: boolean;
    /** Hides the × button. Escape still closes; leave it on unless the dialog is truly modal. */
    hideCloseButton?: boolean;
    closeLabel?: string;
    className?: string;
    classNames?: ModalClassNames;
}

const SIZES: Record<ModalSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[calc(100vw-2rem)]'
};

/**
 * A modal dialog: focus is trapped inside, Escape closes it, the page behind it
 * does not scroll, and focus returns to whatever opened it.
 *
 * All of that already lived in `useMenuBehavior`, which `MobileMoreSheet` uses
 * for the same purpose. What is new here is the portal, the size scale and the
 * footer slot.
 */
export const Modal = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'md',
    closeOnOverlayClick = true,
    hideCloseButton = false,
    closeLabel = 'Close dialog',
    className = '',
    classNames
}: ModalProps) => {
    const titleId = useId();
    const descriptionId = useId();

    const { containerRef } = useMenuBehavior<HTMLDivElement>({
        isOpen,
        onClose,
        mode: 'dialog',
        lockScroll: true
    });

    if (!isOpen) return null;

    return createPortal(
        <div
            className={cn(
                "fixed inset-0 z-modal bg-overlay backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in",
                classNames?.overlay
            )}
            onClick={closeOnOverlayClick ? onClose : undefined}
        >
            <div
                ref={containerRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={description ? descriptionId : undefined}
                tabIndex={-1}
                // The backdrop closes the dialog; clicks inside it must not bubble there.
                onClick={(e) => e.stopPropagation()}
                className={cn(
                    "w-full bg-card rounded-lg border border-border shadow-2xl",
                    "flex flex-col max-h-[calc(100vh-2rem)] focus:outline-none",
                    SIZES[size],
                    className,
                    classNames?.dialog
                )}
            >
                <div className={cn("flex items-start justify-between gap-4 px-6 pt-6 pb-4", classNames?.header)}>
                    <div className="min-w-0">
                        <h2 id={titleId} className={cn("text-lg font-semibold text-text-primary", classNames?.title)}>
                            {title}
                        </h2>
                        {description && (
                            <p id={descriptionId} className={cn("mt-1 text-sm text-text-muted", classNames?.description)}>
                                {description}
                            </p>
                        )}
                    </div>
                    {!hideCloseButton && (
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label={closeLabel}
                            className={cn(
                                "shrink-0 p-1.5 rounded-full text-text-muted hover:bg-hover hover:text-text-primary transition-colors",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                classNames?.close
                            )}
                        >
                            <X size={ICON_SIZE.lg} aria-hidden />
                        </button>
                    )}
                </div>

                {children !== undefined && (
                    <div className={cn("px-6 pb-6 overflow-y-auto flex-1 min-h-0 text-text-secondary", classNames?.body)}>
                        {children}
                    </div>
                )}

                {footer && (
                    <div className={cn(
                        "flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-card-header rounded-b-lg",
                        classNames?.footer
                    )}>
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};
