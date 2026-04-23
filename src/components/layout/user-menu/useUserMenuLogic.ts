import { useDropdown } from "@/hooks/useDropdown/useDropdown";
import { getUserInitial } from "./lib";

export function useUserMenuLogic(userName?: string | null) {
  const {
    isOpen: menuOpen,
    setIsOpen: setMenuOpen,
    ref: menuRef,
  } = useDropdown();
  const initial = getUserInitial(userName);
  return { menuOpen, setMenuOpen, menuRef, initial };
}
