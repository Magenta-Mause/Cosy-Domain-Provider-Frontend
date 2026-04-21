import type * as React from "react";

import { cn } from "@/lib/utils";

export function Input({
  className,
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-[var(--radius-sm)] px-3 py-2 text-base text-[color:var(--foreground)]",
        "border-2 border-[color:var(--foreground)] bg-[color:var(--input-bg)]",
        "shadow-[inset_0_2px_0_var(--input-shadow),2px_2px_0_0_var(--shadow)]",
        "placeholder:text-[color:var(--foreground)]/55",
        "transition-[transform,box-shadow,border-color,background-color] duration-150",
        "focus-visible:outline-none focus-visible:border-[color:var(--accent)]",
        "focus-visible:shadow-[inset_0_2px_0_var(--input-shadow),0_0_0_2px_var(--accent),3px_3px_0_0_var(--shadow)]",
        "disabled:cursor-not-allowed disabled:opacity-60",
      className,
    )}
      {...props}
    />
  );
}
