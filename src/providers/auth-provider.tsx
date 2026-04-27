import { useEffect, useState } from "react";
import { PasswordSetupModal } from "@/components/auth/password-setup-modal";
import useDataLoading from "@/hooks/useDataLoading/useDataLoading";
import { useAppSelector } from "@/store/hooks";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { bootstrapAuth } = useDataLoading();
  const bootstrapped = useAppSelector((state) => state.auth.bootstrapped);
  const needsPasswordSetup = useAppSelector(
    (state) => state.auth.user?.needsPasswordSetup === true,
  );
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await bootstrapAuth();
      if (cancelled) return;
    })();

    return () => {
      cancelled = true;
    };
  }, [bootstrapAuth]);

  if (!bootstrapped) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <>
      {children}
      {needsPasswordSetup && !dismissed ? (
        <PasswordSetupModal onDismiss={() => setDismissed(true)} />
      ) : null}
    </>
  );
}
