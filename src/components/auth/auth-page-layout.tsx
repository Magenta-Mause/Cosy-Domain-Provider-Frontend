import { Link, type LinkProps } from "@tanstack/react-router";

import { LanguageMenu } from "@/components/layout/language-menu";
import { UserMenu } from "@/components/layout/user-menu";
import { Panel } from "@/components/pixel/panel";
import { Scenery } from "@/components/pixel/scenery";
import { useLanguageChange } from "@/hooks/useLanguageChange/useLanguageChange";

import { useAuthPageLayoutLogic } from "./useAuthPageLayoutLogic";

interface AuthPageLayoutProps {
  children: React.ReactNode;
  maxWidth?: number;
  backButtonLink?: LinkProps["to"] | null;
}

export function AuthPageLayout({
  children,
  backButtonLink = "/",
  maxWidth = 420,
}: AuthPageLayoutProps) {
  const { handleLanguageChange } = useLanguageChange();
  const { userName, isUserLoggedIn, isLoggingOut, handleLogout, handleDelete } =
    useAuthPageLayoutLogic();

  return (
    <Scenery>
      {backButtonLink != null ? (
        <Link
          to={backButtonLink}
          data-testid="auth-back-link"
          className="pbtn ghost absolute top-6 left-7 z-[5]"
          style={{ color: "oklch(0.95 0.08 70)" }}
        >
          ← Back
        </Link>
      ) : null}
      <div className="absolute top-6 right-7 z-[5] flex items-center gap-3">
        <LanguageMenu onChangeLanguage={handleLanguageChange} />
        {isUserLoggedIn ? (
          <UserMenu
            userName={userName}
            isLoggingOut={isLoggingOut}
            restricted
            onLogout={handleLogout}
            onDelete={handleDelete}
          />
        ) : null}
      </div>
      <div className="min-h-screen flex items-center justify-center px-5 py-[60px]">
        <Panel className="p-8 w-full" style={{ maxWidth }}>
          {children}
        </Panel>
      </div>
    </Scenery>
  );
}
