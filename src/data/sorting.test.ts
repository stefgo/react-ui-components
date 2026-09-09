import { beforeEach, describe, expect, it } from 'vitest';
import { buildComparator, nextSortColumns, readStoredSort } from './sorting';
import type { DataTableDef } from '../DataTable';

interface Row { id: number; name: string; size: number | null }

const itemDef: DataTableDef<Row>[] = [
    { tableHeader: 'Name', accessorKey: 'name', sortable: true },
    { tableHeader: 'Size', accessorKey: 'size', sortable: true },
    { tableHeader: 'Actions' },
];

describe('nextSortColumns', () => {
    it('starts ascending, then toggles on a second plain click', () => {
        const first = nextSortColumns([], 0, false);
        expect(first).toEqual([{ colIndex: 0, direction: 'asc' }]);
        expect(nextSortColumns(first, 0, false)).toEqual([{ colIndex: 0, direction: 'desc' }]);
    });

    it('replaces the sort when a different column is clicked plainly', () => {
        expect(nextSortColumns([{ colIndex: 0, direction: 'desc' }], 1, false))
            .toEqual([{ colIndex: 1, direction: 'asc' }]);
    });

    it('appends with shift and cycles that column asc → desc → removed', () => {
        const two = nextSortColumns([{ colIndex: 0, direction: 'asc' }], 1, true);
        expect(two).toHaveLength(2);
        const desc = nextSortColumns(two, 1, true);
        expect(desc[1]).toEqual({ colIndex: 1, direction: 'desc' });
        expect(nextSortColumns(desc, 1, true)).toEqual([{ colIndex: 0, direction: 'asc' }]);
    });
});

describe('buildComparator', () => {
    const rows: Row[] = [
        { id: 1, name: 'b', size: 2 },
        { id: 2, name: 'a', size: null },
        { id: 3, name: 'a', size: 1 },
    ];

    it('returns undefined when nothing is sorted', () => {
        expect(buildComparator(itemDef, [])).toBeUndefined();
    });

    it('sorts null values last regardless of direction', () => {
        const asc = [...rows].sort(buildComparator(itemDef, [{ colIndex: 1, direction: 'asc' }])!);
        expect(asc.map(r => r.id)).toEqual([3, 1, 2]);
        const desc = [...rows].sort(buildComparator(itemDef, [{ colIndex: 1, direction: 'desc' }])!);
        expect(desc.map(r => r.id)).toEqual([1, 3, 2]);
    });

    it('breaks ties with the next sort column', () => {
        const cmp = buildComparator(itemDef, [
            { colIndex: 0, direction: 'asc' },
            { colIndex: 1, direction: 'asc' },
        ])!;
        expect([...rows].sort(cmp).map(r => r.id)).toEqual([3, 2, 1]);
    });

    it('skips columns that cannot be sorted', () => {
        expect(buildComparator(itemDef, [{ colIndex: 2, direction: 'asc' }])).toBeUndefined();
    });
});

describe('readStoredSort', () => {
    // A two-method stand-in: the function only reads, and pulling in a whole DOM
    // implementation for that would be out of proportion.
    beforeEach(() => {
        const store = new Map<string, string>();
        Object.defineProperty(globalThis, 'localStorage', {
            configurable: true,
            value: {
                getItem: (k: string) => store.get(k) ?? null,
                setItem: (k: string, v: string) => { store.set(k, v); },
            },
        });
    });

    it('falls back to defaultSort without a storage key', () => {
        expect(readStoredSort(itemDef, undefined, { colIndex: 1, direction: 'desc' }))
            .toEqual([{ colIndex: 1, direction: 'desc' }]);
    });

    it('discards a stored colIndex that no longer exists', () => {
        localStorage.setItem('sort-test', JSON.stringify([{ colIndex: 9, direction: 'asc' }]));
        expect(readStoredSort(itemDef, 'sort-test')).toEqual([]);
    });

    it('discards a stored value that is not an array of sort entries', () => {
        localStorage.setItem('sort-test', '{"colIndex":0}');
        expect(readStoredSort(itemDef, 'sort-test', { colIndex: 0, direction: 'asc' }))
            .toEqual([{ colIndex: 0, direction: 'asc' }]);
    });

    it('reads back a valid entry', () => {
        localStorage.setItem('sort-test', JSON.stringify([{ colIndex: 1, direction: 'desc' }]));
        expect(readStoredSort(itemDef, 'sort-test')).toEqual([{ colIndex: 1, direction: 'desc' }]);
    });
});
