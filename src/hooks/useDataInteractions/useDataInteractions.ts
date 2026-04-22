import { useCallback } from "react";
import { setIdentityToken } from "@/api/axios-instance";
import { getBillingPortalUrl } from "@/api/billing-api";
import {
  createSubdomain,
  deleteSubdomain,
  fetchToken,
  forgotPassword,
  login,
  logout,
  register,
  resendVerification,
  resetPassword,
  updateSubdomain,
  verifyEmail,
} from "@/api/generated/domain-provider-api";
import type {
  LoginDto,
  SubdomainCreationDto,
  SubdomainUpdateDto,
} from "@/api/generated/model";
import useDataLoading from "@/hooks/useDataLoading/useDataLoading.ts";
import { parseIdentityToken } from "@/lib/jwt";
import { clearIdentity, setAuthState, setIdentity } from "@/store/auth-slice";
import { useAppDispatch } from "@/store/hooks";
import {
  clearSubdomains,
  removeSubdomain,
  setSubdomainsError,
  upsertSubdomain,
} from "@/store/subdomains-slice";

const useDataInteractions = () => {
  const dispatch = useAppDispatch();
  const { loadSubdomains } = useDataLoading();

  const refreshIdentityToken = useCallback(async () => {
    try {
      const token = await fetchToken();
      setIdentityToken(token);
      dispatch(setIdentity({ token, user: parseIdentityToken(token) }));
      await loadSubdomains();
      return token;
    } catch {
      setIdentityToken(null);
      dispatch(clearIdentity());
      throw new Error("Unable to refresh identity token");
    }
  }, [dispatch, loadSubdomains]);

  const loginUser = useCallback(
    async (credentials: LoginDto) => {
      dispatch(setAuthState("loading"));
      try {
        await login(credentials);
        await refreshIdentityToken();
        dispatch(setAuthState("idle"));
      } catch (error) {
        dispatch(setAuthState("failed"));
        throw error;
      }
    },
    [dispatch, refreshIdentityToken],
  );

  const registerUser = useCallback(
    async (payload: { username: string; email: string; password: string }) => {
      dispatch(setAuthState("loading"));
      try {
        await register(payload);
        await refreshIdentityToken();
        dispatch(setAuthState("idle"));
      } catch (error) {
        dispatch(setAuthState("failed"));
        throw error;
      }
    },
    [dispatch, refreshIdentityToken],
  );

  const logoutUser = useCallback(async () => {
    try {
      await logout();
    } finally {
      setIdentityToken(null);
      dispatch(clearIdentity());
      dispatch(clearSubdomains());
    }
  }, [dispatch]);

  const createSubdomainInteraction = useCallback(
    async (payload: SubdomainCreationDto) => {
      dispatch(setSubdomainsError(null));
      const created = await createSubdomain(payload);
      dispatch(upsertSubdomain(created));
      return created;
    },
    [dispatch],
  );

  const deleteSubdomainInteraction = useCallback(
    async (uuid: string) => {
      dispatch(setSubdomainsError(null));
      try {
        await deleteSubdomain(uuid);
        dispatch(removeSubdomain(uuid));
      } catch (error) {
        dispatch(setSubdomainsError("Failed to delete subdomain"));
        throw error;
      }
    },
    [dispatch],
  );

  const updateSubdomainInteraction = useCallback(
    async (uuid: string, payload: SubdomainUpdateDto) => {
      dispatch(setSubdomainsError(null));
      try {
        const updated = await updateSubdomain(uuid, payload);
        dispatch(upsertSubdomain(updated));
        return updated;
      } catch (error) {
        dispatch(setSubdomainsError("Failed to update subdomain"));
        throw error;
      }
    },
    [dispatch],
  );

  const verifyAccount = useCallback(
    async (code: string) => {
      try {
        await verifyEmail({ token: code });
        await refreshIdentityToken();
      } catch (error) {
        console.error(error);
        throw new Error("Verification Failed");
      }
    },
    [refreshIdentityToken],
  );

  const resendVerificationCode = useCallback(async () => {
    await resendVerification();
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    await forgotPassword({ email });
  }, []);

  const confirmPasswordReset = useCallback(
    async (token: string, newPassword: string) => {
      await resetPassword({ token, newPassword });
    },
    [],
  );

  const openBillingPortal = useCallback(async () => {
    const { url } = await getBillingPortalUrl();
    window.location.href = url;
  }, []);

  return {
    refreshIdentityToken,
    loginUser,
    registerUser,
    logoutUser,
    verifyAccount,
    resendVerificationCode,
    requestPasswordReset,
    confirmPasswordReset,
    createSubdomain: createSubdomainInteraction,
    updateSubdomain: updateSubdomainInteraction,
    deleteSubdomain: deleteSubdomainInteraction,
    openBillingPortal,
  };
};

export default useDataInteractions;
