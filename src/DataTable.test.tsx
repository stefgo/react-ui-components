import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable } from './DataTable';

interface Row {
    id: number;
    name: string;
    size: number;
}

const data: Row[] = [
    { id: 1, name: 'beta', size: 3 },
    { id: 2, name: 'alpha', size: 1 },
    { id: 3, name: 'gamma', size: 2 },
];

const itemDef = [
    { tableHeader: 'Name', accessorKey: 'name' as const, sortable: true },
    { tableHeader: 'Size', accessorKey: 'size' as const, sortable: true },
    { tableHeader: 'Notes' },
];

const namesInOrder = () =>
    screen.getAllByRole('row')
        .slice(1) // the header row
        .map((row) => row.querySelectorAll('td')[0].textContent);

describe('DataTable', () => {
    it('sorts from the keyboard, not from the mouse alone', async () => {
        render(<DataTable data={data} keyField="id" itemDef={itemDef} />);

        const header = screen.getByRole('button', { name: /Name/ });
        header.focus();
        await userEvent.keyboard('{Enter}');

        expect(namesInOrder()).toEqual(['alpha', 'beta', 'gamma']);
    });

    it('reports the sort direction through aria-sort', async () => {
        render(<DataTable data={data} keyField="id" itemDef={itemDef} />);

        const [nameHeader] = screen.getAllByRole('columnheader');
        expect(nameHeader).toHaveAttribute('aria-sort', 'none');

        await userEvent.click(screen.getByRole('button', { name: /Name/ }));
        expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

        await userEvent.click(screen.getByRole('button', { name: /Name/ }));
        expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
    });

    it('adds a second sort column with Shift+Enter, as with Shift+click', async () => {
        render(<DataTable data={data} keyField="id" itemDef={itemDef} />);

        await userEvent.click(screen.getByRole('button', { name: /Name/ }));

        const sizeHeader = screen.getByRole('button', { name: /Size/ });
        sizeHeader.focus();
        await userEvent.keyboard('{Shift>}{Enter}{/Shift}');

        const [nameCol, sizeCol] = screen.getAllByRole('columnheader');
        expect(nameCol).toHaveAttribute('aria-sort', 'ascending');
        expect(sizeCol).toHaveAttribute('aria-sort', 'ascending');
    });

    it('leaves a column that cannot be sorted out of the tab order', () => {
        render(<DataTable data={data} keyField="id" itemDef={itemDef} />);

        expect(screen.queryByRole('button', { name: /Notes/ })).not.toBeInTheDocument();
        expect(screen.getAllByRole('columnheader')[2]).not.toHaveAttribute('aria-sort');
    });

    it('activates a clickable row with Enter and with Space', async () => {
        const onRowClick = vi.fn();
        render(<DataTable data={data} keyField="id" itemDef={itemDef} onRowClick={onRowClick} />);

        const [firstRow] = screen.getAllByRole('row').slice(1);
        firstRow.focus();
        expect(firstRow).toHaveFocus();

        await userEvent.keyboard('{Enter}');
        await userEvent.keyboard(' ');

        expect(onRowClick).toHaveBeenCalledTimes(2);
        expect(onRowClick).toHaveBeenCalledWith(data[0]);
    });

    it('keeps a row that is not clickable out of the tab order', () => {
        render(<DataTable data={data} keyField="id" itemDef={itemDef} />);

        for (const row of screen.getAllByRole('row').slice(1)) {
            expect(row).not.toHaveAttribute('tabindex');
        }
    });

    it('does not fire the row when a control inside it is used', async () => {
        const onRowClick = vi.fn();
        const onInner = vi.fn();
        const withButton = [
            ...itemDef,
            { tableHeader: 'Action', tableItemRender: () => <button type="button" onClick={onInner}>Open</button> },
        ];
        render(<DataTable data={data} keyField="id" itemDef={withButton} onRowClick={onRowClick} />);

        const inner = screen.getAllByRole('button', { name: 'Open' })[0];
        inner.focus();
        await userEvent.keyboard('{Enter}');

        expect(onInner).toHaveBeenCalledTimes(1);
        expect(onRowClick).not.toHaveBeenCalled();
    });
});
