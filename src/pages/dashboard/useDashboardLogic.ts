import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

import type { SubdomainDto } from "@/api/generated/model";
import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";
import { useAppSelector } from "@/store/hooks";

export function useDashboardLogic() {
  const navigate = useNavigate();
  const subdomains = useAppSelector(
    (state) => state.subdomains.items,
  ) as SubdomainDto[];
  const isLoading =
    useAppSelector((state) => state.subdomains.state) === "loading";
  const isError =
    useAppSelector((state) => state.subdomains.state) === "failed";
  const { isVerified, isMfaEnabled, userTier, maxSubdomainCount } =
    useAuthInformation();

  const isSlotsExhausted =
    maxSubdomainCount !== null && subdomains.length >= maxSubdomainCount;
  const domainCreationEnabled = useAppSelector(
    (state) => state.settings.domainCreationEnabled,
  );

  const handleCreateNew = useCallback(() => {
    if (isVerified && isMfaEnabled) {
      void navigate({ to: "/domain/$domainId", params: { domainId: "new" } });
    } else if (isVerified) {
      void navigate({ to: "/mfa-setup" });
    } else {
      void navigate({ to: "/verify" });
    }
  }, [navigate, isVerified, isMfaEnabled]);

  return {
    subdomains,
    isLoading,
    isError,
    isVerified: isVerified ?? false,
    isMfaEnabled,
    userTier,
    isSlotsExhausted,
    domainCreationEnabled,
    handleCreateNew,
  };
}
