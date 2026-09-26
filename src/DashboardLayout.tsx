import { ReactNode } from "react";
import { cn } from './utils';

export interface DashboardLayoutClassNames {
    main?: string;
    contentContainer?: string;
}

export interface DashboardLayoutProps {
    header: ReactNode;
    /**
     * A full-width line between the header and the page -- `ConnectionBanner`. Outside
     * the scrolling area, so it stays in view however far the page is scrolled.
     */
    banner?: ReactNode;
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
    banner,
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
            "h-screen overflow-hidden bg-app-bg text-text-primary font-sans flex flex-col transition-colors duration-slow",
            className
        )}>
            {header}
            {banner}

            <div className="flex flex-1 overflow-hidden">
                {sidebar}

                {/* Content */}
                <main
                    className={cn(
                        "flex-1 overflow-y-auto p-4 pb-20 md:pb-4",
                        mainClassName,
                        classNames?.main
                    )}
                    style={{ scrollbarGutter: "stable" }}
                >
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
