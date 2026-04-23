import { useCallback, useEffect, useState } from "react";

import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";
import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import { Route } from "@/routes/verify";

type Stage = "send" | "input";

export function useVerifyLogic() {
  const { userEmail, isVerified } = useAuthInformation();
  const { token: urlToken } = Route.useSearch();
  const { verifyAccount, resendVerificationCode } = useDataInteractions();

  const [stage, setStage] = useState<Stage>("send");
  const [verificationToken, setVerificationToken] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);

  const triggerVerification = useCallback(
    async (token: string) => {
      setIsVerifying(true);
      setVerifyError(null);
      try {
        await verifyAccount(token);
      } catch {
        setVerifyError("That code didn't match. Double-check and try again.");
        setVerificationToken("");
      } finally {
        setIsVerifying(false);
      }
    },
    [verifyAccount],
  );

  useEffect(() => {
    if (urlToken && urlToken.length === 6) {
      setVerificationToken(urlToken.toUpperCase());
      setStage("input");
      void triggerVerification(urlToken);
    }
  }, [urlToken, triggerVerification]);

  const triggerSendEmail = async () => {
    setIsSending(true);
    setSendError(null);
    try {
      await resendVerificationCode();
      setStage("input");
    } catch {
      setSendError("Couldn't send the email. Please try again.");
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
      setResendError("Couldn't send a new code. Please try again later.");
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
    isBusy: isVerifying || isSending,
    triggerVerification,
    triggerSendEmail,
    triggerResend,
  };
}
