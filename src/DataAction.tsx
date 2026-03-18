import * as React from 'react';
import { MoreVertical } from 'lucide-react';
import { ActionButton, ActionButtonColor, ActionButtonClassNames } from './ActionButton';
import { ActionMenu, ActionMenuClassNames } from './ActionMenu';
import { useActionMenu } from './hooks/useActionMenu';
import { cn } from './utils';

export interface DataActionClassNames {
    root?: string;
    actionButton?: ActionButtonClassNames;
    menuTrigger?: ActionButtonClassNames;
    menu?: ActionMenuClassNames;
    menuItem?: string;
    menuItemActive?: string;
    menuItemDisabled?: string;
}

export interface DataTableActionItem {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    onClick: (e: React.MouseEvent) => void;
    color?: ActionButtonColor;
    tooltip?: string | { enabled: string; disabled: string };
    disabled?: boolean | (() => boolean);
    className?: string;
}

export interface DataTableActionMenuEntry {
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    onClick: () => void;
    disabled?: boolean;
    disabledTitle?: string;
    variant?: 'danger' | 'default';
}

interface DataTableActionProps<TId extends string | number> {
    /** Unique identifier for this row – used to track which overflow menu is open */
    rowId: TId;
    /** Primary action buttons rendered inline (left of the overflow trigger) */
    actions?: DataTableActionItem[];
    /** Entries rendered inside the overflow dropdown menu */
    menuEntries?: DataTableActionMenuEntry[];
    className?: string;
    classNames?: DataActionClassNames;
}

export const DataAction = <TId extends string | number>({
    rowId,
    actions = [],
    menuEntries = [],
    className = "",
    classNames
}: DataTableActionProps<TId>) => {
    const { menuState, openMenu, closeMenu } = useActionMenu<TId>();

    const isMenuOpen = menuState?.id === rowId;

    return (
        <div className={cn("flex justify-end gap-2 items-center", className, classNames?.root)}>
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
                    />

                    <ActionMenu
                        isOpen={isMenuOpen}
                        onClose={closeMenu}
                        position={menuState || { x: 0, y: 0 }}
                        classNames={classNames?.menu}
                    >
                        {menuEntries.map((entry, index) => {
                            const isDanger = entry.variant === 'danger';
                            const isDisabled = entry.disabled ?? false;

                            const enabledClass = isDanger
                                ? 'text-error hover:bg-error-bg dark:hover:bg-error-bg-dark'
                                : 'text-text-secondary dark:text-text-secondary-dark hover:bg-hover dark:hover:bg-hover-dark';

                            const disabledClass = 'text-text-muted dark:text-text-muted-dark cursor-not-allowed';

                            return (
                                <button
                                    key={index}
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
                                    title={isDisabled ? entry.disabledTitle : entry.label}
                                >
                                    <entry.icon size={14} />
                                    {entry.label}
                                </button>
                            );
                        })}
                    </ActionMenu>
                </div>
            )}
        </div>
    );
};
