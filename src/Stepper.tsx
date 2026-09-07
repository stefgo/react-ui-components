import { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { ICON_SIZE } from './types';
import { cn } from './utils';
import { FOCUS_RING } from './focus';

export interface StepperStep {
    /** Stable across renders — it keys the list. */
    id: string;
    label: ReactNode;
    description?: ReactNode;
}

export interface StepperClassNames {
    step?: string;
    marker?: string;
    label?: string;
    description?: string;
    connector?: string;
}

export interface StepperProps {
    steps: StepperStep[];
    /** Index of the step the user is on. Everything before it counts as done. */
    current: number;
    orientation?: 'horizontal' | 'vertical';
    /**
     * Makes the *completed* steps selectable, so the user can jump back.
     * Without it the whole strip is inert — a progress display, not a control.
     */
    onStepSelect?: (index: number) => void;
    /** Appended to a completed step's accessible name. */
    completedLabel?: string;
    className?: string;
    classNames?: StepperClassNames;
}

type StepState = 'done' | 'current' | 'upcoming';

/*
 * Variant tables at module level: every entry ends in a `cn()` call once the
 * caller's slot class is merged in, and a stepper is re-rendered on every step
 * change. Nothing here depends on a prop.
 */
const MARKER_STATE: Record<StepState, string> = {
    done: 'bg-primary text-button-primary-text border border-primary',
    current: 'bg-card text-primary border-2 border-primary',
    upcoming: 'bg-card text-text-muted border border-border'
};

const LABEL_STATE: Record<StepState, string> = {
    done: 'text-text-primary',
    current: 'text-text-primary font-semibold',
    upcoming: 'text-text-muted'
};

/** The connector belongs to the step *before* it, and is filled once that one is done. */
const CONNECTOR_STATE: Record<StepState, string> = {
    done: 'bg-primary',
    current: 'bg-border',
    upcoming: 'bg-border'
};

const stateOf = (index: number, current: number): StepState =>
    index < current ? 'done' : index === current ? 'current' : 'upcoming';

/**
 * The progress strip of a multi-step flow.
 *
 * An ordered list, not a row of divs: the position ("3 of 5") is what a step
 * indicator is *for*, and only `<ol>`/`<li>` carries it without being spelled
 * out. The current step is marked with `aria-current="step"`, which is how a
 * screen reader announces where the user is.
 *
 * The marker — the numbered circle — is decorative and hidden from the
 * accessibility tree: it repeats the position the list already conveys. The
 * label is the accessible name, and with `onStepSelect` it is also the control,
 * so the hit target and the name are the same element.
 *
 * Pure display: it owns no state and never advances by itself. `Wizard` drives
 * it; a caller with its own layout can drive it just as well.
 */
export const Stepper = ({
    steps,
    current,
    orientation = 'horizontal',
    onStepSelect,
    completedLabel = 'completed',
    className,
    classNames
}: StepperProps) => {
    const isVertical = orientation === 'vertical';

    return (
        <ol
            className={cn(
                isVertical ? 'flex flex-col' : 'flex items-start gap-2',
                className
            )}
        >
            {steps.map((step, index) => {
                const state = stateOf(index, current);
                const isLast = index === steps.length - 1;
                // Only a completed step is a destination: jumping *forward* past
                // the step the user is on would skip whatever it validates.
                const selectable = !!onStepSelect && state === 'done';

                const marker = (
                    <span
                        aria-hidden
                        className={cn(
                            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                            MARKER_STATE[state],
                            classNames?.marker
                        )}
                    >
                        {state === 'done' ? <Check size={ICON_SIZE.sm} aria-hidden /> : index + 1}
                    </span>
                );

                const text = (
                    <>
                        <span className={cn('block text-sm', LABEL_STATE[state], classNames?.label)}>
                            {step.label}
                            {state === 'done' && <span className="sr-only"> ({completedLabel})</span>}
                        </span>
                        {step.description && (
                            <span className={cn('block text-xs text-text-muted', classNames?.description)}>
                                {step.description}
                            </span>
                        )}
                    </>
                );

                const body = selectable ? (
                    <button
                        type="button"
                        onClick={() => onStepSelect?.(index)}
                        className={cn(
                            'min-w-0 rounded-md text-left transition-colors hover:text-primary',
                            FOCUS_RING
                        )}
                    >
                        {text}
                    </button>
                ) : (
                    // Not a disabled button: an upcoming step is not a control at
                    // all, and a disabled one would sit in the accessibility tree
                    // announcing itself as unavailable on every pass.
                    <span className="min-w-0">{text}</span>
                );

                if (isVertical) {
                    return (
                        <li
                            key={step.id}
                            aria-current={state === 'current' ? 'step' : undefined}
                            className={cn('flex min-w-0 gap-3', classNames?.step)}
                        >
                            <span className="flex flex-col items-center self-stretch">
                                {marker}
                                {!isLast && (
                                    <span
                                        aria-hidden
                                        className={cn(
                                            'my-1 w-px flex-1 min-h-4',
                                            CONNECTOR_STATE[state],
                                            classNames?.connector
                                        )}
                                    />
                                )}
                            </span>
                            <span className={cn('min-w-0', isLast ? '' : 'pb-4')}>{body}</span>
                        </li>
                    );
                }

                return (
                    <li
                        key={step.id}
                        aria-current={state === 'current' ? 'step' : undefined}
                        className={cn(
                            'flex min-w-0 items-center gap-3',
                            isLast ? '' : 'flex-1',
                            classNames?.step
                        )}
                    >
                        {marker}
                        {body}
                        {!isLast && (
                            <span
                                aria-hidden
                                className={cn(
                                    'h-px flex-1 min-w-4',
                                    CONNECTOR_STATE[state],
                                    classNames?.connector
                                )}
                            />
                        )}
                    </li>
                );
            })}
        </ol>
    );
};
