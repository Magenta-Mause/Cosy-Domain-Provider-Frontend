import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";

interface PageHeaderProps {
  children: ReactNode;
  maxWidth?: number;
}

export function PageHeader({ children, maxWidth = 1200 }: PageHeaderProps) {
  return (
    <div className="sky-bg overflow-visible">
      <AppHeader />
      <div className="px-7 py-5 mx-auto" style={{ maxWidth }}>
        {children}
      </div>
    </div>
  );
}
