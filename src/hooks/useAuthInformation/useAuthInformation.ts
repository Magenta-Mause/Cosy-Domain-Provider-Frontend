import { useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import { useAppSelector } from "@/store/hooks";

const useAuthInformation = () => {
  const auth = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const {
    logoutUser,
    refreshIdentityToken,
    updateUser,
    deleteUser: deleteUserInteraction,
  } = useDataInteractions();

  const deleteUser = useCallback(async () => {
    await deleteUserInteraction();
    await logoutUser();
    navigate({ to: "/" });
  }, [deleteUserInteraction, logoutUser, navigate]);

  return useMemo(
    () => ({
      isUserLoggedIn: Boolean(auth.identityToken),
      isBootstrapped: auth.bootstrapped,
      authState: auth.state,
      logoutUser,
      refreshIdentityToken,
      updateUser,
      deleteUser,
      userIdentityToken: auth.identityToken,
      userName: auth.user?.username ?? null,
      userEmail: auth.user?.email ?? null,
      isVerified: auth.user?.isVerified ?? null,
      userTier: auth.user?.tier ?? null,
      maxSubdomainCount: auth.user?.maxSubdomainCount ?? null,
      userSubject: auth.user?.subject ?? null,
      tokenIssuedAt: auth.user?.issuedAt ?? null,
      tokenExpiresAt: auth.user?.expiresAt ?? null,
      userClaims: auth.user?.claims ?? {},
    }),
    [auth, logoutUser, refreshIdentityToken, updateUser, deleteUser],
  );
};

export default useAuthInformation;
