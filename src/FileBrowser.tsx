import { ChevronRight, Folder, File } from 'lucide-react';
import { useEffect } from 'react';
import { Card } from './Card';
import { cn } from './utils';

export interface FsFile {
    name: string;
    isDirectory: boolean;
    path: string;
    size: number;
}

export interface FileBrowserClassNames {
    root?: string;
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
    // Sync selectedPath with currentPath on invalidation or navigation
    useEffect(() => {
        onSelect(currentPath);
    }, [currentPath]);

    const goUp = () => {
        const parts = currentPath.split('/').filter(p => p);
        parts.pop();
        onNavigate('/' + (parts.length > 0 ? parts.join('/') : ''));
    }

    const header = (
        <>
            <button onClick={goUp} className={cn("p-1.5 hover:bg-hover dark:hover:bg-hover-dark rounded-full text-text-muted dark:text-text-muted-dark transition-colors", classNames?.backButton)}>
                <ChevronRight className="rotate-180" size={18} />
            </button>
            <div className={cn("font-mono text-sm truncate font-medium", classNames?.pathDisplay)} title={currentPath}>{currentPath || '/'}</div>
        </>
    );

    return (
        <Card
            title={header}
            className={cn("flex flex-col", className, classNames?.root)}
            classNames={{ header: classNames?.header }}
        >
            <div className={cn("overflow-y-auto p-2 space-y-1 flex-1 min-h-[200px]", classNames?.content)}>
                {isLoading ? (
                    <div className={cn("text-text-muted dark:text-text-muted-dark text-xs p-4 text-center", classNames?.loading)}>Loading...</div>
                ) : (
                    (files && Array.isArray(files) ? files : []).map((file) => (
                         <div key={file.name} className={cn("flex items-center gap-2 px-2 py-1 hover:bg-hover dark:hover:bg-hover-dark rounded group", classNames?.item)}>
                            {file.isDirectory ? (
                                <button
                                    onClick={() => onNavigate(file.path)}
                                    className={cn(
                                        "flex items-center gap-2 flex-1 text-left text-info dark:text-info-dark hover:text-info-hover dark:hover:text-info-light truncate",
                                        classNames?.itemFolder
                                    )}
                                >
                                    <Folder size={16} fill="currentColor" className={cn("opacity-20", classNames?.folderIcon)} />
                                    <span className="text-sm font-medium text-text-primary dark:text-text-secondary-dark">{file.name}</span>
                                </button>
                            ) : (
                                <div className={cn("flex items-center gap-2 flex-1 text-text-muted dark:text-text-muted-dark truncate", classNames?.itemFile)}>
                                    <File size={16} className={cn(classNames?.fileIcon)} />
                                    <span className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">{file.name}</span>
                                </div>
                            )}
                        </div>
                    ))
                )}
                {!isLoading && (files && Array.isArray(files) ? files : []).length === 0 && (
                    <div className={cn("text-text-muted dark:text-text-muted-dark text-xs p-4 text-center", classNames?.empty)}>Empty directory</div>
                )}
            </div>
        </Card>
    );
};
