import { useTranslation } from "react-i18next";
import { FormField } from "@/components/ui/form-field";
import { useStagingAuthProviderLogic } from "./useStagingAuthProviderLogic";

export function StagingAuthProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  if (import.meta.env.VITE_STAGING_AUTH_ENABLED !== "true") {
    return <>{children}</>;
  }

  return <StagingAuthGate>{children}</StagingAuthGate>;
}

function StagingAuthGate({ children }: { readonly children: React.ReactNode }) {
  const { t } = useTranslation();
  const {
    authenticated,
    checking,
    username,
    setUsername,
    password,
    setPassword,
    error,
    submitting,
    login,
  } = useStagingAuthProviderLogic();

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-radius-md border border-border bg-card p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-foreground">
            {t("stagingAuth.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("stagingAuth.description")}
          </p>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            void login();
          }}
        >
          <FormField
            id="staging-username"
            label={t("stagingAuth.username")}
            value={username}
            onChange={setUsername}
            autoComplete="username"
            required
          />
          <FormField
            id="staging-password"
            label={t("stagingAuth.password")}
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            required
            error={error ? t("stagingAuth.error") : null}
          />
          <button
            type="submit"
            className="pbutton w-full"
            disabled={submitting}
          >
            {submitting ? t("stagingAuth.submitting") : t("stagingAuth.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
