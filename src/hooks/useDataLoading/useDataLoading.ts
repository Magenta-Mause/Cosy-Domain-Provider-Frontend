import { useCallback } from "react";
import { setIdentityToken } from "@/api/axios-instance";
import {
  fetchToken,
  getSubdomain,
  listMySubdomains,
} from "@/api/generated/domain-provider-api";
import { parseIdentityToken } from "@/lib/jwt";
import {
  clearIdentity,
  markBootstrapped,
  setAuthState,
  setIdentity,
} from "@/store/auth-slice";
import {
  setSubdomains,
  setSubdomainsError,
  setSubdomainsState,
  upsertSubdomain,
} from "@/store/subdomains-slice";
import { useAppDispatch } from "@/store/hooks";

const useDataLoading = () => {
  const dispatch = useAppDispatch();

  const bootstrapAuth = useCallback(async () => {
    dispatch(setAuthState("loading"));
    try {
      const token = await fetchToken();
      setIdentityToken(token);
      dispatch(setIdentity({ token, user: parseIdentityToken(token) }));
      return true;
    } catch {
      setIdentityToken(null);
      dispatch(clearIdentity());
      dispatch(setAuthState("failed"));
      return false;
    } finally {
      dispatch(markBootstrapped());
    }
  }, [dispatch]);

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

  return {
    bootstrapAuth,
    loadSubdomains,
    loadSubdomainByUuid,
  };
};

export default useDataLoading;
