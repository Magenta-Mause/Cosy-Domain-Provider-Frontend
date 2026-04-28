import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";

export function useMfaSetupLogic() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setupMfa, confirmMfa } = useDataInteractions();

  const [totpUri, setTotpUri] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const triggerSetup = useCallback(async () => {
    setIsLoading(true);
    setSetupError(null);
    try {
      const data = await setupMfa();
      setTotpUri(data.totpUri);
      setSecret(data.secret);
    } catch {
      setSetupError(t("mfaSetup.setupError"));
    } finally {
      setIsLoading(false);
    }
  }, [setupMfa, t]);

  useEffect(() => {
    void triggerSetup();
  }, [triggerSetup]);

  const handleConfirm = useCallback(async () => {
    if (totpCode.length !== 6 || isConfirming) return;
    setIsConfirming(true);
    setConfirmError(null);
    try {
      await confirmMfa(totpCode);
      await navigate({ to: "/dashboard" });
    } catch {
      setConfirmError(t("mfaSetup.confirmError"));
      setTotpCode("");
    } finally {
      setIsConfirming(false);
    }
  }, [totpCode, isConfirming, confirmMfa, navigate, t]);

  useEffect(() => {
    if (totpCode.length === 6) {
      void handleConfirm();
    }
  }, [totpCode, handleConfirm]);

  return {
    totpUri,
    secret,
    totpCode,
    setTotpCode,
    isLoading,
    isConfirming,
    setupError,
    confirmError,
    handleConfirm,
  };
}
