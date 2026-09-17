import { describe, expect, it } from 'vitest';
import { buildComparator, nextSortColumns, reviveSort } from './sorting';
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

describe('reviveSort', () => {
    const revive = reviveSort(itemDef);

    it('rejects a stored colIndex that no longer exists', () => {
        // Rejecting, not returning []: `undefined` is what hands the decision
        // back to `defaultValue`, while [] would claim "sorted by nothing".
        expect(revive([{ colIndex: 9, direction: 'asc' }])).toBeUndefined();
    });

    it('rejects anything that is not an array of sort entries', () => {
        expect(revive({ colIndex: 0 })).toBeUndefined();
        expect(revive('desc')).toBeUndefined();
        expect(revive([{ colIndex: 0, direction: 'sideways' }])).toBeUndefined();
    });

    it('keeps the usable entries of a partly stale sort', () => {
        expect(revive([{ colIndex: 1, direction: 'desc' }, { colIndex: 9, direction: 'asc' }]))
            .toEqual([{ colIndex: 1, direction: 'desc' }]);
    });
});
