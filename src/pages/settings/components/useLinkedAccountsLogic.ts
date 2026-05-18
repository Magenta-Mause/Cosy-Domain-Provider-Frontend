import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { customInstance } from "@/api/axios-instance";
import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import { Route } from "@/routes/settings";

type Provider = "google" | "github" | "discord";

interface LinkedIdentity {
  provider: string;
  email: string;
}

const ALL_PROVIDERS: Provider[] = ["google", "github", "discord"];

export function useLinkedAccountsLogic() {
  const { t } = useTranslation();
  const { initiateOAuthLink, unlinkOAuth } = useDataInteractions();
  const { linked, linkError } = Route.useSearch();

  const [identities, setIdentities] = useState<LinkedIdentity[]>([]);
  const [loading, setLoading] = useState(true);
  const [unlinkError, setUnlinkError] = useState<string | null>(null);
  const [unlinkingProvider, setUnlinkingProvider] = useState<string | null>(null);

  const loadIdentities = useCallback(async () => {
    try {
      const data = await customInstance<LinkedIdentity[]>({
        method: "GET",
        url: "/api/v1/user/oauth-identities",
      });
      setIdentities(data);
    } catch {
      // non-fatal — list stays empty
    } finally {
      setLoading(false);
    }
  }, []);

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
      initiateOAuthLink(provider);
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
