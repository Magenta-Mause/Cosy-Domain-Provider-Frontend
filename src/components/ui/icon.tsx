import type React from "react";

interface IconProps
  extends Readonly<Omit<React.HTMLAttributes<HTMLSpanElement>, "children">> {
  readonly src: string;
  readonly className?: string;
}

export function Icon({
  src,
  className = "",
  style,
  ...rest
}: Readonly<IconProps>) {
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
