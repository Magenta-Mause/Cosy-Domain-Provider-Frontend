import { useState } from "react";
import { useTranslation } from "react-i18next";

import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";

export function usePasswordSetupModalLogic() {
  const { t } = useTranslation();
  const { setupPassword } = useDataInteractions();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError(t("passwordSetup.mismatch"));
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await setupPassword(password);
    } catch {
      setError(t("passwordSetup.error"));
    } finally {
      setSubmitting(false);
    }
  }

  return {
    password,
    setPassword,
    confirm,
    setConfirm,
    showPw,
    setShowPw,
    error,
    submitting,
    handleSubmit,
  };
}
