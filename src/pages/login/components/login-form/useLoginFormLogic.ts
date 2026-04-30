import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import { isValidEmail } from "@/lib/validators";
import { Route } from "@/routes/login";
import { useAppSelector } from "@/store/hooks";

export function useLoginFormLogic() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loginUser, completeMfaChallenge } = useDataInteractions();
  const authState = useAppSelector((state) => state.auth.state);
  const { oauthError } = Route.useSearch();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [challengeToken, setChallengeToken] = useState<string | null>(null);
  const [totpCode, setTotpCodeRaw] = useState("");
  const setTotpCode = (value: string) => setTotpCodeRaw(value.toUpperCase());
  const [totpError, setTotpError] = useState<string | null>(null);

  const submitting = authState === "loading";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 1) {
      if (!isValidEmail(email)) {
        setEmailError(t("login.emailInvalid"));
        return;
      }
      setEmailError(null);
      setPassword("");
      setStep(2);
      return;
    }
    if (!captchaToken) {
      setErrorMessage(t("login.captchaError"));
      return;
    }
    setErrorMessage(null);
    try {
      const result = await loginUser({ email, password, captchaToken });
      if (result && "mfaRequired" in result) {
        setChallengeToken(result.challengeToken);
        setStep(3);
        return;
      }
      if (result && "isVerified" in result && result.isVerified) {
        await navigate({ to: "/dashboard" });
      } else {
        await navigate({ to: "/verify" });
      }
    } catch {
      setErrorMessage(t("login.error"));
      turnstileRef.current?.reset();
      setCaptchaToken(null);
    }
  }

  const handleTotpSubmit = useCallback(async () => {
    if (!challengeToken || totpCode.length !== 6) return;
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
    }
  }, [challengeToken, totpCode, completeMfaChallenge, navigate, t]);

  useEffect(() => {
    if (totpCode.length === 6 && step === 3) {
      void handleTotpSubmit();
    }
  }, [totpCode, step, handleTotpSubmit]);

  function goBack() {
    setStep(1);
    setPassword("");
    setEmailError(null);
    setErrorMessage(null);
    setCaptchaToken(null);
    setChallengeToken(null);
    setTotpCode("");
    setTotpError(null);
  }

  return {
    step,
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    errorMessage,
    oauthError: oauthError === true,
    submitting,
    captchaReady: !!captchaToken,
    handleSubmit,
    goBack,
    turnstileRef,
    setCaptchaToken,
    totpCode,
    setTotpCode,
    totpError,
    handleTotpSubmit,
  };
}
