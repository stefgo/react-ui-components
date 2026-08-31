import { describe, expect, it } from 'vitest';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { DataTable } from '../DataTable';

interface Row { id: number; name: string }
const rows: Row[] = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, name: `row-${String(25 - i).padStart(2, '0')}` }));

const render = (props: Record<string, unknown>) => renderToStaticMarkup(h(DataTable<Row>, {
    data: rows,
    keyField: 'id',
    itemDef: [{ tableHeader: 'Name', accessorKey: 'name', sortable: true }],
    ...props,
} as never));

const cells = (html: string) => [...html.matchAll(/<td[^>]*>([^<]*)<\/td>/g)].map(m => m[1]);

describe('DataTable end to end', () => {
    it('renders one page out of the full data set', () => {
        const html = render({ pagination: true });
        expect(cells(html)).toHaveLength(10);
        expect(cells(html)[0]).toBe('row-25');
        expect(html).toContain('1 - 10 of 25');
        expect(html).toContain('Page 1 of 3');
    });

    it('sorts the whole set, not just the page', () => {
        // defaultSort ascending: the first page must start at row-01, which only
        // happens if the sort ran before the slice.
        const html = render({ pagination: true, defaultSort: { colIndex: 0, direction: 'asc' } });
        expect(cells(html)[0]).toBe('row-01');
        expect(cells(html)[9]).toBe('row-10');
    });

    it('counts filtered rows, not all of them', () => {
        const html = render({
            pagination: true,
            filter: (r: Row) => r.name.endsWith('1'),
            filterKey: '1',
        });
        expect(html).toContain('of 3');
        expect(cells(html)).toHaveLength(3);
    });

    it('shows the no-results text when a filter removes everything', () => {
        const html = render({
            pagination: true,
            filter: () => false,
            filterKey: 'zzz',
            noResultsMessage: 'Nothing matched',
        });
        expect(html).toContain('Nothing matched');
    });

    it('renders no pagination bar without the prop', () => {
        const html = render({});
        expect(html).not.toContain('Rows per page');
        expect(cells(html)).toHaveLength(25);
    });
});
