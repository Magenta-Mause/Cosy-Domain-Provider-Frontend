import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import { useAppSelector } from "@/store/hooks";

export function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { registerUser } = useDataInteractions();
  const authState = useAppSelector((state) => state.auth.state);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const usernameValid = username.trim().length >= 3 && username.trim().length <= 20;
  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);
  const passwordValid = password.length >= 8;
  const confirmValid = password === confirmPassword;
  const canSubmit =
    usernameValid &&
    emailValid &&
    passwordValid &&
    confirmValid &&
    authState !== "loading";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    if (!canSubmit) return;

    try {
      await registerUser({ username: username.trim(), email: email.trim(), password });
      await navigate({ to: "/dashboard" });
    } catch {
      setErrorMessage(t("register.error"));
    }
  }

  const submitting = authState === "loading";

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>{t("register.title")}</CardTitle>
        <CardDescription>{t("register.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium leading-none">
              {t("register.username")}
            </label>
            <Input
              id="username"
              autoComplete="username"
              required
              minLength={3}
              maxLength={20}
              placeholder="your-username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">
              {t("register.email")}
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium leading-none">
              {t("register.password")}
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="Create a strong password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
              {t("register.confirmPassword")}
            </label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>
          {!confirmValid && confirmPassword.length > 0 ? (
            <p className="text-sm text-red-600">{t("register.passwordMismatch")}</p>
          ) : null}
          {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
          <Button type="submit" className="w-full" disabled={!canSubmit}>
            {submitting ? t("register.submitting") : t("register.submit")}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {t("register.hasAccount")}{" "}
            <Link to="/login" className="underline underline-offset-2 hover:text-foreground">
              {t("register.loginLink")}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
