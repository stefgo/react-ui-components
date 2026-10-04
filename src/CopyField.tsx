import { useRef } from 'react';
import { Check, Copy } from 'lucide-react';
import { ActionButton } from './ActionButton';
import { useCopyToClipboard } from './hooks/useCopyToClipboard';
import { cn } from './utils';
import { FOCUS_RING } from './focus';

export interface CopyFieldClassNames {
    input?: string;
    button?: string;
    notice?: string;
}

export interface CopyFieldLabels {
    /** The button's tooltip and name. Default "Copy to clipboard". */
    copy?: string;
    /** The same for the moment after a copy. Default "Copied!". */
    copied?: string;
    /** Shown when the value could not be copied and was selected instead. */
    unavailable?: string;
}

export interface CopyFieldProps {
    /** What is shown and copied. */
    value: string;
    /** Names the field: "Registration token". It has no visible label of its own. */
    'aria-label': string;
    labels?: CopyFieldLabels;
    className?: string;
    classNames?: CopyFieldClassNames;
}

/**
 * A value to take away -- a token, a key, a fingerprint -- next to the button
 * that copies it.
 *
 * A click into the field selects all of it. Where the clipboard is not
 * available the button does the same and a line below says so, which leaves
 * the reader one keystroke from the copy instead of with a button that did
 * nothing.
 */
export const CopyField = ({ value, 'aria-label': label, labels, className, classNames }: CopyFieldProps) => {
    const field = useRef<HTMLInputElement>(null);
    const { copied, unavailable, copy } = useCopyToClipboard();

    const handleCopy = async () => {
        if (await copy(value)) return;
        field.current?.focus();
        field.current?.select();
    };

    const tooltip = copied ? labels?.copied ?? 'Copied!' : labels?.copy ?? 'Copy to clipboard';

    return (
        <div className={className}>
            <div className="flex items-center gap-2">
                <input
                    ref={field}
                    type="text"
                    readOnly
                    value={value}
                    aria-label={label}
                    onClick={(e) => e.currentTarget.select()}
                    className={cn(
                        "min-w-0 flex-1 bg-app-bg p-3 rounded-md border border-border font-mono text-sm text-primary",
                        FOCUS_RING,
                        classNames?.input
                    )}
                />
                {/* `color` sets the hover colour as well, so without it the green
                    confirmation would only last while the pointer stays put. */}
                <ActionButton
                    icon={copied ? Check : Copy}
                    size="lg"
                    variant="solid"
                    color={copied ? 'green' : 'gray'}
                    tooltip={tooltip}
                    onClick={handleCopy}
                    className={cn(copied && 'text-success', classNames?.button)}
                />
            </div>
            {unavailable && (
                <p role="status" className={cn("mt-2 text-xs text-warning", classNames?.notice)}>
                    {labels?.unavailable
                        ?? 'Copying is not available on this connection — the value is selected, press Ctrl/⌘+C.'}
                </p>
            )}
        </div>
    );
};
