import { ReactNode } from 'react';
import { cn } from '../utils';

export interface FieldLabelProps {
    /**
     * `label` for a control, tied to it with `htmlFor`. `div`, `p` or `span`
     * for a caption over something that is not one -- a read-only value, a
     * list with its own controls -- where a `<label>` would name nothing.
     */
    as?: 'label' | 'div' | 'p' | 'span';
    htmlFor?: string;
    id?: string;
    /** Adds the asterisk. Decoration only: `required` on the control is what is announced. */
    required?: boolean;
    className?: string;
    children: ReactNode;
}

/**
 * The small uppercase caption above a field.
 *
 * It is what `FormField` renders for a stacked label, as a component of its
 * own: two apps wrote its class string by hand in twenty-six places, for the
 * captions that sit above something other than one of the library's controls,
 * and in three different spacings.
 */
export const FieldLabel = ({ as: Tag = 'label', htmlFor, id, required, className, children }: FieldLabelProps) => (
    <Tag
        id={id}
        {...(Tag === 'label' ? { htmlFor } : {})}
        className={cn("block text-xs font-bold text-text-muted uppercase mb-1.5 ml-1", className)}
    >
        {children}
        {/*
            The asterisk is decoration: `required` on the control is what
            assistive technology reads, and hearing "star" adds nothing to it.
        */}
        {required && <span className="text-error" aria-hidden="true"> *</span>}
    </Tag>
);
