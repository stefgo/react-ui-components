import { useEffect, useRef } from 'react';
import { cn } from './utils';

export interface ActionMenuClassNames {
    overlay?: string;
    root?: string;
}

interface ActionMenuProps {
    isOpen: boolean;
    onClose: () => void;
    position: { x: number; y: number };
    children: React.ReactNode;
    className?: string; // Standard className for root
    classNames?: ActionMenuClassNames;
}

export const ActionMenu = ({ isOpen, onClose, position, children, className = '', classNames }: ActionMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={cn("fixed inset-0 z-40", classNames?.overlay)} onClick={(e) => { e.stopPropagation(); onClose(); }}>
            <div
                ref={menuRef}
                className={cn(
                    "fixed mt-2 w-48 bg-card dark:bg-card-dark rounded-md shadow-lg border border-card dark:border-card-dark z-50 py-1",
                    className,
                    classNames?.root
                )}
                style={{
                    top: position.y,
                    left: position.x - 192 // Align right edge
                }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside menu
            >
                {children}
            </div>
        </div>
    );
};
