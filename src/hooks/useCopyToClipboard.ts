import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseCopyToClipboardOptions {
    /** How long `copied` stays true after a copy, in milliseconds. Default 2000. */
    feedbackMs?: number;
}

export interface CopyToClipboard {
    /** True for `feedbackMs` after a copy that worked: the moment to show a check mark. */
    copied: boolean;
    /**
     * True once a copy could not be made. The caller selects the text instead,
     * which leaves the reader one keystroke from the copy -- and says so.
     */
    unavailable: boolean;
    /** Resolves `true` when the text is on the clipboard. Never throws. */
    copy: (text: string) => Promise<boolean>;
}

/**
 * Copies a text and remembers for a moment that it did.
 *
 * The clipboard API exists in a secure context only, and a dashboard is often
 * reached over plain HTTP in a LAN. Six call sites in two apps copied a text,
 * and only two of them knew that: the other four threw into an unhandled
 * rejection and showed nothing. Failing is therefore part of the result here,
 * not an exception to catch.
 */
export function useCopyToClipboard({ feedbackMs = 2000 }: UseCopyToClipboardOptions = {}): CopyToClipboard {
    const [copied, setCopied] = useState(false);
    const [unavailable, setUnavailable] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (timer.current) clearTimeout(timer.current);
    }, []);

    const copy = useCallback(async (text: string) => {
        try {
            if (!navigator.clipboard) throw new Error('Clipboard API not available');
            await navigator.clipboard.writeText(text);
        } catch {
            setCopied(false);
            setUnavailable(true);
            return false;
        }
        setUnavailable(false);
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), feedbackMs);
        return true;
    }, [feedbackMs]);

    return { copied, unavailable, copy };
}
