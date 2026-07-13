import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import { Route } from "@/routes/mfa-challenge";

export function useMfaChallengeLogic() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const { token: challengeToken } = Route.useSearch();
  const { completeMfaChallenge } = useDataInteractions();

  const [totpCode, setTotpCode] = useState("");
  const [totpError, setTotpError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = useCallback(async () => {
    if (totpCode.length !== 6 || isSubmitting) return;
    setIsSubmitting(true);
    setTotpError(null);
    try {
      const identity = await completeMfaChallenge(challengeToken, totpCode);
      if (identity && "isVerified" in identity && identity.isVerified) {
        await navigate({ to: "/dashboard" });
      } else {
        await navigate({ to: "/verify" });
      }
    } catch {
      setTotpError(t("login.mfaError"));
      setTotpCode("");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    totpCode,
    isSubmitting,
    completeMfaChallenge,
    challengeToken,
    navigate,
    t,
  ]);

  useEffect(() => {
    if (totpCode.length === 6) {
      void handleConfirm();
    }
  }, [totpCode, handleConfirm]);

  return { totpCode, setTotpCode, totpError, isSubmitting, handleConfirm };
}
