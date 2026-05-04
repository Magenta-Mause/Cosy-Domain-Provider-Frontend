import { useEffect, useRef, useState } from "react";

export function useDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    globalThis.addEventListener("mousedown", onPointerDown);
    globalThis.addEventListener("keydown", onEscape);

    return () => {
      globalThis.removeEventListener("mousedown", onPointerDown);
      globalThis.removeEventListener("keydown", onEscape);
    };
  }, [isOpen]);

  return { isOpen, setIsOpen, ref };
}
