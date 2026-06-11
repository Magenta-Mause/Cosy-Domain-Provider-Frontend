import { useCallback } from "react";
import { setIdentityToken } from "@/api/axios-instance";
import {
  fetchToken,
  getSubdomain,
  listMySubdomains,
} from "@/api/generated/domain-provider-api";
import { checkLabelAvailability as checkLabelAvailabilityRequest } from "@/api/subdomain-api";
import { getOAuthIdentities } from "@/api/user-api";
import { parseIdentityToken } from "@/lib/jwt";
import {
  clearIdentity,
  markBootstrapped,
  setAuthState,
  setIdentity,
} from "@/store/auth-slice";
import { useAppDispatch } from "@/store/hooks";
import { setDomainCreationEnabled } from "@/store/settings-slice";
import {
  setSubdomains,
  setSubdomainsError,
  setSubdomainsState,
  upsertSubdomain,
} from "@/store/subdomains-slice";

const useDataLoading = () => {
  const dispatch = useAppDispatch();

  const loadSubdomains = useCallback(async () => {
    dispatch(setSubdomainsState("loading"));
    dispatch(setSubdomainsError(null));
    try {
      const subdomains = await listMySubdomains();
      dispatch(setSubdomains(subdomains));
      dispatch(setSubdomainsState("idle"));
      return subdomains;
    } catch {
      dispatch(setSubdomainsState("failed"));
      dispatch(setSubdomainsError("Failed to load subdomains"));
      return null;
    }
  }, [dispatch]);

  const bootstrapAuth = useCallback(async () => {
    dispatch(setAuthState("loading"));

    try {
      const res = await fetch("/api/v1/settings");
      const data = (await res.json()) as { domainCreationEnabled: boolean };
      dispatch(setDomainCreationEnabled(data.domainCreationEnabled ?? true));
    } catch {
      // defaults to enabled if unreachable
    }

    try {
      const token = await fetchToken();
      setIdentityToken(token);
      dispatch(setIdentity({ token, user: parseIdentityToken(token) }));
      await loadSubdomains();
      return true;
    } catch {
      setIdentityToken(null);
      dispatch(clearIdentity());
      dispatch(setAuthState("failed"));
      return false;
    } finally {
      dispatch(markBootstrapped());
    }
  }, [dispatch, loadSubdomains]);

  const loadSubdomainByUuid = useCallback(
    async (uuid: string) => {
      dispatch(setSubdomainsError(null));
      try {
        const subdomain = await getSubdomain(uuid);
        dispatch(upsertSubdomain(subdomain));
        dispatch(setSubdomainsState("idle"));
        return subdomain;
      } catch {
        dispatch(setSubdomainsError("Failed to load subdomain"));
        return null;
      }
    },
    [dispatch],
  );

  const checkLabelAvailability = useCallback(
    (label: string) => checkLabelAvailabilityRequest(label),
    [],
  );

  const loadOAuthIdentities = useCallback(async () => {
    try {
      return await getOAuthIdentities();
    } catch {
      return null;
    }
  }, []);

  return {
    bootstrapAuth,
    loadSubdomains,
    loadSubdomainByUuid,
    checkLabelAvailability,
    loadOAuthIdentities,
  };
};

export default useDataLoading;
