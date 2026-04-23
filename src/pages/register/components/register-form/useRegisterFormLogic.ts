import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import { isValidEmail } from "@/lib/validators";
import { useAppSelector } from "@/store/hooks";
import { isPasswordWeak, isValidPassword, isValidUsername } from "./lib";

export function useRegisterFormLogic() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { registerUser } = useDataInteractions();
  const authState = useAppSelector((state) => state.auth.state);

  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const usernameValid = isValidUsername(username);
  const emailValid = useMemo(() => isValidEmail(email), [email]);
  const passwordValid = isValidPassword(password);
  const passwordWeak = isPasswordWeak(password);
  const confirmValid = password === confirmPassword;
  const submitting = authState === "loading";
  const canSubmit =
    usernameValid &&
    emailValid &&
    passwordValid &&
    confirmValid &&
    agreed &&
    !submitting;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 1) {
      if (emailValid) setStep(2);
      return;
    }
    setErrorMessage(null);
    if (!canSubmit) return;
    try {
      await registerUser({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      await navigate({ to: "/dashboard" });
    } catch {
      setErrorMessage(t("register.error"));
    }
  }

  function goBack() {
    setStep(1);
    setPassword("");
    setConfirmPassword("");
    setErrorMessage(null);
  }

  return {
    step,
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPw,
    setShowPw,
    showConfirmPw,
    setShowConfirmPw,
    agreed,
    setAgreed,
    errorMessage,
    passwordWeak,
    confirmValid,
    canSubmit,
    submitting,
    handleSubmit,
    goBack,
  };
}
