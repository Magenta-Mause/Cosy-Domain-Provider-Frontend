import { useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { LinkedIdentity } from "@/api/user-api";
import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import useDataLoading from "@/hooks/useDataLoading/useDataLoading";

type Provider = "google" | "github" | "discord";

const ALL_PROVIDERS: Provider[] = ["google", "github", "discord"];

export function useLinkedAccountsLogic() {
  const { t } = useTranslation();
  const { initiateOAuthLink, unlinkOAuth } = useDataInteractions();
  const { loadOAuthIdentities } = useDataLoading();
  const { linked, linkError } = useSearch({ from: "/settings" });

  const [identities, setIdentities] = useState<LinkedIdentity[]>([]);
  const [loading, setLoading] = useState(true);
  const [unlinkError, setUnlinkError] = useState<string | null>(null);
  const [unlinkingProvider, setUnlinkingProvider] = useState<string | null>(
    null,
  );

  const loadIdentities = useCallback(async () => {
    const data = await loadOAuthIdentities();
    // a failed load is non-fatal — the list stays empty
    if (data) setIdentities(data);
    setLoading(false);
  }, [loadOAuthIdentities]);

  useEffect(() => {
    void loadIdentities();
  }, [loadIdentities]);

  const isLinked = useCallback(
    (provider: Provider) => identities.some((i) => i.provider === provider),
    [identities],
  );

  const handleUnlink = useCallback(
    async (provider: Provider) => {
      setUnlinkError(null);
      setUnlinkingProvider(provider);
      try {
        await unlinkOAuth(provider);
        setIdentities((prev) => prev.filter((i) => i.provider !== provider));
      } catch {
        setUnlinkError(t("settings.linkedAccounts.unlinkError"));
      } finally {
        setUnlinkingProvider(null);
      }
    },
    [unlinkOAuth, t],
  );

  const handleLink = useCallback(
    (provider: Provider) => {
      void initiateOAuthLink(provider);
    },
    [initiateOAuthLink],
  );

  return {
    allProviders: ALL_PROVIDERS,
    identities,
    loading,
    isLinked,
    handleLink,
    handleUnlink,
    unlinkingProvider,
    unlinkError,
    justLinked: linked === true,
    justLinkFailed: linkError === true,
  };
}
