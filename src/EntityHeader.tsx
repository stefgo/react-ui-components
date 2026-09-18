import { ReactNode, Ref, useId } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { ActionButton } from './ActionButton';
import { Card, type CardTitleLevel } from './Card';
import { CollapsibleRegion } from './CollapsibleRegion';
import {
    DescriptionList,
    type DescriptionItem,
    type DescriptionListColumns,
    type DescriptionListLabels
} from './DescriptionList';
import { usePersistentState } from './hooks/usePersistentState';
import type { Persistable } from './types';
import { cn } from './utils';
import { FOCUS_RING } from './focus';

/**
 * `'always'` keeps a detail on screen; `'expanded'` shows it only while the
 * details are open.
 */
export type DetailVisibility = 'always' | 'expanded';

export interface EntityDetail extends DescriptionItem {
    /** Defaults to `'expanded'`: a detail on permanent display is a decision, not an accident. */
    visibility?: DetailVisibility;
}

export interface EntityHeaderClassNames {
    header?: string;
    title?: string;
    meta?: string;
    actions?: string;
    alert?: string;
    details?: string;
    toggle?: string;
}

export interface EntityHeaderLabels extends DescriptionListLabels {
    /** The icon toggle, used when every detail is `'expanded'`. */
    details?: string;
    showMore?: string;
    showLess?: string;
}

/** The controllable state is whether the `'expanded'` details are open. */
export interface EntityHeaderProps extends Persistable<boolean> {
    title: ReactNode;
    /** Heading level of `title`. Defaults to `'h2'` -- the header usually heads its page. */
    titleAs?: CardTitleLevel;
    /** In front of the title: a status dot, an icon. */
    leading?: ReactNode;
    /** Next to the title, wrapping below it when the row runs out: badges, mostly. */
    meta?: ReactNode;
    /** Right-hand end of the row, e.g. an `ActionMenu` trigger. */
    actions?: ReactNode;
    /** Below the row and never collapsed: whatever needs attention must not hide behind a toggle. */
    alert?: ReactNode;
    details?: EntityDetail[];
    detailColumns?: DescriptionListColumns;
    labels?: EntityHeaderLabels;
    className?: string;
    classNames?: EntityHeaderClassNames;
    ref?: Ref<HTMLDivElement>;
}

const reviveExpanded = (raw: unknown) => (typeof raw === 'boolean' ? raw : undefined);

/**
 * The head of a page about one thing -- a host, a project, a repository: one
 * row with its name, a few badges and its actions, and details below it.
 *
 * Each detail says whether it is always on screen or only while the details are
 * open. The two groups are rendered apart -- the always-visible ones first,
 * each group in the order given -- because the collapsing part has to be one
 * block to animate; single rows scattered through a grid cannot. Both groups
 * use the same columns, so they line up as one list.
 *
 * The toggle follows from the mix. With only `'always'` details there is
 * nothing to open and no toggle. With only `'expanded'` ones the toggle is an
 * icon in the row, and a closed header is just the row. With both, it is a
 * "Show more" under the visible part, where the eye already is.
 *
 * The header draws its own toggle rather than using `Collapsible`, whose
 * trigger is the whole header: the actions in the row would end up inside a
 * `<button>`.
 */
export const EntityHeader = ({
    title,
    titleAs: TitleTag = 'h2',
    leading,
    meta,
    actions,
    alert,
    details = [],
    detailColumns = 2,
    labels,
    value,
    defaultValue,
    onChange,
    persist,
    className,
    classNames,
    ref
}: EntityHeaderProps) => {
    const [expanded, setExpanded] = usePersistentState<boolean>({
        value,
        defaultValue,
        onChange,
        persist,
        fallback: false,
        revive: reviveExpanded
    });
    const regionId = useId();

    const visible = details.filter((d) => d.visibility === 'always');
    const hidden = details.filter((d) => d.visibility !== 'always');
    const toggle = () => setExpanded((prev) => !prev);

    const hiddenList = (
        <DescriptionList items={hidden} columns={detailColumns} labels={labels} />
    );

    return (
        <Card ref={ref} className={className}>
            <div
                className={cn(
                    "px-5 py-4 flex items-center gap-4 bg-card-header",
                    classNames?.header
                )}
            >
                {leading && <div className="shrink-0 flex items-center">{leading}</div>}
                <div className="min-w-0 flex-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <TitleTag
                        className={cn(
                            "min-w-0 max-w-full truncate text-xl font-bold text-text-primary",
                            classNames?.title
                        )}
                    >
                        {title}
                    </TitleTag>
                    {meta && (
                        <div className={cn("flex flex-wrap items-center gap-2", classNames?.meta)}>
                            {meta}
                        </div>
                    )}
                </div>
                {(actions || (hidden.length > 0 && visible.length === 0)) && (
                    <div className={cn("shrink-0 flex items-center gap-2", classNames?.actions)}>
                        {hidden.length > 0 && visible.length === 0 && (
                            <ActionButton
                                icon={Info}
                                variant={expanded ? 'solid' : 'ghost'}
                                tooltip={labels?.details ?? 'Details'}
                                aria-expanded={expanded}
                                aria-controls={regionId}
                                onClick={toggle}
                                className={classNames?.toggle}
                            />
                        )}
                        {actions}
                    </div>
                )}
            </div>

            {alert && (
                <div className={cn("px-5 py-3 border-t border-border", classNames?.alert)}>
                    {alert}
                </div>
            )}

            {visible.length > 0 && (
                <div className={cn("px-5 py-4 border-t border-border", classNames?.details)}>
                    <DescriptionList items={visible} columns={detailColumns} labels={labels} />
                    {hidden.length > 0 && (
                        <>
                            <CollapsibleRegion id={regionId} expanded={expanded}>
                                <div className="pt-4">{hiddenList}</div>
                            </CollapsibleRegion>
                            <div className="flex justify-end mt-2">
                                <button
                                    type="button"
                                    aria-expanded={expanded}
                                    aria-controls={regionId}
                                    onClick={toggle}
                                    className={cn(
                                        "flex items-center gap-1 rounded text-sm text-text-muted hover:text-text-primary transition",
                                        FOCUS_RING,
                                        classNames?.toggle
                                    )}
                                >
                                    {expanded ? labels?.showLess ?? 'Show less' : labels?.showMore ?? 'Show more'}
                                    <ChevronDown
                                        size={16}
                                        aria-hidden
                                        className={cn("transition-transform duration-slow", expanded && "rotate-180")}
                                    />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {visible.length === 0 && hidden.length > 0 && (
                <CollapsibleRegion id={regionId} expanded={expanded}>
                    <div className={cn("px-5 py-4 border-t border-border", classNames?.details)}>
                        {hiddenList}
                    </div>
                </CollapsibleRegion>
            )}
        </Card>
    );
};
