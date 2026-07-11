import type { ReactNode } from "react";

interface DetailFieldProps {
  readonly label: string;
  readonly children: ReactNode;
}

export function DetailField({ label, children }: DetailFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-[10px] opacity-50 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-base">{children}</div>
    </div>
  );
}
