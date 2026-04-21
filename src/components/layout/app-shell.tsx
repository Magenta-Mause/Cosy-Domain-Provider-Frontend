import { useQueryClient } from "@tanstack/react-query";
import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { LogOut, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import { setIdentityToken } from "@/api/axios-instance";
import { useLogout } from "@/api/generated/domain-provider-api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { clearIdentity } from "@/store/auth-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const navLinkClass =
  "rounded-md px-3 py-2 text-sm font-medium transition-colors";

export function AppShell() {
  const { i18n, t } = useTranslation();
  const activeLanguage = i18n.resolvedLanguage?.startsWith("fi") ? "fi" : "en";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const authenticated = useAppSelector(
    (state) => state.auth.identityToken !== null,
  );
  const username = useAppSelector((state) => state.auth.user?.username);
  const logoutMutation = useLogout({
    mutation: {
      onSettled: () => {
        setIdentityToken(null);
        dispatch(clearIdentity());
        queryClient.clear();
        void navigate({ to: "/login" });
      },
    },
  });

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="shrink-0 flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-primary" />
            {t("appName")}
          </div>
          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-2">
              <Link
                to="/"
                className={cn(
                  navLinkClass,
                  "text-muted-foreground hover:text-foreground",
                )}
                activeProps={{
                  className: cn(navLinkClass, "bg-secondary text-foreground"),
                }}
              >
                {t("nav.home")}
              </Link>
              <Link
                to="/about"
                className={cn(
                  navLinkClass,
                  "text-muted-foreground hover:text-foreground",
                )}
                activeProps={{
                  className: cn(navLinkClass, "bg-secondary text-foreground"),
                }}
              >
                {t("nav.about")}
              </Link>
              {authenticated ? (
                <Link
                  to="/dashboard"
                  className={cn(
                    navLinkClass,
                    "text-muted-foreground hover:text-foreground",
                  )}
                  activeProps={{
                    className: cn(navLinkClass, "bg-secondary text-foreground"),
                  }}
                >
                  {t("nav.dashboard")}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className={cn(
                    navLinkClass,
                    "text-muted-foreground hover:text-foreground",
                  )}
                  activeProps={{
                    className: cn(navLinkClass, "bg-secondary text-foreground"),
                  }}
                >
                  {t("nav.login")}
                </Link>
              )}
            </nav>
            <div className="hidden items-center gap-1 sm:flex">
              <span className="mr-1 text-xs text-muted-foreground">
                {t("language.label")}
              </span>
              <Button
                size="sm"
                variant={activeLanguage === "en" ? "secondary" : "outline"}
                onClick={() => {
                  void i18n.changeLanguage("en");
                }}
              >
                {t("language.en")}
              </Button>
              <Button
                size="sm"
                variant={activeLanguage === "fi" ? "secondary" : "outline"}
                onClick={() => {
                  void i18n.changeLanguage("fi");
                }}
              >
                {t("language.fi")}
              </Button>
            </div>
            {authenticated ? (
              <div className="hidden items-center gap-2 sm:flex">
                {username ? (
                  <span className="text-xs text-muted-foreground">
                    {username}
                  </span>
                ) : null}
                <Button
                  size="sm"
                  variant="outline"
                  disabled={logoutMutation.isPending}
                  onClick={() => logoutMutation.mutate()}
                >
                  <LogOut className="mr-1.5 h-3.5 w-3.5" />
                  {t("nav.logout")}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </header>
      <main className="container py-10">
        <Outlet />
      </main>
    </div>
  );
}
