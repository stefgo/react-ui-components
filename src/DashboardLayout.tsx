import { ReactNode } from "react";

interface DashboardLayoutProps {
    header: ReactNode;
    sidebar: ReactNode;
    bottomNav?: ReactNode;
    children: ReactNode;
    className?: string;
    mainClassName?: string;
    contentContainerClassName?: string;
}

export const DashboardLayout = ({
    header,
    sidebar,
    bottomNav,
    children,
    className = "",
    mainClassName = "",
    contentContainerClassName = ""
}: DashboardLayoutProps) => {
    return (
        <div className={`min-h-screen bg-gray-100 dark:bg-[#111] text-gray-900 dark:text-[#e0e0e0] font-sans flex flex-col transition-colors duration-300 ${className}`}>
            {header}

            <div className="flex flex-1 overflow-hidden">
                {sidebar}

                {/* Content */}
                <main className={`flex-1 overflow-y-auto p-4 pb-20 md:pb-4 ${mainClassName}`}>
                    <div className={`max-w-7xl mx-auto space-y-6 ${contentContainerClassName}`}>
                        {children}
                    </div>
                </main>
            </div>

            {bottomNav}
        </div>
    );
};
