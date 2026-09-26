import { ReactNode } from 'react';
import type { IconComponent } from './types';
import { cn } from './utils';

export interface EmptyStateClassNames {
    icon?: string;
    title?: string;
    description?: string;
}

export interface EmptyStateProps {
    /** What is missing, as a statement: "No clients registered yet". */
    title: ReactNode;
    /** What it means, or how to change it. */
    description?: ReactNode;
    icon?: IconComponent;
    /** The way out: usually the button that creates the first entry. */
    action?: ReactNode;
    className?: string;
    classNames?: EmptyStateClassNames;
}

/**
 * Nothing to show, and what to do about it.
 *
 * Meant for a data view's `emptyMessage` -- the list that has never had an entry --
 * and for a page whose subject does not exist. An empty *search* is a different
 * message and belongs in `noResultsMessage`: offering "Add client" to someone who
 * mistyped a name is the confusion this exists to end.
 */
export const EmptyState = ({ title, description, icon: Icon, action, className, classNames }: EmptyStateProps) => (
    <div className={cn('flex flex-col items-center justify-center gap-2 py-8 text-center', className)}>
        {Icon && <Icon size={32} aria-hidden className={cn('text-text-muted mb-1', classNames?.icon)} />}
        <p className={cn('text-sm font-medium text-text-primary', classNames?.title)}>{title}</p>
        {description && (
            <p className={cn('text-sm text-text-muted max-w-prose', classNames?.description)}>{description}</p>
        )}
        {action && <div className="mt-2">{action}</div>}
    </div>
);
