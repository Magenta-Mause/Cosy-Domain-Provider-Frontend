import { useEffect } from "react";
import useDataLoading from "@/hooks/useDataLoading/useDataLoading";
import { useAppSelector } from "@/store/hooks";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { bootstrapAuth } = useDataLoading();
  const bootstrapped = useAppSelector((state) => state.auth.bootstrapped);

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

  return <>{children}</>;
}
