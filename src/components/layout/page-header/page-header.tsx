import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";

interface PageHeaderProps {
  readonly children: ReactNode;
  readonly maxWidth?: number;
  readonly headerRightSlot?: ReactNode;
  readonly headerLogoLinkTo?: "/dashboard" | "/" | "/admin/subdomains";
}

export function PageHeader({
  children,
  maxWidth = 1200,
  headerRightSlot,
  headerLogoLinkTo,
}: PageHeaderProps) {
  return (
    <div className="sky-bg overflow-visible">
      <AppHeader rightSlot={headerRightSlot} logoLinkTo={headerLogoLinkTo} />
      <div className="px-4 sm:px-7 py-5 mx-auto" style={{ maxWidth }}>
        {children}
      </div>
    </div>
  );
}
