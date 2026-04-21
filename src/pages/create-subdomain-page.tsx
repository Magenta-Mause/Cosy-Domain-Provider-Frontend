import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  getListMySubdomainsQueryKey,
  useCreateSubdomain,
} from "@/api/generated/domain-provider-api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const LABEL_PATTERN = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;
const IPV4_PATTERN =
  /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

export function CreateSubdomainPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [label, setLabel] = useState("");
  const [targetIp, setTargetIp] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createMutation = useCreateSubdomain({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getListMySubdomainsQueryKey(),
        });
      },
    },
  });

  const labelValid = LABEL_PATTERN.test(label);
  const ipValid = IPV4_PATTERN.test(targetIp);
  const canSubmit = labelValid && ipValid && !createMutation.isPending;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    try {
      await createMutation.mutateAsync({ data: { label, targetIp } });
      await navigate({ to: "/dashboard" });
    } catch {
      setErrorMessage(t("createSubdomain.error"));
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>{t("createSubdomain.title")}</CardTitle>
        <CardDescription>{t("createSubdomain.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="label" className="text-sm font-medium leading-none">
              {t("createSubdomain.label")}
            </label>
            <Input
              id="label"
              required
              value={label}
              onChange={(event) =>
                setLabel(event.target.value.toLowerCase().trim())
              }
              placeholder="my-castle"
            />
            <p className="text-xs text-muted-foreground">
              {t("createSubdomain.labelHint")}
            </p>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="targetIp"
              className="text-sm font-medium leading-none"
            >
              {t("createSubdomain.targetIp")}
            </label>
            <Input
              id="targetIp"
              required
              value={targetIp}
              onChange={(event) => setTargetIp(event.target.value.trim())}
              placeholder="203.0.113.42"
              inputMode="decimal"
            />
            <p className="text-xs text-muted-foreground">
              {t("createSubdomain.targetIpHint")}
            </p>
          </div>
          {errorMessage ? (
            <p className="text-sm text-red-600">{errorMessage}</p>
          ) : null}
          <div className="flex items-center justify-between gap-2">
            <Link
              to="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {t("createSubdomain.cancel")}
            </Link>
            <Button type="submit" disabled={!canSubmit}>
              {createMutation.isPending
                ? t("createSubdomain.submitting")
                : t("createSubdomain.submit")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
