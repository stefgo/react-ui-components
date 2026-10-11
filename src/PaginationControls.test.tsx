import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PaginationControls } from './PaginationControls';

const props = {
    page: 1,
    totalPages: 3,
    pageSize: 20,
    totalItems: 50,
    onPageChange: () => {},
    onPageSizeChange: () => {},
};

describe('PaginationControls', () => {
    // The label stands beside the select rather than coming from it, so the
    // id is all that ties the two together.
    it('names the page size by the label beside it', () => {
        render(<PaginationControls {...props} />);
        expect(screen.getByRole('combobox', { name: 'Rows per page:' })).toHaveValue('20');
    });

    it('reports a chosen page size as a number', async () => {
        const onPageSizeChange = vi.fn();
        render(<PaginationControls {...props} onPageSizeChange={onPageSizeChange} />);

        await userEvent.selectOptions(screen.getByRole('combobox'), '50');
        expect(onPageSizeChange).toHaveBeenCalledWith(50);
    });

    it('shapes the page size like the filters above the rows', () => {
        render(<PaginationControls {...props} />);
        expect(screen.getByRole('combobox')).toHaveClass('rounded-full');
    });
});
