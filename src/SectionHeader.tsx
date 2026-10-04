import { ReactNode } from 'react';
import type { CardTitleLevel } from './Card';
import { cn } from './utils';

export interface SectionHeaderClassNames {
    title?: string;
    description?: string;
}

export interface SectionHeaderProps {
    title: ReactNode;
    /** Heading level of `title`. Defaults to `'h3'`: a section sits below its page's and its card's heading. */
    titleAs?: CardTitleLevel;
    /** What the section controls, in a sentence or two. */
    children?: ReactNode;
    className?: string;
    classNames?: SectionHeaderClassNames;
}

/**
 * The heading of a section of a form: what it controls, in a sentence or two.
 * The fields below fill the panel's width; the running text is held to a
 * readable line length instead.
 */
export const SectionHeader = ({ title, titleAs: TitleTag = 'h3', children, className, classNames }: SectionHeaderProps) => (
    <div className={cn("mb-6", className)}>
        <TitleTag className={cn("text-lg font-bold text-text-primary", classNames?.title)}>{title}</TitleTag>
        {children && (
            <p className={cn("text-sm text-text-muted max-w-prose", classNames?.description)}>{children}</p>
        )}
    </div>
);
