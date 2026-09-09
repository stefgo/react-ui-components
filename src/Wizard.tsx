import { ReactNode, useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from './Button';
import { Stepper, type StepperStep } from './Stepper';
import { useControllableState } from './hooks/useControllableState';
import type { Controllable, IconComponent } from './types';
import { cn } from './utils';

export interface WizardStep extends StepperStep {
    content: ReactNode;
    /**
     * Blocks the step from being left forwards. Default `true`.
     *
     * This is the whole validation contract: the wizard never inspects the
     * content, it only asks whether the caller considers this step complete.
     */
    canContinue?: boolean;
    /** For a terminal step — one that has already had an effect and cannot be undone. */
    hideBack?: boolean;
    /** Overrides the forward button's label on this step alone. */
    nextLabel?: string;
}

export interface WizardClassNames {
    stepper?: string;
    body?: string;
    footer?: string;
}

export interface WizardProps extends Controllable<number> {
    steps: WizardStep[];
    /** Leaves the flow. Shown on every step; on the first one it is the only way out. */
    onCancel?: () => void;
    /** The primary action of the last step. Without it the last step has no primary button. */
    onFinish?: () => void;
    finishLabel?: string;
    finishIcon?: IconComponent;
    /** Puts the finish button in its loading state and blocks navigation. */
    isFinishing?: boolean;
    backLabel?: string;
    nextLabel?: string;
    cancelLabel?: string;
    /** Lets the user jump back to a completed step from the strip itself. */
    allowStepSelect?: boolean;
    className?: string;
    classNames?: WizardClassNames;
}

/**
 * A multi-step flow: progress strip, the current step's content, and the
 * navigation that ties them together.
 *
 * **Only the current step is rendered.** That is deliberate — a wizard whose
 * steps all stay mounted pays for every one of them on every keystroke — but it
 * has a consequence the caller has to plan for: *the step contents' state
 * belongs to the caller*. A step that keeps its inputs in its own `useState`
 * loses them the moment the user goes back. Hold the form data above the
 * wizard and pass it down, and Back/Next become free.
 *
 * The step index is one controllable state (`value` / `defaultValue` /
 * `onChange`). A flow that branches — where the list of steps depends on an
 * answer given in step 1 — has to control it, since the wizard cannot know that
 * swapping the array means starting the branch over.
 *
 * Layout is a flex column with its own footer, so it works inline inside a
 * `Card` as well as in the body of a `Modal` (give the modal
 * `classNames={{ body: 'flex p-0' }}` and no `footer` of its own).
 */
export const Wizard = ({
    steps,
    value,
    defaultValue,
    onChange,
    onCancel,
    onFinish,
    finishLabel = 'Finish',
    finishIcon,
    isFinishing = false,
    backLabel = 'Back',
    nextLabel = 'Next',
    cancelLabel = 'Cancel',
    allowStepSelect = false,
    className,
    classNames
}: WizardProps) => {
    const [index, setIndex] = useControllableState<number>({
        value,
        defaultValue,
        onChange,
        fallback: 0
    });

    // Clamped for rendering only, never written back: a controlled caller owns
    // the number, and a branch swap that shortens the list must not provoke a
    // state write from inside the render.
    const current = Math.min(Math.max(index, 0), Math.max(steps.length - 1, 0));
    const step = steps[current];

    const bodyRef = useRef<HTMLDivElement>(null);

    // A long step leaves the body scrolled down; the next one would then open
    // halfway through its own first field. `scrollTop` and not `scrollTo`: the
    // latter is a window method that jsdom does not give elements, so the
    // effect would throw in every consumer's test run.
    useEffect(() => {
        if (bodyRef.current) bodyRef.current.scrollTop = 0;
    }, [current]);

    if (!step) return null;

    const isLast = current === steps.length - 1;
    const canContinue = step.canContinue !== false && !isFinishing;
    const showBack = current > 0 && !step.hideBack;

    return (
        <div className={cn('flex min-h-0 flex-1 flex-col', className)}>
            <div className={cn('shrink-0 px-6 pt-6 pb-4', classNames?.stepper)}>
                <Stepper
                    steps={steps}
                    current={current}
                    onStepSelect={allowStepSelect && !isFinishing ? setIndex : undefined}
                />
            </div>

            <div
                ref={bodyRef}
                className={cn('min-h-0 flex-1 overflow-y-auto px-6 py-4', classNames?.body)}
            >
                {step.content}
            </div>

            <div
                className={cn(
                    'flex shrink-0 items-center justify-between gap-3 border-t border-border px-6 py-4',
                    classNames?.footer
                )}
            >
                <div>
                    {onCancel && (
                        <Button type="button" variant="ghost" onClick={onCancel} disabled={isFinishing}>
                            {cancelLabel}
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {showBack && (
                        <Button
                            type="button"
                            variant="secondary"
                            icon={ChevronLeft}
                            onClick={() => setIndex(current - 1)}
                            disabled={isFinishing}
                        >
                            {backLabel}
                        </Button>
                    )}

                    {isLast
                        ? onFinish && (
                            <Button
                                type="button"
                                variant="primary"
                                icon={finishIcon}
                                onClick={onFinish}
                                disabled={!canContinue}
                                isLoading={isFinishing}
                            >
                                {step.nextLabel ?? finishLabel}
                            </Button>
                        )
                        : (
                            <Button
                                type="button"
                                variant="primary"
                                onClick={() => setIndex(current + 1)}
                                disabled={!canContinue}
                            >
                                {step.nextLabel ?? nextLabel}
                            </Button>
                        )}
                </div>
            </div>
        </div>
    );
};
