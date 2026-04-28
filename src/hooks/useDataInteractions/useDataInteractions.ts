import { useCallback } from "react";
import { customInstance, setIdentityToken } from "@/api/axios-instance";
import { getBillingPortalUrl, getCheckoutUrl } from "@/api/billing-api";
import {
  createSubdomain,
  deleteSubdomain,
  deleteUser,
  fetchToken,
  forgotPassword,
  logout,
  resendVerification,
  resetPassword,
  updateSubdomain,
  updateUser,
  verifyEmail,
} from "@/api/generated/domain-provider-api";
import type {
  SubdomainCreationDto,
  SubdomainUpdateDto,
  UpdateUserDto,
} from "@/api/generated/model";
import useDataLoading from "@/hooks/useDataLoading/useDataLoading.ts";
import { parseIdentityToken } from "@/lib/jwt";
import {
  clearIdentity,
  clearPasswordSetup,
  setAuthState,
  setIdentity,
} from "@/store/auth-slice";
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
      const parsedToken = parseIdentityToken(token);
      dispatch(setIdentity({ token, user: parsedToken }));
      await loadSubdomains();
      return parsedToken;
    } catch {
      setIdentityToken(null);
      dispatch(clearIdentity());
      throw new Error("Unable to refresh identity token");
    }
  }, [dispatch, loadSubdomains]);

  const loginUser = useCallback(
    async (credentials: {
      email: string;
      password: string;
      captchaToken: string;
    }) => {
      dispatch(setAuthState("loading"));
      try {
        const response = await customInstance<{
          mfaRequired?: boolean;
          challengeToken?: string;
        }>({
          method: "POST",
          url: "/api/v1/auth/login",
          data: credentials,
        });
        if (response?.mfaRequired && response.challengeToken) {
          dispatch(setAuthState("idle"));
          return { mfaRequired: true as const, challengeToken: response.challengeToken };
        }
        const parsedToken = await refreshIdentityToken();
        dispatch(setAuthState("idle"));
        return parsedToken;
      } catch (error) {
        dispatch(setAuthState("failed"));
        throw error;
      }
    },
    [dispatch, refreshIdentityToken],
  );

  const registerUser = useCallback(
    async (payload: {
      username: string;
      email: string;
      password: string;
      captchaToken: string;
    }) => {
      dispatch(setAuthState("loading"));
      try {
        await customInstance({
          method: "POST",
          url: "/api/v1/auth/register",
          data: payload,
        });
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

  const initiateOAuth = useCallback(
    (provider: "google" | "github" | "discord") => {
      window.location.href = `/api/v1/auth/oauth/${provider}/authorize`;
    },
    [],
  );

  const setupPassword = useCallback(
    async (password: string) => {
      await customInstance({
        method: "POST",
        url: "/api/v1/auth/set-password",
        data: { password },
      });
      await refreshIdentityToken();
      dispatch(clearPasswordSetup());
    },
    [dispatch, refreshIdentityToken],
  );

  const updateUserInteraction = useCallback(
    async (dto: UpdateUserDto) => {
      await updateUser(dto);
      await refreshIdentityToken();
    },
    [refreshIdentityToken],
  );

  const deleteUserInteraction = useCallback(async () => {
    await deleteUser();
  }, []);

  const openBillingPortal = useCallback(async () => {
    const { url } = await getBillingPortalUrl();
    window.location.href = url;
  }, []);

  const openCheckout = useCallback(async () => {
    const { url } = await getCheckoutUrl();
    window.location.href = url;
  }, []);

  const setupMfa = useCallback(
    async (): Promise<{ totpUri: string; secret: string }> => {
      return await customInstance({ method: "POST", url: "/api/v1/auth/mfa/setup" });
    },
    [],
  );

  const confirmMfa = useCallback(
    async (totpCode: string) => {
      await customInstance({
        method: "POST",
        url: "/api/v1/auth/mfa/confirm",
        data: { totpCode },
      });
      await refreshIdentityToken();
    },
    [refreshIdentityToken],
  );

  const completeMfaChallenge = useCallback(
    async (challengeToken: string, totpCode: string) => {
      await customInstance({
        method: "POST",
        url: "/api/v1/auth/mfa/challenge",
        data: { challengeToken, totpCode },
      });
      return await refreshIdentityToken();
    },
    [refreshIdentityToken],
  );

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
    initiateOAuth,
    setupPassword,
    updateUser: updateUserInteraction,
    deleteUser: deleteUserInteraction,
    openBillingPortal,
    openCheckout,
    setupMfa,
    confirmMfa,
    completeMfaChallenge,
  };
};

export default useDataInteractions;
