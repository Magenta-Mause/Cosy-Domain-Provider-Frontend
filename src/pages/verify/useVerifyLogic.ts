import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";
import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import { Route } from "@/routes/verify";

type Stage = "password" | "send" | "input";

export function useVerifyLogic() {
  const { t } = useTranslation();
  const { userEmail, isVerified, needsPasswordSetup } = useAuthInformation();
  const { token: urlToken } = Route.useSearch();
  const { verifyAccount, resendVerificationCode, setupPassword } =
    useDataInteractions();
  const navigate = useNavigate();

  const [stage, setStage] = useState<Stage>(
    needsPasswordSetup ? "password" : "send",
  );
  const [verificationToken, setVerificationToken] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);

  // Password setup state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSettingPassword, setIsSettingPassword] = useState(false);

  const triggerVerification = useCallback(
    async (token: string) => {
      setIsVerifying(true);
      setVerifyError(null);
      try {
        await verifyAccount(token);
        await navigate({ to: "/mfa-setup" });
      } catch {
        setVerifyError(t("verify.codeMismatchError"));
        setVerificationToken("");
      } finally {
        setIsVerifying(false);
      }
    },
    [verifyAccount, navigate, t],
  );

  useEffect(() => {
    if (urlToken && urlToken.length === 6) {
      setVerificationToken(urlToken.toUpperCase());
      setStage("input");
      void triggerVerification(urlToken);
    }
  }, [urlToken, triggerVerification]);

  const triggerPasswordSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError(t("passwordSetup.mismatch"));
      return;
    }
    setPasswordError(null);
    setIsSettingPassword(true);
    try {
      await setupPassword(password);
      setStage("send");
    } catch {
      setPasswordError(t("passwordSetup.error"));
    } finally {
      setIsSettingPassword(false);
    }
  };

  const triggerSendEmail = async () => {
    setIsSending(true);
    setSendError(null);
    try {
      await resendVerificationCode();
      setStage("input");
    } catch {
      setSendError(t("verify.sendError"));
    } finally {
      setIsSending(false);
    }
  };

  const triggerResend = async () => {
    setIsSending(true);
    setResendSent(false);
    setResendError(null);
    try {
      await resendVerificationCode();
      setResendSent(true);
    } catch {
      setResendError(t("verify.resendError"));
    } finally {
      setIsSending(false);
    }
  };

  return {
    userEmail,
    isVerified,
    stage,
    verificationToken,
    setVerificationToken,
    isVerifying,
    isSending,
    resendSent,
    verifyError,
    setVerifyError,
    sendError,
    resendError,
    isBusy: isVerifying || isSending || isSettingPassword,
    triggerVerification,
    triggerSendEmail,
    triggerResend,
    // password stage
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    passwordError,
    isSettingPassword,
    triggerPasswordSetup,
  };
}
