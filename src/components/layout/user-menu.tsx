import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type UserMenuProps = {
  userName?: string | null;
  isLoggingOut: boolean;
  onLogout: () => Promise<void>;
};

export function UserMenu({ userName, isLoggingOut, onLogout }: UserMenuProps) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const initial = userName?.[0]?.toUpperCase() ?? "?";

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target)) {
        setMenuOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onEscape);

    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, [menuOpen]);

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        type="button"
        className="pbtn sm secondary"
        disabled={isLoggingOut}
        onClick={() => setMenuOpen((open) => !open)}
        style={{ gap: 8 }}
        title={t("nav.userMenu")}
      >
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: 2,
            background: "var(--accent)",
            border: "2px solid var(--foreground)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            color: "var(--btn-primary)",
            fontFamily: "'Press Start 2P', monospace",
          }}
        >
          {initial}
        </span>
        {userName ?? t("nav.userMenu")}
      </button>
      {menuOpen ? (
        <div
          role="menu"
          aria-label={t("nav.userMenu")}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            minWidth: 220,
            background: "var(--btn-secondary)",
            border: "2px solid var(--foreground)",
            borderRadius: "var(--radius-sm)",
            boxShadow: "4px 4px 0 0 var(--foreground)",
            padding: 8,
            display: "grid",
            gap: 6,
            zIndex: 30,
          }}
        >
          <button
            type="button"
            className="pbtn sm ghost"
            style={{ justifyContent: "flex-start" }}
            title={t("nav.notImplemented")}
            onClick={() => setMenuOpen(false)}
          >
            {t("nav.changeUsername")}
          </button>
          <button
            type="button"
            className="pbtn sm ghost"
            style={{
              justifyContent: "flex-start",
              opacity: 0.5,
              cursor: "not-allowed",
            }}
            title={t("nav.notImplemented")}
            disabled
          >
            {t("nav.changePassword")}
          </button>
          <button
            type="button"
            className="pbtn sm ghost"
            style={{ justifyContent: "flex-start" }}
            disabled={isLoggingOut}
            onClick={async () => {
              try {
                await onLogout();
              } finally {
                setMenuOpen(false);
              }
            }}
          >
            {t("nav.logout")}
          </button>
          <button
            type="button"
            className="pbtn sm ghost"
            style={{
              justifyContent: "flex-start",
              color: "var(--destructive)",
            }}
            title={t("nav.notImplemented")}
            onClick={() => setMenuOpen(false)}
          >
            {t("nav.deleteUser")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
