import { useEffect } from "react";
import { setIdentityToken } from "@/api/axios-instance";
import { fetchToken } from "@/api/generated/domain-provider-api";
import { parseIdentityToken } from "@/lib/jwt";
import {
  clearIdentity,
  markBootstrapped,
  setIdentity,
} from "@/store/auth-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const bootstrapped = useAppSelector((state) => state.auth.bootstrapped);

  useEffect(() => {
    let cancelled = false;
    void fetchToken()
      .then((token) => {
        if (cancelled) return;
        setIdentityToken(token);
        dispatch(setIdentity({ token, user: parseIdentityToken(token) }));
      })
      .catch(() => {
        if (cancelled) return;
        setIdentityToken(null);
        dispatch(clearIdentity());
      })
      .finally(() => {
        if (cancelled) return;
        dispatch(markBootstrapped());
      });
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  if (!bootstrapped) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
