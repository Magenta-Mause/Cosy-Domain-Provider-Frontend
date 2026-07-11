import { Link, type LinkProps } from "@tanstack/react-router";
import cosyIcon from "@/assets/cosy-logo.webp";

interface CosyLogoProps {
  readonly linkTo?: LinkProps["to"];
  readonly testId?: string;
}

const inner = (
  <>
    <img src={cosyIcon} alt="Cosy" className="h-12" />
    <div className="text-left pt-[3px]">
      <div className="pixel text-base" style={{ color: "oklch(0.95 0.05 70)" }}>
        COSY
      </div>
      <div
        className="text-sm mt-0.5 opacity-[0.85]"
        style={{ color: "oklch(0.92 0.04 60)" }}
      >
        Domain Provider
      </div>
    </div>
  </>
);

export function CosyLogo({ linkTo, testId }: CosyLogoProps) {
  if (!linkTo) {
    return <div className="flex items-center gap-2.5">{inner}</div>;
  }

  return (
    <Link
      to={linkTo}
      data-testid={testId}
      className="flex items-center gap-2.5 no-underline! hover:no-underline"
    >
      {inner}
    </Link>
  );
}
