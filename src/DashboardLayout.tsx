import { ReactNode } from "react";
import { cn } from './utils';

export interface DashboardLayoutClassNames {
    root?: string;
    main?: string;
    contentContainer?: string;
}

interface DashboardLayoutProps {
    header: ReactNode;
    sidebar: ReactNode;
    bottomNav?: ReactNode;
    children: ReactNode;
    className?: string;
    mainClassName?: string;
    contentContainerClassName?: string;
    classNames?: DashboardLayoutClassNames;
}

export const DashboardLayout = ({
    header,
    sidebar,
    bottomNav,
    children,
    className = "",
    mainClassName = "",
    contentContainerClassName = "",
    classNames
}: DashboardLayoutProps) => {
    return (
        <div className={cn(
            "min-h-screen bg-app-bg dark:bg-app-bg-dark text-text-primary dark:text-text-primary-dark font-sans flex flex-col transition-colors duration-300",
            className,
            classNames?.root
        )}>
            {header}

            <div className="flex flex-1 overflow-hidden">
                {sidebar}

                {/* Content */}
                <main className={cn(
                    "flex-1 overflow-y-auto p-4 pb-20 md:pb-4",
                    mainClassName,
                    classNames?.main
                )}>
                    <div className={cn(
                        "max-w-7xl mx-auto space-y-6",
                        contentContainerClassName,
                        classNames?.contentContainer
                    )}>
                        {children}
                    </div>
                </main>
            </div>

            {bottomNav}
        </div>
    );
};
