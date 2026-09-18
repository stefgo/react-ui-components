import { ReactNode, Ref, useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { ActionButton } from './ActionButton';
import { cn } from './utils';

export interface DescriptionItem {
    label: ReactNode;
    /** Usually text, but a control (a `Switch`, an `Input`) is fine -- the list only lays it out. */
    value: ReactNode;
    /** Monospaced value, for ids, addresses and cron expressions. */
    mono?: boolean;
    /** The text a copy button next to the value puts on the clipboard. No button without it. */
    copyable?: string;
    /** `'full'` spans every column -- for a value too long to share a row. */
    span?: 1 | 'full';
    /** React key. Needed only when `label` is not a string. */
    key?: string;
}

export type DescriptionListColumns = 1 | 2 | 3;

export interface DescriptionListClassNames {
    item?: string;
    label?: string;
    value?: string;
}

export interface DescriptionListLabels {
    /** Accessible name and tooltip of the copy button. */
    copy?: string;
    /** Shown on the copy button for a moment after it worked. */
    copied?: string;
}

export interface DescriptionListProps {
    items: DescriptionItem[];
    /** Columns from the `sm` breakpoint up. Below it the list is always one column. */
    columns?: DescriptionListColumns;
    labels?: DescriptionListLabels;
    className?: string;
    classNames?: DescriptionListClassNames;
    ref?: Ref<HTMLDListElement>;
}

// Written out in full: Tailwind finds classes by scanning the built files as text.
const COLUMNS: Record<DescriptionListColumns, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
};

const COPIED_FOR_MS = 2000;

const CopyButton = ({ text, labels }: { text: string; labels?: DescriptionListLabels }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const timer = setTimeout(() => setCopied(false), COPIED_FOR_MS);
        return () => clearTimeout(timer);
    }, [copied]);

    return (
        <ActionButton
            icon={copied ? Check : Copy}
            size="sm"
            color="green"
            tooltip={copied ? labels?.copied ?? 'Copied' : labels?.copy ?? 'Copy to clipboard'}
            className={cn("shrink-0", copied && "text-success")}
            onClick={async () => {
                try {
                    await navigator.clipboard.writeText(text);
                    setCopied(true);
                } catch {
                    // No clipboard permission, or no secure context. The value is on
                    // screen and selectable, so there is nothing worth an error for.
                }
            }}
        />
    );
};

/**
 * Labelled values, laid out in columns: the label above, the value below.
 *
 * A `<dl>`, so a screen reader pairs each value with its label. The columns are
 * equal in width, which is what lets two lists with the same `columns` line up
 * when one is stacked under the other -- `EntityHeader` relies on it.
 */
export const DescriptionList = ({
    items,
    columns = 2,
    labels,
    className,
    classNames,
    ref
}: DescriptionListProps) => (
    <dl ref={ref} className={cn("grid gap-x-6 gap-y-4", COLUMNS[columns], className)}>
        {items.map((item, index) => (
            <div
                key={item.key ?? (typeof item.label === 'string' ? item.label : index)}
                className={cn("min-w-0", item.span === 'full' && "col-span-full", classNames?.item)}
            >
                <dt className={cn("text-xs font-bold text-text-muted uppercase mb-1", classNames?.label)}>
                    {item.label}
                </dt>
                <dd
                    className={cn(
                        "flex items-center gap-1 text-sm text-text-primary break-words",
                        item.mono && "font-mono",
                        classNames?.value
                    )}
                >
                    {/* A div, not a span: the value may be a control with block content. */}
                    <div className="min-w-0 flex-1 break-words">{item.value}</div>
                    {item.copyable !== undefined && <CopyButton text={item.copyable} labels={labels} />}
                </dd>
            </div>
        ))}
    </dl>
);
