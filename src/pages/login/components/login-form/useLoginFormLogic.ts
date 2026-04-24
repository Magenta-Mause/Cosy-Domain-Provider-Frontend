import { useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import { Route } from "@/routes/login";
import { useAppSelector } from "@/store/hooks";

export function useLoginFormLogic() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loginUser } = useDataInteractions();
  const authState = useAppSelector((state) => state.auth.state);
  const { oauthError } = Route.useSearch();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const submitting = authState === "loading";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    if (!captchaToken) {
      setErrorMessage(t("login.captchaError"));
      return;
    }
    setErrorMessage(null);
    try {
      const identityToken = await loginUser({ email, password, captchaToken });
      if (identityToken?.isVerified) {
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

  function goBack() {
    setStep(1);
    setPassword("");
    setErrorMessage(null);
    setCaptchaToken(null);
  }

  return {
    step,
    email,
    setEmail,
    password,
    setPassword,
    showPw,
    setShowPw,
    errorMessage,
    oauthError: oauthError === true,
    submitting,
    handleSubmit,
    goBack,
    turnstileRef,
    setCaptchaToken,
  };
}
