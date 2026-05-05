import type { ReactNode } from "react";

export function Scenery({ children }: { readonly children: ReactNode }) {
  return (
    <div className="sky-bg min-h-screen relative overflow-hidden">
      <div
        className="absolute rounded-full"
        style={{
          right: "8%",
          top: "6%",
          width: 72,
          height: 72,
          background: "oklch(0.95 0.03 80)",
          boxShadow:
            "0 0 0 4px oklch(0.3 0.02 260), 0 0 40px oklch(0.95 0.03 80 / 0.4)",
        }}
        aria-hidden
      />
      <div
        className="absolute opacity-[0.85]"
        style={{
          left: "12%",
          top: "18%",
          color: "oklch(0.95 0.02 240)",
        }}
        aria-hidden
      >
        <div
          style={{
            width: 100,
            height: 18,
            background: "currentColor",
            borderRadius: 10,
          }}
        />
        <div
          style={{
            width: 70,
            height: 14,
            background: "currentColor",
            borderRadius: 10,
            marginTop: -6,
            marginLeft: 12,
          }}
        />
      </div>
      {children}
    </div>
  );
}
