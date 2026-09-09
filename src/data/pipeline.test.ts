import { describe, expect, it } from 'vitest';
import { runDataPipeline } from './pipeline';

interface Row { id: number; name: string }

const rows: Row[] = [
    { id: 1, name: 'delta' },
    { id: 2, name: 'alpha' },
    { id: 3, name: 'charlie' },
    { id: 4, name: 'bravo' },
    { id: 5, name: 'echo' },
];

const byName = (a: Row, b: Row) => a.name.localeCompare(b.name);

describe('runDataPipeline', () => {
    it('sorts across the whole set before taking a page', () => {
        // The regression this whole module exists for: slicing first would put
        // 'delta' and 'alpha' on page one and sort only those two.
        const result = runDataPipeline({
            data: rows,
            compare: byName,
            state: { page: 1, pageSize: 2 },
        });
        expect(result.rows.map(r => r.name)).toEqual(['alpha', 'bravo']);
        expect(result.totalItems).toBe(5);
        expect(result.totalPages).toBe(3);
    });

    it('filters before counting, so the total matches what is rendered', () => {
        const result = runDataPipeline({
            data: rows,
            filter: r => r.name.includes('a'),
            state: { page: 1, pageSize: 10 },
        });
        expect(result.totalItems).toBe(4);
        expect(result.isFiltered).toBe(true);
    });

    it('filters before sorting and slicing', () => {
        const result = runDataPipeline({
            data: rows,
            filter: r => r.id % 2 === 1,
            compare: byName,
            state: { page: 1, pageSize: 2 },
        });
        expect(result.rows.map(r => r.name)).toEqual(['charlie', 'delta']);
        expect(result.totalItems).toBe(3);
    });

    it('brings an out-of-range page back in and says so', () => {
        const result = runDataPipeline({
            data: rows,
            state: { page: 9, pageSize: 2 },
        });
        expect(result.page).toBe(3);
        expect(result.isClamped).toBe(true);
        expect(result.rows).toHaveLength(1);
    });

    it('reports one page for an empty set instead of zero', () => {
        const result = runDataPipeline({ data: [], state: { page: 1, pageSize: 10 } });
        expect(result.totalPages).toBe(1);
        expect(result.page).toBe(1);
        expect(result.totalItems).toBe(0);
        expect(result.rows).toEqual([]);
    });

    it('returns the trailing partial page', () => {
        const result = runDataPipeline({
            data: rows,
            state: { page: 3, pageSize: 2 },
        });
        expect(result.rows.map(r => r.id)).toEqual([5]);
    });

    it('leaves the caller order alone when nothing is sorted', () => {
        const result = runDataPipeline({ data: rows });
        expect(result.rows).toBe(rows);
    });

    it('passes server-side data through untouched', () => {
        const page = rows.slice(0, 2);
        const result = runDataPipeline({
            data: page,
            mode: 'server',
            compare: byName,
            filter: () => false,
            state: { page: 2, pageSize: 2 },
            totalItems: 40,
        });
        expect(result.rows).toBe(page);
        expect(result.totalItems).toBe(40);
        expect(result.totalPages).toBe(20);
        expect(result.page).toBe(2);
    });

    it('keeps paging forward while the server total is unknown', () => {
        const result = runDataPipeline({
            data: rows,
            mode: 'server',
            state: { page: 7, pageSize: 5 },
            totalItems: -1,
        });
        expect(result.totalPages).toBe(-1);
        expect(result.page).toBe(7);
        expect(result.isClamped).toBe(false);
    });
});
