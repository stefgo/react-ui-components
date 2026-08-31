import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { ActionMenu } from './ActionMenu';
import { Button } from './Button';
import { useActionMenu } from './hooks/useActionMenu';
import { cn } from './utils';

const meta = {
    title: 'Overlays/ActionMenu',
    component: ActionMenu,
    // ActionMenu owns no trigger, so every story drives it itself. These
    // satisfy the required props; nothing renders from them.
    args: {
        isOpen: false,
        onClose: () => {},
        anchor: null,
        children: null
    },
    parameters: {
        docs: {
            description: {
                component:
                    'A menu in a portal, placed under its trigger and right-aligned, flipping above it when the page bottom is closer than the menu is tall. It renders where it is told and owns no trigger of its own — `useActionMenu` holds the open state and the anchor rect.'
            }
        }
    }
} satisfies Meta<typeof ActionMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const entryClass =
    'w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-hover focus-visible:outline-none focus-visible:bg-hover';

const WithHookDemo = () => {
    const { menuState, triggerRef, openMenu, closeMenu } = useActionMenu();

    return (
        <div className="p-8">
            <Button variant="secondary" onClick={(e) => openMenu(e, 'row-1')}>
                Actions
            </Button>
            <ActionMenu
                isOpen={menuState !== null}
                onClose={closeMenu}
                anchor={menuState?.anchor ?? null}
                triggerRef={triggerRef}
            >
                <button type="button" role="menuitem" className={entryClass} onClick={closeMenu}>
                    <Pencil size={14} aria-hidden /> Edit
                </button>
                <button type="button" role="menuitem" className={cn(entryClass, 'text-error')} onClick={closeMenu}>
                    <Trash2 size={14} aria-hidden /> Delete
                </button>
            </ActionMenu>
        </div>
    );
};

/** The pairing it is built for: `useActionMenu` supplies anchor, trigger and state. */
export const Playground: Story = { render: () => <WithHookDemo /> };

const NearTheBottomDemo = () => {
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [anchor, setAnchor] = useState<DOMRect | null>(null);

    return (
        <div className="h-[80vh] flex items-end p-8">
            <Button
                ref={triggerRef}
                variant="secondary"
                onClick={() => {
                    setAnchor(triggerRef.current!.getBoundingClientRect());
                    setIsOpen((open) => !open);
                }}
            >
                Actions
            </Button>
            <ActionMenu
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                anchor={anchor}
                triggerRef={triggerRef}
            >
                <button type="button" role="menuitem" className={entryClass}>Edit</button>
                <button type="button" role="menuitem" className={entryClass}>Delete</button>
            </ActionMenu>
        </div>
    );
};

/**
 * Against the bottom of the viewport the menu flips above its trigger instead
 * of being clipped. Shrink the preview pane until the trigger sits low.
 */
export const NearTheBottom: Story = { render: () => <NearTheBottomDemo /> };
