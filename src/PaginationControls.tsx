import { useId } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from './utils';
import { FOCUS_RING } from './focus';

export interface PaginationControlsClassNames {
    infoWrapper?: string;
    select?: string;
    pageInfo?: string;
    controlsWrapper?: string;
    button?: string;
    pageText?: string;
}

export interface PaginationControlsProps {
    /** One-based. */
    page: number;
    /** -1 when the total is unknown, in which case paging forward stays possible. */
    totalPages: number;
    pageSize: number;
    /** -1 when unknown. */
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    pageSizeOptions?: number[];
    /** Hide the bar entirely while everything fits on one page. Default false. */
    hideOnSinglePage?: boolean;
    classNames?: PaginationControlsClassNames;
}

export const PaginationControls = ({
    page,
    totalPages,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 50],
    hideOnSinglePage = false,
    classNames,
}: PaginationControlsProps) => {
    const selectId = useId();

    const totalKnown = totalItems >= 0 && totalPages >= 0;
    if (hideOnSinglePage && totalKnown && totalPages <= 1) return null;

    const firstOnPage = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
    const lastOnPage = totalKnown ? Math.min(page * pageSize, totalItems) : page * pageSize;

    return (
        <div className={cn(
            "flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-3 border-t border-border bg-table-header"
        )}>
            <div className={cn("flex items-center gap-2 text-sm text-text-secondary", classNames?.infoWrapper)}>
                <label htmlFor={selectId}>Rows per page:</label>
                <select
                    id={selectId}
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className={cn(
                        "bg-input-bg border border-input-border text-text-primary text-sm rounded-sm focus-visible:border-primary block p-1",
                        FOCUS_RING,
                        classNames?.select
                    )}
                >
                    {pageSizeOptions.map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
                <span className={cn("ml-2", classNames?.pageInfo)}>
                    {firstOnPage} - {lastOnPage}{totalKnown && ` of ${totalItems}`}
                </span>
            </div>

            <div className={cn("flex items-center gap-1", classNames?.controlsWrapper)}>
                <button
                    type="button"
                    aria-label="Previous page"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    className={cn(
                        "p-1 rounded-sm hover:bg-hover disabled:opacity-50 disabled:cursor-not-allowed text-text-secondary transition-colors",
                        FOCUS_RING,
                        classNames?.button
                    )}
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-1 px-2">
                    <span className={cn("text-sm text-text-secondary", classNames?.pageText)}>
                        Page {page}{totalKnown && ` of ${totalPages}`}
                    </span>
                </div>
                <button
                    type="button"
                    aria-label="Next page"
                    onClick={() => onPageChange(page + 1)}
                    disabled={totalKnown && page >= totalPages}
                    className={cn(
                        "p-1 rounded-sm hover:bg-hover disabled:opacity-50 disabled:cursor-not-allowed text-text-secondary transition-colors",
                        FOCUS_RING,
                        classNames?.button
                    )}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};
