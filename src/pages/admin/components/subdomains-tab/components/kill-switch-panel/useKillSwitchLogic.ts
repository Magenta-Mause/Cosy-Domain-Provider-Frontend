import { useCallback, useEffect, useState } from "react";

import { adminApi } from "@/api/admin-api";

export function useKillSwitchLogic(adminKey: string) {
  const [domainCreationEnabled, setDomainCreationEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    adminApi
      .getSettings(adminKey)
      .then((s) => setDomainCreationEnabled(s.domainCreationEnabled))
      .finally(() => setIsLoading(false));
  }, [adminKey]);

  const toggle = useCallback(async () => {
    setIsToggling(true);
    try {
      const updated = await adminApi.updateSettings(adminKey, {
        domainCreationEnabled: !domainCreationEnabled,
      });
      setDomainCreationEnabled(updated.domainCreationEnabled);
    } finally {
      setIsToggling(false);
    }
  }, [adminKey, domainCreationEnabled]);

  return { domainCreationEnabled, isLoading, isToggling, toggle };
}
