import { useMemo } from "react";
import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import { useAppSelector } from "@/store/hooks";

const useAuthInformation = () => {
  const auth = useAppSelector((state) => state.auth);
  const { logoutUser, refreshIdentityToken } = useDataInteractions();

  return useMemo(
    () => ({
      isUserLoggedIn: Boolean(auth.identityToken),
      isBootstrapped: auth.bootstrapped,
      authState: auth.state,
      logoutUser,
      refreshIdentityToken,
      userIdentityToken: auth.identityToken,
      userName: auth.user?.username ?? null,
      userEmail: auth.user?.email ?? null,
      userSubject: auth.user?.subject ?? null,
      tokenIssuedAt: auth.user?.issuedAt ?? null,
      tokenExpiresAt: auth.user?.expiresAt ?? null,
      userClaims: auth.user?.claims ?? {},
    }),
    [auth, logoutUser, refreshIdentityToken],
  );
};

export default useAuthInformation;
