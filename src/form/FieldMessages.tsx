import { ReactNode } from 'react';
import type { FieldIds } from './useFieldIds';
import { cn } from '../utils';

export interface FieldMessagesClassNames {
    error?: string;
    hint?: string;
}

export interface FieldMessagesProps {
    ids: FieldIds;
    hint?: ReactNode;
    error?: string;
    classNames?: FieldMessagesClassNames;
}

/**
 * The error and hint paragraphs under a field, with the ids `useFieldIds`
 * generated for them.
 *
 * Split out of `FormField` because `RadioGroup` needs the same two paragraphs
 * without the rest of it: a group is a `<fieldset>` with a `<legend>`, not a
 * label above a control, so it cannot sit *in* a `FormField` — but its messages
 * should not be a second, drifting copy either.
 *
 * `showHint` is what enforces the rule the whole wiring exists for: an error
 * replaces the hint on screen and in `aria-describedby` at the same moment.
 */
export const FieldMessages = ({ ids, hint, error, classNames }: FieldMessagesProps) => (
    <>
        {error && (
            <p id={ids.errorId} role="alert" className={cn("mt-1 text-xs text-error", classNames?.error)}>
                {error}
            </p>
        )}
        {ids.showHint && (
            <p id={ids.hintId} className={cn("mt-1 text-xs text-text-muted leading-relaxed ml-1", classNames?.hint)}>
                {hint}
            </p>
        )}
    </>
);
