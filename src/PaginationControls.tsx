import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from './utils';

export interface PaginationControlsClassNames {
    root?: string;
    infoWrapper?: string;
    select?: string;
    pageInfo?: string;
    controlsWrapper?: string;
    button?: string;
    pageText?: string;
}

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (size: number) => void;
    pageSizeOptions?: number[];
    classNames?: PaginationControlsClassNames;
}

export const PaginationControls = ({
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    onPageChange,
    onItemsPerPageChange,
    pageSizeOptions = [10, 20, 50],
    classNames
}: PaginationControlsProps) => {
    // Only render if total items exceed the smallest page size option (or just 10 if not checking options)
    if (totalItems <= pageSizeOptions[0]) {
        return null;
    }

    return (
        <div className={cn(
            "flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-3 border-t border-border dark:border-border-dark bg-table-header dark:bg-table-header-dark",
            classNames?.root
        )}>
            <div className={cn("flex items-center gap-2 text-sm text-text-secondary dark:text-text-muted-dark", classNames?.infoWrapper)}>
                <span>Rows per page:</span>
                <select
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    className={cn(
                        "bg-input-bg dark:bg-input-bg-dark border border-input-border dark:border-input-border-dark text-text-primary dark:text-text-primary-dark text-sm rounded focus:ring-primary focus:border-primary block p-1",
                        classNames?.select
                    )}
                >
                    {pageSizeOptions.map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
                <span className={cn("ml-2", classNames?.pageInfo)}>
                    {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
                </span>
            </div>

            <div className={cn("flex items-center gap-1", classNames?.controlsWrapper)}>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={cn(
                        "p-1 rounded hover:bg-hover dark:hover:bg-hover-dark disabled:opacity-50 disabled:cursor-not-allowed text-text-secondary dark:text-text-muted-dark transition-colors",
                        classNames?.button
                    )}
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-1 px-2">
                    <span className={cn("text-sm text-text-secondary dark:text-text-muted-dark", classNames?.pageText)}>
                        Page {currentPage} of {totalPages}
                    </span>
                </div>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={cn(
                        "p-1 rounded hover:bg-hover dark:hover:bg-hover-dark disabled:opacity-50 disabled:cursor-not-allowed text-text-secondary dark:text-text-muted-dark transition-colors",
                        classNames?.button
                    )}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};
