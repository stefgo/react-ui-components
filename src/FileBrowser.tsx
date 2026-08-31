import { ChevronRight, Folder, File } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Card } from './Card';
import { cn } from './utils';

export interface FsFile {
    name: string;
    isDirectory: boolean;
    path: string;
    size: number;
}

export interface FileBrowserClassNames {
    header?: string;
    backButton?: string;
    pathDisplay?: string;
    content?: string;
    item?: string;
    itemFolder?: string;
    itemFile?: string;
    folderIcon?: string;
    fileIcon?: string;
    loading?: string;
    empty?: string;
}

interface FileBrowserProps {
    currentPath: string;
    onNavigate: (path: string) => void;
    files: FsFile[];
    isLoading: boolean;
    onSelect: (path: string) => void;
    className?: string;
    classNames?: FileBrowserClassNames;
}

export const FileBrowser = ({ currentPath, onNavigate, files, isLoading, onSelect, className, classNames }: FileBrowserProps) => {
    // Report the new path whenever navigation changes it — and only then.
    //
    // `onSelect` is deliberately not a dependency: callers pass an inline arrow,
    // which is a new value on every render, and the effect would fire on each
    // one instead of on each navigation. Reading it from a ref keeps the effect
    // keyed on the path while still calling the callback the caller has now.
    const latestOnSelect = useRef(onSelect);
    // Written in an effect rather than during render, so no ref is touched
    // while rendering. Declared first, so it has run by the time the effect
    // below fires in the same commit.
    useEffect(() => {
        latestOnSelect.current = onSelect;
    });

    useEffect(() => {
        latestOnSelect.current(currentPath);
    }, [currentPath]);

    const goUp = () => {
        const parts = currentPath.split('/').filter(p => p);
        parts.pop();
        onNavigate('/' + (parts.length > 0 ? parts.join('/') : ''));
    }

    const header = (
        <>
            <button type="button" aria-label="Go up one level" onClick={goUp} className={cn("p-1.5 hover:bg-hover rounded-full text-text-muted transition-colors", classNames?.backButton)}>
                <ChevronRight className="rotate-180" size={18} aria-hidden />
            </button>
            <div className={cn("font-mono text-sm truncate font-medium", classNames?.pathDisplay)} title={currentPath}>{currentPath || '/'}</div>
        </>
    );

    return (
        <Card
            title={header}
            className={cn("flex flex-col", className)}
            classNames={{ header: classNames?.header }}
        >
            <div className={cn("overflow-y-auto p-2 space-y-1 flex-1 min-h-[200px]", classNames?.content)}>
                {isLoading ? (
                    <div className={cn("text-text-muted text-xs p-4 text-center", classNames?.loading)}>Loading...</div>
                ) : (
                    (files && Array.isArray(files) ? files : []).map((file) => (
                         <div key={file.name} className={cn("flex items-center gap-2 px-2 py-1 hover:bg-hover rounded-sm group", classNames?.item)}>
                            {file.isDirectory ? (
                                <button
                                    type="button"
                                    onClick={() => onNavigate(file.path)}
                                    className={cn(
                                        "flex items-center gap-2 flex-1 text-left text-info hover:text-info-hover truncate",
                                        classNames?.itemFolder
                                    )}
                                >
                                    <Folder size={16} fill="currentColor" className={cn("opacity-20", classNames?.folderIcon)} />
                                    <span className="text-sm font-medium text-text-primary">{file.name}</span>
                                </button>
                            ) : (
                                <div className={cn("flex items-center gap-2 flex-1 text-text-muted truncate", classNames?.itemFile)}>
                                    <File size={16} className={cn(classNames?.fileIcon)} />
                                    <span className="text-sm font-medium text-text-secondary">{file.name}</span>
                                </div>
                            )}
                        </div>
                    ))
                )}
                {!isLoading && (files && Array.isArray(files) ? files : []).length === 0 && (
                    <div className={cn("text-text-muted text-xs p-4 text-center", classNames?.empty)}>Empty directory</div>
                )}
            </div>
        </Card>
    );
};
