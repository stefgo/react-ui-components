import { describe, it, expect } from 'vitest';
import { matchesPath } from './matchesPath';

describe('matchesPath', () => {
    it('matches the root path exactly', () => {
        expect(matchesPath('/', '/')).toBe(true);
        expect(matchesPath('/', '/clients')).toBe(false);
    });

    it('matches a path and everything below it', () => {
        expect(matchesPath('/clients', '/clients')).toBe(true);
        expect(matchesPath('/clients', '/clients/42')).toBe(true);
        expect(matchesPath('/clients', '/clientsettings')).toBe(false);
    });

    it('treats :params as single-segment wildcards', () => {
        expect(matchesPath('/client/:clientId', '/client/abc')).toBe(true);
        expect(matchesPath('/client/:clientId', '/client/abc/jobs')).toBe(true);
        expect(matchesPath('/client/:clientId', '/client')).toBe(false);
    });

    it('accepts a list of paths', () => {
        expect(matchesPath(['/', '/clients'], '/clients')).toBe(true);
        expect(matchesPath(['/', '/clients'], '/jobs')).toBe(false);
    });

    it('escapes regex metacharacters in literal segments', () => {
        expect(matchesPath('/v1.0', '/v1.0')).toBe(true);
        expect(matchesPath('/v1.0', '/v1x0')).toBe(false);
        expect(matchesPath('/a+b', '/a+b')).toBe(true);
    });

    it('reports no match when either side is missing', () => {
        expect(matchesPath(undefined, '/clients')).toBe(false);
        expect(matchesPath('/clients', undefined)).toBe(false);
    });
});
