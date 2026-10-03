import { describe, expect, it } from 'vitest';
import { toListColumns, toTableDef, type DataColumnDef, type DataListGroupDef } from './columns';

interface Row { id: number; name: string; size: number }

const row: Row = { id: 1, name: 'alpha', size: 3 };

describe('toTableDef', () => {
    it('takes the heading, the accessor and the sorting over as they are', () => {
        const sortValue = (item: Row) => item.size;
        const [def] = toTableDef<Row>([{ header: 'Size', accessorKey: 'size', sortable: true, sortValue }]);

        expect(def).toMatchObject({ tableHeader: 'Size', accessorKey: 'size', sortable: true, sortValue });
    });

    it('renders the cell as the table view', () => {
        const [def] = toTableDef<Row>([{ header: 'Name', render: (item, view) => `${item.name}/${view}` }]);

        expect(def.tableItemRender?.(row)).toBe('alpha/table');
    });

    it('leaves the renderer out where there is none, so the accessor is read', () => {
        const [def] = toTableDef<Row>([{ header: 'Name', accessorKey: 'name' }]);

        expect(def.tableItemRender).toBeUndefined();
    });

    it('passes the table class names on', () => {
        const cellClassName = () => 'w-px';
        const [def] = toTableDef<Row>([{ header: 'Name', table: { headerClassName: 'text-center', cellClassName } }]);

        expect(def.tableHeaderClassName).toBe('text-center');
        expect(def.tableCellClassName).toBe(cellClassName);
    });

    it('drops a column the table does not show, so a sort index counts the rest', () => {
        const defs = toTableDef<Row>([
            { header: 'ID', accessorKey: 'id', table: false },
            { header: 'Name', accessorKey: 'name', sortable: true },
        ]);

        expect(defs.map((def) => def.tableHeader)).toEqual(['Name']);
    });
});

describe('toListColumns', () => {
    const labels = (columns: DataColumnDef<Row>[], groups?: DataListGroupDef[]) =>
        toListColumns(columns, groups).map((group) => group.fields.map((field) => field.listLabel));

    it('uses the heading as the label', () => {
        expect(labels([{ header: 'Name', accessorKey: 'name' }])).toEqual([['Name']]);
    });

    it('lets the list name the field differently, or not at all', () => {
        expect(labels([
            { header: 'Name', accessorKey: 'name', list: { label: 'Host' } },
            { header: 'Actions', render: () => null, list: { label: null } },
        ])).toEqual([['Host', null]]);
    });

    it('renders the field as the list view', () => {
        const [{ fields }] = toListColumns<Row>([{ header: 'Name', render: (item, view) => `${item.name}/${view}` }]);

        expect(fields[0].listItemRender?.(row)).toBe('alpha/list');
    });

    it('drops a column the list does not show', () => {
        expect(labels([
            { header: 'Name', accessorKey: 'name' },
            { header: 'Size', accessorKey: 'size', list: false },
        ])).toEqual([['Name']]);
    });

    it('puts everything into one group when none are defined', () => {
        const groups = toListColumns<Row>([
            { header: 'Name', accessorKey: 'name' },
            { header: 'Size', accessorKey: 'size', list: { group: 'meta' } },
        ]);

        expect(groups).toHaveLength(1);
        expect(groups[0].fields).toHaveLength(2);
    });

    it('sorts the fields into the groups, in the order of the groups', () => {
        const groups = toListColumns<Row>(
            [
                { header: 'Actions', render: () => null, list: { group: 'actions' } },
                { header: 'Name', accessorKey: 'name', list: { group: 'content' } },
                { header: 'Size', accessorKey: 'size', list: { group: 'content' } },
            ],
            [{ id: 'content', grow: true }, { id: 'actions', className: 'md:text-right' }],
        );

        expect(groups.map((group) => group.fields.map((field) => field.listLabel))).toEqual([['Name', 'Size'], ['Actions']]);
        expect(groups[0]).toMatchObject({ grow: true });
        expect(groups[1]).toMatchObject({ columnClassName: 'md:text-right' });
    });

    it('puts a field without a group, or with an unknown one, into the first', () => {
        const groups = [{ id: 'content' }, { id: 'actions' }];

        expect(labels(
            [
                { header: 'Name', accessorKey: 'name' },
                { header: 'Size', accessorKey: 'size', list: { group: 'contnet' } },
                { header: 'Actions', render: () => null, list: { group: 'actions' } },
            ],
            groups,
        )).toEqual([['Name', 'Size'], ['Actions']]);
    });

    it('leaves out a group that received no field', () => {
        expect(labels([{ header: 'Name', accessorKey: 'name' }], [{ id: 'content' }, { id: 'actions' }]))
            .toEqual([['Name']]);
    });

    it('returns no group for no column', () => {
        expect(toListColumns<Row>([])).toEqual([]);
    });
});
