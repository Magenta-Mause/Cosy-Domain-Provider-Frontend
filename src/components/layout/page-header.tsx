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
      <div style={{ padding: "20px 28px", maxWidth, margin: "0 auto" }}>
        {children}
      </div>
    </div>
  );
}
