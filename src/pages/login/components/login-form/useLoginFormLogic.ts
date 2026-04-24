import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import { useAppSelector } from "@/store/hooks";

export function useLoginFormLogic() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loginUser } = useDataInteractions();
  const authState = useAppSelector((state) => state.auth.state);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submitting = authState === "loading";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    try {
      const identityToken = await loginUser({ email, password });
      if (identityToken?.isVerified) {
        await navigate({ to: "/dashboard" });
      } else {
        await navigate({ to: "/verify" });
      }
    } catch {
      setErrorMessage(t("login.error"));
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPw,
    setShowPw,
    errorMessage,
    submitting,
    handleSubmit,
  };
}
