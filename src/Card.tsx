import { ReactNode, Ref } from 'react';
import { cn } from './utils';

export interface CardClassNames {
    header?: string;
    headerTitle?: string;
    headerAction?: string;
    /** The padding wrapper around `children`. Only exists while `padding` is not `'none'`. */
    content?: string;
}

export type CardTitleLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';

/**
 * `'none'` renders `children` as the card's own children, with no wrapper at
 * all — a data view or a file list brings its own scroll container and has to
 * be a direct flex child of the card to fill it.
 */
export type CardPadding = 'none' | 'md';

export interface CardProps {
    children?: ReactNode;
    title?: ReactNode;
    action?: ReactNode;
    /**
     * Heading level for `title`. Pick the one that fits the surrounding document
     * outline; `div` opts out of the outline entirely.
     */
    titleAs?: CardTitleLevel;
    /** Inner spacing of the content area. Defaults to `'md'`. */
    padding?: CardPadding;
    className?: string;
    classNames?: CardClassNames;
    ref?: Ref<HTMLDivElement>;
}

export const Card = ({ children, title, action, titleAs: TitleTag = 'h3', padding = 'none', className = '', classNames, ref }: CardProps) => {
    const showHeader = title || action;
    return (
        <div
            ref={ref}
            className={cn(
                "bg-card overflow-hidden rounded-lg border border-border shadow-lg",
                className
            )}
        >
            {showHeader && (
                <div className={cn(
                    "px-5 py-4 border-b border-border flex justify-between items-center bg-card-header rounded-t-lg",
                    classNames?.header
                )}>
                    {title && <TitleTag className={cn("font-semibold text-text-primary flex items-center gap-2", classNames?.headerTitle)}>{title}</TitleTag>}
                    {action && <div className={cn(classNames?.headerAction)}>{action}</div>}
                </div>
            )}
            {padding === 'none'
                ? children
                : <div className={cn("p-6", classNames?.content)}>{children}</div>}
        </div>
    );
};
