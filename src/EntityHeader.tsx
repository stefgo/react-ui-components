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

/**
 * A titled part of the details, for a page whose details are about more than
 * one thing -- a container, the host it runs on, the image it runs.
 */
export interface EntityDetailGroup {
    /** React key. */
    key: string;
    title: ReactNode;
    /** In front of the group's title: an icon, mostly. */
    leading?: ReactNode;
    /** Next to the group's title: badges about that part alone. */
    meta?: ReactNode;
    details: EntityDetail[];
}

export interface EntityHeaderClassNames {
    header?: string;
    title?: string;
    meta?: string;
    actions?: string;
    alert?: string;
    /** Each group's part, when the details are grouped. */
    details?: string;
    groupTitle?: string;
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
    /**
     * The details in titled groups, in place of `details`, which is ignored
     * when both are given. One toggle opens the `'expanded'` details of every
     * group at once.
     */
    detailGroups?: EntityDetailGroup[];
    /** Heading level of each group's title. Defaults to `'h3'`, one below the default `titleAs`. */
    groupTitleAs?: CardTitleLevel;
    detailColumns?: DescriptionListColumns;
    labels?: EntityHeaderLabels;
    className?: string;
    classNames?: EntityHeaderClassNames;
    ref?: Ref<HTMLDivElement>;
}

const reviveExpanded = (raw: unknown) => (typeof raw === 'boolean' ? raw : undefined);

/** A group of what `details` alone gives: no title, so no heading either. */
interface NormalizedGroup extends Omit<EntityDetailGroup, 'title'> {
    title?: ReactNode;
}

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
 * With `detailGroups` the same holds across all groups: each group splits its
 * details the same way and gets a region of its own, and the one toggle opens
 * them all. A group with only `'expanded'` details collapses whole, heading
 * included, so a closed header shows no heading over nothing.
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
    detailGroups,
    groupTitleAs: GroupTitleTag = 'h3',
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

    // Plain details are one group without a title; from here on both are rendered alike.
    const groups: NormalizedGroup[] = (detailGroups ?? [{ key: '', details }])
        .filter((g) => g.details.length > 0);
    const split = groups.map((g, index) => ({
        group: g,
        visible: g.details.filter((d) => d.visibility === 'always'),
        hidden: g.details.filter((d) => d.visibility !== 'always'),
        id: detailGroups ? `${regionId}-${index}` : regionId
    }));
    const anyVisible = split.some((s) => s.visible.length > 0);
    const anyHidden = split.some((s) => s.hidden.length > 0);
    const iconToggle = anyHidden && !anyVisible;
    // Every region the toggle opens; with only collapsible details they share one.
    const controls = iconToggle
        ? regionId
        : split.filter((s) => s.hidden.length > 0).map((s) => s.id).join(' ');
    const toggle = () => setExpanded((prev) => !prev);

    const list = (items: EntityDetail[]) => (
        <DescriptionList items={items} columns={detailColumns} labels={labels} />
    );

    const heading = (g: NormalizedGroup) =>
        g.title !== undefined && (
            <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                {g.leading && <div className="shrink-0 flex items-center text-text-muted">{g.leading}</div>}
                <GroupTitleTag
                    className={cn("min-w-0 text-sm font-semibold text-text-primary", classNames?.groupTitle)}
                >
                    {g.title}
                </GroupTitleTag>
                {g.meta && <div className="flex flex-wrap items-center gap-2">{g.meta}</div>}
            </div>
        );

    const section = (g: NormalizedGroup, children: ReactNode) => (
        <div key={g.key} className={cn("px-5 py-4 border-t border-border", classNames?.details)}>
            {heading(g)}
            {children}
        </div>
    );

    const showMore = (
        <div className="flex justify-end mt-2">
            <button
                type="button"
                aria-expanded={expanded}
                aria-controls={controls}
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
    );

    // With visible details, "Show more" sits under the last of them. When the last group
    // collapses whole, it gets a row of its own, since that group's part may be closed.
    const last = split[split.length - 1];
    const toggleInLast = anyHidden && !!last && last.visible.length > 0;

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
                {(actions || iconToggle) && (
                    <div className={cn("shrink-0 flex items-center gap-2", classNames?.actions)}>
                        {iconToggle && (
                            <ActionButton
                                icon={Info}
                                variant={expanded ? 'solid' : 'ghost'}
                                tooltip={labels?.details ?? 'Details'}
                                aria-expanded={expanded}
                                aria-controls={controls}
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

            {anyVisible && (
                <>
                    {split.map(({ group, visible, hidden, id }) =>
                        visible.length === 0 ? (
                            <CollapsibleRegion key={group.key} id={id} expanded={expanded}>
                                {section(group, list(hidden))}
                            </CollapsibleRegion>
                        ) : (
                            section(
                                group,
                                <>
                                    {list(visible)}
                                    {hidden.length > 0 && (
                                        <CollapsibleRegion id={id} expanded={expanded}>
                                            <div className="pt-4">{list(hidden)}</div>
                                        </CollapsibleRegion>
                                    )}
                                    {group === last.group && toggleInLast && showMore}
                                </>
                            )
                        )
                    )}
                    {anyHidden && !toggleInLast && <div className="px-5 pb-4">{showMore}</div>}
                </>
            )}

            {iconToggle && (
                <CollapsibleRegion id={regionId} expanded={expanded}>
                    {split.map(({ group, hidden }) => section(group, list(hidden)))}
                </CollapsibleRegion>
            )}
        </Card>
    );
};
