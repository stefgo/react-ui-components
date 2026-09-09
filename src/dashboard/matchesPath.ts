/**
 * Matching a declared page path against the current location — used only to
 * decide which navigation entry is highlighted. Routing itself belongs to the
 * consumer's router.
 */

const cache = new Map<string, RegExp>();

const escapeSegment = (segment: string) => segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Turns `/client/:clientId` into `^/client/[^/]+(/|$)`. Segments starting with
 * `:` become wildcards; everything else is escaped, so a literal dot in a path
 * matches a dot and not any character.
 */
export const pathPatternToRegExp = (pattern: string): RegExp => {
    const cached = cache.get(pattern);
    if (cached) return cached;

    const source = pattern
        .split('/')
        .map(segment => (segment.startsWith(':') ? '[^/]+' : escapeSegment(segment)))
        .join('/');

    const regExp = new RegExp(`^${source}(/|$)`);
    cache.set(pattern, regExp);
    return regExp;
};

export const matchesPath = (
    pagePath: string | string[] | undefined,
    currentPath: string | undefined
): boolean => {
    if (!pagePath || !currentPath) return false;

    const paths = Array.isArray(pagePath) ? pagePath : [pagePath];
    return paths.some(p => {
        // "/" would otherwise prefix-match every path.
        if (p === '/') return currentPath === '/';
        return pathPatternToRegExp(p).test(currentPath);
    });
};
