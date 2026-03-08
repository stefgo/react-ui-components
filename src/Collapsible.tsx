import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleProps {
    title: ReactNode;
    children: ReactNode;
    initiallyExpanded?: boolean;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
}

export const Collapsible = ({
    title,
    children,
    initiallyExpanded = false,
    className = "",
    headerClassName = "",
    contentClassName = ""
}: CollapsibleProps) => {
    const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

    return (
        <div className={`overflow-hidden transition-all ${className}`}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-[#252525] ${headerClassName}`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </span>
                    <div className="flex-1 overflow-hidden">{title}</div>
                </div>
            </button>
            <div
                className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                    } ${contentClassName}`}
            >
                {children}
            </div>
        </div>
    );
};
