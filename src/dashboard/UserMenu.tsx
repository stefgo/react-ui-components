import { useId, useRef, useState } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useMenuBehavior } from '../hooks/useMenuBehavior';
import { cn } from '../utils';

export interface UserMenuClassNames {
    trigger?: string;
    iconWrapper?: string;
    dropdown?: string;
    info?: string;
    logout?: string;
}

interface UserMenuProps {
    username: string;
    onLogout: () => void;
    /** Label above the username, e.g. for localisation. */
    signedInAsLabel?: string;
    logoutLabel?: string;
    classNames?: UserMenuClassNames;
}

export const UserMenu = ({
    username,
    onLogout,
    signedInAsLabel = 'Signed in as',
    logoutLabel = 'Sign out',
    classNames
}: UserMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuId = useId();

    const { containerRef } = useMenuBehavior<HTMLDivElement>({
        isOpen,
        onClose: () => setIsOpen(false),
        mode: 'menu',
        triggerRef
    });

    return (
        <div className="relative">
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setIsOpen(open => !open)}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-controls={isOpen ? menuId : undefined}
                aria-label={`${signedInAsLabel} ${username}`}
                className={cn(
                    "flex items-center gap-2 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors p-1 pr-2 rounded-lg hover:bg-hover dark:hover:bg-hover-dark",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    classNames?.trigger
                )}
            >
                <div className={cn("w-8 h-8 rounded-full bg-hover dark:bg-hover-dark flex items-center justify-center text-text-secondary dark:text-text-muted-dark", classNames?.iconWrapper)} aria-hidden="true">
                    <User size={18} />
                </div>
                <ChevronDown size={14} aria-hidden="true" className={cn("transition-transform duration-200", isOpen ? 'rotate-180' : '')} />
            </button>

            {isOpen && (
                <div
                    ref={containerRef}
                    id={menuId}
                    role="menu"
                    tabIndex={-1}
                    className={cn(
                        "absolute right-0 mt-2 w-56 bg-card dark:bg-card-dark rounded-xl shadow-xl border border-border dark:border-border-dark py-2 animate-slide-in-from-top z-dropdown focus:outline-none",
                        classNames?.dropdown
                    )}
                >
                    <div className={cn("px-4 py-3 border-b border-border dark:border-border-dark", classNames?.info)}>
                        <p className="text-xs text-text-muted dark:text-text-muted-dark font-medium uppercase tracking-wider mb-1">{signedInAsLabel}</p>
                        <p className="text-sm font-semibold text-text-primary dark:text-text-primary-dark truncate">{username}</p>
                    </div>

                    <div className="py-1">
                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                setIsOpen(false);
                                onLogout();
                            }}
                            className={cn(
                                "w-full text-left px-4 py-2 text-sm text-error hover:bg-error-bg dark:hover:bg-error-bg-dark flex items-center gap-2 transition-colors focus:outline-none focus-visible:bg-error-bg dark:focus-visible:bg-error-bg-dark",
                                classNames?.logout
                            )}
                        >
                            <LogOut size={16} aria-hidden="true" />
                            {logoutLabel}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
