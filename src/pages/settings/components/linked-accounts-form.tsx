import { useTranslation } from "react-i18next";
import {
  DiscordIcon,
  GitHubIcon,
  GoogleIcon,
} from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/pixel/error-message";

import { useLinkedAccountsLogic } from "./useLinkedAccountsLogic";

type Provider = "google" | "github" | "discord";

const PROVIDER_ICONS: Record<Provider, React.ReactNode> = {
  google: <GoogleIcon />,
  github: <GitHubIcon />,
  discord: <DiscordIcon />,
};

const PROVIDER_LABELS: Record<Provider, string> = {
  google: "Google",
  github: "GitHub",
  discord: "Discord",
};

export function LinkedAccountsForm() {
  const { t } = useTranslation();
  const {
    allProviders,
    loading,
    isLinked,
    handleLink,
    handleUnlink,
    unlinkingProvider,
    unlinkError,
    justLinked,
    justLinkFailed,
  } = useLinkedAccountsLogic();

  return (
    <div className="flex flex-col gap-4">
      {justLinked && (
        <div
          data-testid="settings-link-success"
          className="text-xl text-accent-2"
        >
          {t("settings.linkedAccounts.linkSuccess")}
        </div>
      )}
      {justLinkFailed && (
        <ErrorMessage data-testid="settings-link-error">
          {t("settings.linkedAccounts.linkError")}
        </ErrorMessage>
      )}
      {unlinkError && <ErrorMessage>{unlinkError}</ErrorMessage>}

      {loading ? (
        <span className="text-sm opacity-60">
          {t("settings.linkedAccounts.loading")}
        </span>
      ) : (
        <div className="flex flex-col gap-3">
          {allProviders.map((provider) => {
            const linked = isLinked(provider);
            return (
              <div key={provider} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {PROVIDER_ICONS[provider]}
                  <span className="text-sm">{PROVIDER_LABELS[provider]}</span>
                </div>
                {linked ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    data-testid={`settings-unlink-${provider}-btn`}
                    disabled={unlinkingProvider === provider}
                    onClick={() => void handleUnlink(provider)}
                  >
                    {unlinkingProvider === provider
                      ? t("settings.linkedAccounts.unlinking")
                      : t("settings.linkedAccounts.unlink")}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    data-testid={`settings-link-${provider}-btn`}
                    onClick={() => handleLink(provider)}
                  >
                    {t("settings.linkedAccounts.link")}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
