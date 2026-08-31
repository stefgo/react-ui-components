import * as React from 'react';
import { MoreVertical } from 'lucide-react';
import { ActionButton, ActionButtonColor, ActionButtonClassNames } from './ActionButton';
import { ActionMenu } from './ActionMenu';
import { useActionMenu } from './hooks/useActionMenu';
import { ICON_SIZE, type IconComponent } from './types';
import { cn } from './utils';

export interface DataActionClassNames {
    actionButton?: ActionButtonClassNames;
    menuTrigger?: ActionButtonClassNames;
    menuItem?: string;
    menuItemActive?: string;
    menuItemDisabled?: string;
}

export interface DataTableActionItem {
    icon: IconComponent;
    onClick: (e: React.MouseEvent) => void;
    color?: ActionButtonColor;
    tooltip?: string | { enabled: string; disabled: string };
    disabled?: boolean | (() => boolean);
    className?: string;
}

export interface DataTableActionMenuEntry {
    label: string | { enabled: string; disabled: string };
    icon: IconComponent;
    onClick: () => void;
    disabled?: boolean;
    disabledTitle?: string;
    variant?: 'danger' | 'default';
}

export interface DataActionProps<TId extends string | number> {
    /** Unique identifier for this row – used to track which overflow menu is open */
    rowId: TId;
    /** Primary action buttons rendered inline (left of the overflow trigger) */
    actions?: DataTableActionItem[];
    /** Entries rendered inside the overflow dropdown menu */
    menuEntries?: DataTableActionMenuEntry[];
    /** Accessible name of the overflow trigger, which renders an icon only. */
    menuLabel?: string;
    className?: string;
    classNames?: DataActionClassNames;
}

export const DataAction = <TId extends string | number>({
    rowId,
    actions = [],
    menuEntries = [],
    menuLabel = "More actions",
    className = "",
    classNames
}: DataActionProps<TId>) => {
    const { menuState, triggerRef, openMenu, closeMenu } = useActionMenu<TId>();

    const isMenuOpen = menuState?.id === rowId;

    return (
        <div className={cn("flex justify-end gap-2 items-center", className)}>
            {actions.map((action, index) => (
                <ActionButton
                    key={index}
                    icon={action.icon}
                    onClick={action.onClick}
                    color={action.color ?? 'gray'}
                    tooltip={action.tooltip}
                    disabled={action.disabled}
                    className={action.className}
                    classNames={classNames?.actionButton}
                />
            ))}

            {menuEntries.length > 0 && (
                <div className="relative">
                    <ActionButton
                        icon={MoreVertical}
                        onClick={(e) => openMenu(e, rowId)}
                        color="gray"
                        className={cn(isMenuOpen ? 'opacity-100' : '')}
                        classNames={classNames?.menuTrigger}
                        aria-label={menuLabel}
                        aria-haspopup="menu"
                        aria-expanded={isMenuOpen}
                    />

                    <ActionMenu
                        isOpen={isMenuOpen}
                        onClose={closeMenu}
                        anchor={menuState?.anchor ?? null}
                        triggerRef={triggerRef}
                    >
                        {menuEntries.map((entry, index) => {
                            const isDanger = entry.variant === 'danger';
                            const isDisabled = entry.disabled ?? false;

                            const enabledClass = isDanger
                                ? 'text-error hover:bg-error-bg'
                                : 'text-text-secondary hover:bg-hover';

                            const disabledClass = 'text-text-muted cursor-not-allowed';

                            const labelText = typeof entry.label === 'string'
                                ? entry.label
                                : isDisabled ? entry.label.disabled : entry.label.enabled;

                            return (
                                <button
                                    key={index}
                                    type="button"
                                    role="menuitem"
                                    onClick={() => {
                                        if (!isDisabled) {
                                            entry.onClick();
                                            closeMenu();
                                        }
                                    }}
                                    disabled={isDisabled}
                                    className={cn(
                                        "w-full text-left px-4 py-2 text-sm flex items-center gap-2",
                                        isDisabled ? disabledClass : enabledClass,
                                        classNames?.menuItem,
                                        isDisabled ? classNames?.menuItemDisabled : classNames?.menuItemActive
                                    )}
                                    title={isDisabled ? (entry.disabledTitle ?? labelText) : labelText}
                                >
                                    <entry.icon size={ICON_SIZE.sm} aria-hidden />
                                    {labelText}
                                </button>
                            );
                        })}
                    </ActionMenu>
                </div>
            )}
        </div>
    );
};
