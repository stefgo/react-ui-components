import { describe, expect, it } from 'vitest';
import { selectAllState, toggleAll, toggleKey } from './selection';

describe('toggleKey', () => {
    it('adds a key and takes it out again, leaving the original alone', () => {
        const before = new Set(['a']);
        expect([...toggleKey(before, 'b')]).toEqual(['a', 'b']);
        expect([...toggleKey(before, 'a')]).toEqual([]);
        expect([...before]).toEqual(['a']);
    });
});

describe('selectAllState', () => {
    it('tells all, some and none apart', () => {
        expect(selectAllState(['a', 'b'], new Set(['a', 'b']))).toBe('all');
        expect(selectAllState(['a', 'b'], new Set(['a']))).toBe('some');
        expect(selectAllState(['a', 'b'], new Set())).toBe('none');
    });

    it('is none when there is nothing to pick', () => {
        expect(selectAllState([], new Set(['a']))).toBe('none');
    });

    it('does not count a selected key that is not a candidate', () => {
        expect(selectAllState(['a'], new Set(['a', 'hidden']))).toBe('all');
        expect(selectAllState(['a'], new Set(['hidden']))).toBe('none');
    });
});

describe('toggleAll', () => {
    it('picks every candidate from none and from some', () => {
        expect([...toggleAll(new Set(), ['a', 'b'])]).toEqual(['a', 'b']);
        expect([...toggleAll(new Set(['b']), ['a', 'b'])].sort()).toEqual(['a', 'b']);
    });

    it('clears the candidates once all are picked', () => {
        expect([...toggleAll(new Set(['a', 'b']), ['a', 'b'])]).toEqual([]);
    });

    it('leaves a key it cannot see as it is', () => {
        expect([...toggleAll(new Set(['hidden']), ['a'])].sort()).toEqual(['a', 'hidden']);
        expect([...toggleAll(new Set(['a', 'hidden']), ['a'])]).toEqual(['hidden']);
    });
});
