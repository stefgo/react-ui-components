import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { useConfirm } from './confirm/ConfirmProvider';
import type { AlertOptions } from './confirm/types';
import { ICON_SIZE } from './types';
import { cn } from './utils';

export interface ManualRunClassNames {
    button?: string;
}

export interface ManualRunProps {
    /** What running the job does. */
    description: string;
    /** Runs the job and returns what the button shows for a moment afterwards. Throws on failure. */
    onRun: () => Promise<string>;
    /** The title of the notice a failure is reported in. */
    failureTitle: string;
    /**
     * Turns a failure into the notice. The default shows the error's message; an app
     * with its own error shape (an API response body, say) passes its reader here.
     */
    formatError?: (title: string, error: unknown) => AlertOptions;
    /** How long the result stays on the button, in milliseconds. */
    resultDuration?: number;
    className?: string;
    /** `button` needs room for the longest result the job can report. */
    classNames?: ManualRunClassNames;
}

const defaultFormatError = (title: string, error: unknown): AlertOptions => ({
    title,
    description: error instanceof Error ? error.message : String(error)
});

/**
 * "Run the job now", for a background job with a schedule of its own. The button
 * spins while the job runs, then shows its result for a moment.
 *
 * Every settings section of three apps kept a copy of this, each with a pair of
 * state variables and a timer effect.
 */
export const ManualRun = ({
    description,
    onRun,
    failureTitle,
    formatError = defaultFormatError,
    resultDuration = 3000,
    className,
    classNames
}: ManualRunProps) => {
    const { alert } = useConfirm();
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    useEffect(() => {
        if (!result) return;
        const timer = setTimeout(() => setResult(null), resultDuration);
        return () => clearTimeout(timer);
    }, [result, resultDuration]);

    const run = async () => {
        setIsRunning(true);
        try {
            setResult(await onRun());
        } catch (e: unknown) {
            alert(formatError(failureTitle, e));
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className={cn('flex items-center justify-between gap-4', className)}>
            <div>
                <h5 className="text-sm font-bold text-text-primary">Manual Run</h5>
                <p className="text-xs text-text-muted">{description}</p>
            </div>
            <Button
                variant="secondary"
                onClick={run}
                disabled={isRunning || !!result}
                aria-busy={isRunning}
                className={cn('w-[160px]', classNames?.button)}
            >
                {isRunning ? (
                    <>
                        <RefreshCw size={ICON_SIZE.md} className="animate-spin" aria-hidden />
                        <span className="sr-only">Running…</span>
                    </>
                ) : (
                    <span>{result ?? 'Run Now'}</span>
                )}
            </Button>
        </div>
    );
};
