import { useId } from 'react';

export interface FieldIds {
    /** Put this on the control and on the label's `htmlFor`. */
    id: string;
    /** Ready for `aria-describedby` — already merged with the caller's own value. */
    describedBy: string | undefined;
    /** Ready for `aria-invalid`. `undefined` rather than `false`, so the attribute is absent. */
    invalid: true | undefined;
    /** Id of the error paragraph. Only rendered when there is an error. */
    errorId: string;
    /** Id of the hint paragraph. Only rendered when `showHint`. */
    hintId: string;
    /**
     * Whether the hint is rendered at all. An error replaces the hint visually,
     * so the hint must drop out of `aria-describedby` at the same moment —
     * otherwise a screen reader announces a hint that is not on screen.
     */
    showHint: boolean;
}

interface UseFieldIdsOptions {
    /** A caller-supplied id wins, so a field can be addressed from outside. */
    id?: string;
    error?: string;
    hint?: unknown;
    /** The caller's own `aria-describedby`, which must not be dropped. */
    describedBy?: string;
}

/**
 * The ARIA wiring every form control needs, in one place.
 *
 * `Input` and `Select` each carried their own copy of this; with `Textarea`,
 * `Checkbox`, `Radio` and `Switch` there would be six. The copies had already
 * started to drift — `Select` never wired up a hint at all.
 */
export const useFieldIds = ({ id, error, hint, describedBy }: UseFieldIdsOptions): FieldIds => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const errorId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;

    const showHint = Boolean(hint) && !error;

    return {
        id: fieldId,
        errorId,
        hintId,
        showHint,
        invalid: error ? true : undefined,
        describedBy: [
            error ? errorId : null,
            showHint ? hintId : null,
            describedBy
        ].filter(Boolean).join(' ') || undefined
    };
};
