import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { setIdentityToken } from "@/api/axios-instance";
import { fetchToken, useLogin } from "@/api/generated/domain-provider-api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { parseIdentityToken } from "@/lib/jwt";
import { setIdentity } from "@/store/auth-slice";
import { useAppDispatch } from "@/store/hooks";

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginMutation = useLogin();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    try {
      await loginMutation.mutateAsync({ data: { username, password } });
      const token = await fetchToken();
      setIdentityToken(token);
      dispatch(setIdentity({ token, user: parseIdentityToken(token) }));
      await navigate({ to: "/dashboard" });
    } catch {
      setErrorMessage(t("login.error"));
    }
  }

  const submitting = loginMutation.isPending;

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>{t("login.title")}</CardTitle>
        <CardDescription>{t("login.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium leading-none"
            >
              {t("login.username")}
            </label>
            <Input
              id="username"
              autoComplete="username"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none"
            >
              {t("login.password")}
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {errorMessage ? (
            <p className="text-sm text-red-600">{errorMessage}</p>
          ) : null}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? t("login.submitting") : t("login.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
