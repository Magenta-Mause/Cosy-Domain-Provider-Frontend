import type React from "react";

interface IconProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  src: string;
  className?: string;
}

export function Icon({ src, className = "", style, ...rest }: IconProps) {
  return (
    <span
      aria-hidden={true}
      style={{
        maskImage: `url("${src}")`,
        maskRepeat: "no-repeat",
        maskSize: "contain",
        maskPosition: "center",
        WebkitMaskImage: `url("${src}")`,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        WebkitMaskPosition: "center",
        imageRendering: "pixelated",
        ...style,
      }}
      className={`inline-block shrink-0 pointer-events-none bg-current ${className}`}
      {...rest}
    />
  );
}
