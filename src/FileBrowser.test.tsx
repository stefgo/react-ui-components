import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { FileBrowser, type FsFile } from './FileBrowser';

const files: FsFile[] = [
    { name: 'etc', isDirectory: true, path: '/etc', size: 0 },
    { name: 'notes.txt', isDirectory: false, path: '/notes.txt', size: 12 },
];

describe('FileBrowser', () => {
    it('reports the path once per navigation, not once per render', () => {
        const onSelect = vi.fn();
        const view = render(
            <FileBrowser
                currentPath="/"
                onNavigate={vi.fn()}
                files={files}
                isLoading={false}
                onSelect={onSelect}
            />
        );

        expect(onSelect).toHaveBeenCalledTimes(1);
        expect(onSelect).toHaveBeenLastCalledWith('/');

        // A re-render with a fresh inline callback — what every caller does.
        // The effect is keyed on the path, so this must not report anything.
        view.rerender(
            <FileBrowser
                currentPath="/"
                onNavigate={vi.fn()}
                files={files}
                isLoading={false}
                onSelect={(path) => onSelect(path)}
            />
        );

        expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it('calls the callback the caller has now, not the one it started with', () => {
        const first = vi.fn();
        const second = vi.fn();
        const view = render(
            <FileBrowser currentPath="/" onNavigate={vi.fn()} files={files} isLoading={false} onSelect={first} />
        );
        first.mockClear();

        view.rerender(
            <FileBrowser currentPath="/etc" onNavigate={vi.fn()} files={files} isLoading={false} onSelect={second} />
        );

        // The stale-closure trap: a ref written during the same commit must
        // already hold `second` when the path effect runs.
        expect(second).toHaveBeenCalledWith('/etc');
        expect(first).not.toHaveBeenCalled();
    });
});
