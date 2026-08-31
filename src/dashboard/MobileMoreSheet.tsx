import { ReactNode, useId } from 'react';
import { X, Shield } from 'lucide-react';
import type { SidebarGroup } from '../Sidebar';
import type { IconComponent } from '../types';
import { useMenuBehavior } from '../hooks/useMenuBehavior';
import { cn } from '../utils';

/** Edge length of every icon in the sheet — touch-sized, matching the bottom nav. */
const SHEET_ICON_SIZE = 24;

export interface MobileMoreSheetClassNames {
    overlay?: string;
    sheet?: string;
    header?: string;
    title?: string;
    close?: string;
    groupTitle?: string;
    item?: string;
    itemActive?: string;
}

interface MobileMoreSheetProps {
    isOpen: boolean;
    onClose: () => void;
    groups: SidebarGroup[];
    title?: ReactNode;
    icon?: IconComponent;
    closeLabel?: string;
    classNames?: MobileMoreSheetClassNames;
}

/**
 * The overflow navigation on small screens. It is a modal dialog: focus stays
 * inside, Escape closes it, tapping the backdrop closes it and the page behind
 * it does not scroll.
 */
export const MobileMoreSheet = ({
    isOpen,
    onClose,
    groups,
    title = 'More',
    icon: Icon = Shield,
    closeLabel = 'Close menu',
    classNames
}: MobileMoreSheetProps) => {
    const titleId = useId();

    const { containerRef } = useMenuBehavior<HTMLDivElement>({
        isOpen,
        onClose,
        mode: 'dialog',
        lockScroll: true
    });

    if (!isOpen) return null;

    return (
        <div
            className={cn("md:hidden fixed inset-0 z-overlay bg-overlay backdrop-blur-sm animate-fade-in", classNames?.overlay)}
            // conventions: mouse-only — tapping the backdrop is a shortcut;
            // useMenuBehavior closes the sheet on Escape.
            onClick={onClose}
        >
            <div
                ref={containerRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
                // The backdrop closes the sheet; clicks inside it must not bubble up there.
                onClick={(e) => e.stopPropagation()}
                className={cn(
                    "absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-card rounded-t-xl p-6 pb-24 animate-slide-in-from-bottom shadow-2xl focus:outline-none",
                    classNames?.sheet
                )}
            >
                <div className={cn("flex justify-between items-center mb-6 sticky top-0 bg-card z-sticky py-2", classNames?.header)}>
                    <h2 id={titleId} className={cn("text-xl font-bold text-text-primary flex items-center gap-2", classNames?.title)}>
                        <Icon className="text-text-muted" size={SHEET_ICON_SIZE} aria-hidden />
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={closeLabel}
                        className={cn(
                            "p-2 rounded-full bg-hover text-text-muted hover:bg-hover transition-colors",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                            classNames?.close
                        )}
                    >
                        <X size={20} aria-hidden="true" />
                    </button>
                </div>

                <div className="flex flex-col gap-6">
                    {groups.map((group, groupIdx) => (
                        <div key={groupIdx} className="space-y-3">
                            {group.title && (
                                <div className={cn("text-text-muted text-xs font-bold uppercase tracking-wider px-2", classNames?.groupTitle)}>
                                    {group.title}
                                </div>
                            )}
                            <div className="grid grid-cols-1 gap-2">
                                {group.items.map(({ icon: ItemIcon, ...item }) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={item.onClick}
                                        aria-current={item.active ? 'page' : undefined}
                                        className={cn(
                                            "flex items-center gap-4 p-4 rounded-lg transition-colors w-full text-left",
                                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                            item.active
                                                ? "bg-hover text-text-primary ring-1 ring-border"
                                                : "bg-app-bg text-text-secondary hover:bg-hover",
                                            classNames?.item,
                                            item.active ? classNames?.itemActive : ''
                                        )}
                                    >
                                        <ItemIcon
                                            size={SHEET_ICON_SIZE}
                                            className={cn(item.active ? "text-primary" : "")}
                                            aria-hidden
                                        />
                                        <span className="font-semibold text-lg flex-1">{item.label}</span>
                                        {item.badge && (
                                            <span className={cn(
                                                "text-xs px-2 py-1 rounded-full bg-hover",
                                                item.active
                                                    ? "text-text-primary"
                                                    : "text-text-muted"
                                            )}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
