import { LoaderCircle } from 'lucide-react';
import { ICON_SIZE } from './types';
import { cn } from './utils';

export interface LoadingIndicatorProps {
    /** What is being waited for. Shown next to the spinner and announced with it. */
    label?: string;
    className?: string;
}

/**
 * The one loading state, wherever a view has nothing to show yet.
 *
 * Each app had a copy of this after replacing its own hand-built spinners, which is
 * one step short of having one. `role="status"` so the text is announced when it
 * appears; the spinner itself is decorative.
 */
export const LoadingIndicator = ({ label = 'Loading…', className }: LoadingIndicatorProps) => (
    <div
        role="status"
        className={cn('flex items-center justify-center gap-2 py-8 text-sm text-text-muted', className)}
    >
        <LoaderCircle size={ICON_SIZE.md} className="animate-spin" aria-hidden />
        {label}
    </div>
);
