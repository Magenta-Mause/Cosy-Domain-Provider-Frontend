import { Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, Globe, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import useDataLoading from "@/hooks/useDataLoading/useDataLoading";
import { useAppSelector } from "@/store/hooks";

const LABEL_PATTERN = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;
const IPV4_PATTERN =
  /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

export function DomainDetailPage({ domainId }: { domainId: string }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isCreateMode = domainId === "new";
  const { createSubdomain, updateSubdomain, deleteSubdomain } = useDataInteractions();
  const { loadSubdomainByUuid } = useDataLoading();
  const cachedSubdomain = useAppSelector((state) =>
    state.subdomains.items.find((item) => item.uuid === domainId),
  );
  const [loadedSubdomain, setLoadedSubdomain] = useState<typeof cachedSubdomain>(undefined);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [label, setLabel] = useState("");
  const [targetIp, setTargetIp] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (isCreateMode) return;

    if (cachedSubdomain?.uuid) {
      setLoadedSubdomain(cachedSubdomain);
      setLabel(cachedSubdomain.label ?? "");
      setTargetIp(cachedSubdomain.targetIp ?? "");
      return;
    }

    let active = true;
    setIsInitialLoading(true);
    void (async () => {
      const loaded = await loadSubdomainByUuid(domainId);
      if (!active) return;
      setIsInitialLoading(false);
      if (!loaded) {
        setErrorMessage(t("domainDetail.loadError"));
        return;
      }
      setLoadedSubdomain(loaded);
      setLabel(loaded.label ?? "");
      setTargetIp(loaded.targetIp ?? "");
    })();

    return () => {
      active = false;
    };
  }, [cachedSubdomain, domainId, isCreateMode, loadSubdomainByUuid, t]);

  const domain = cachedSubdomain ?? loadedSubdomain;

  const labelValid = useMemo(
    () => (isCreateMode ? LABEL_PATTERN.test(label) : true),
    [isCreateMode, label],
  );
  const ipValid = IPV4_PATTERN.test(targetIp);
  const canSubmit = labelValid && ipValid && !isSubmitting;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);
    setErrorMessage(null);

    if (!labelValid || !ipValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (isCreateMode) {
        const created = await createSubdomain({ label, targetIp });
        if (created.uuid) {
          await navigate({ to: "/domain/$domainId", params: { domainId: created.uuid } });
        } else {
          await navigate({ to: "/dashboard" });
        }
      } else {
        await updateSubdomain(domainId, { targetIp });
      }
    } catch {
      setErrorMessage(
        isCreateMode ? t("createSubdomain.error") : t("domainDetail.updateError"),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (isCreateMode) return;
    const shouldDelete = window.confirm(t("domainDetail.deleteConfirm"));
    if (!shouldDelete) return;

    setIsDeleting(true);
    setErrorMessage(null);
    try {
      await deleteSubdomain(domainId);
      await navigate({ to: "/dashboard" });
    } catch {
      setErrorMessage(t("domainDetail.deleteError"));
    } finally {
      setIsDeleting(false);
    }
  }

  const locale = i18n.language.toLowerCase().startsWith("de") ? "de-DE" : "en-US";
  const createdAt = domain?.createdAt
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(domain.createdAt),
      )
    : t("domainDetail.unknownValue");
  const updatedAt = domain?.updatedAt
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(domain.updatedAt),
      )
    : t("domainDetail.unknownValue");

  if (isInitialLoading) {
    return (
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>{t("domainDetail.loading")}</CardTitle>
          <CardDescription>{t("domainDetail.description")}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-[2fr_1fr]">
      <Card>
        <CardHeader className="space-y-2 border-b">
          <Link
            to="/dashboard"
            className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("domainDetail.backToDomains")}
          </Link>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {isCreateMode ? t("domainDetail.createTitle") : t("domainDetail.title")}
          </CardTitle>
          <CardDescription>
            {isCreateMode ? t("domainDetail.createDescription") : t("domainDetail.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form
            className="space-y-6"
            onSubmit={handleSubmit}
            aria-describedby="domain-form-hint"
          >
            <p id="domain-form-hint" className="text-sm text-muted-foreground">
              {t("domainDetail.formHint")}
            </p>
            <fieldset className="space-y-4" disabled={isSubmitting || isDeleting}>
              <legend className="sr-only">{t("domainDetail.formLegend")}</legend>
              <div className="space-y-2">
                <label htmlFor="label" className="text-sm font-medium leading-none">
                  {t("createSubdomain.label")}
                </label>
                <Input
                  id="label"
                  required
                  value={label}
                  onChange={(event) => setLabel(event.target.value.toLowerCase().trim())}
                  placeholder="my-castle"
                  readOnly={!isCreateMode}
                  aria-readonly={!isCreateMode}
                  aria-invalid={hasSubmitted && !labelValid}
                  aria-describedby="label-help"
                />
                <p id="label-help" className="text-xs text-muted-foreground">
                  {!isCreateMode
                    ? t("domainDetail.labelReadonly")
                    : t("createSubdomain.labelHint")}
                </p>
                {hasSubmitted && !labelValid ? (
                  <p className="text-xs text-red-600">{t("domainDetail.labelInvalid")}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <label htmlFor="targetIp" className="text-sm font-medium leading-none">
                  {t("createSubdomain.targetIp")}
                </label>
                <Input
                  id="targetIp"
                  required
                  value={targetIp}
                  onChange={(event) => setTargetIp(event.target.value.trim())}
                  placeholder="203.0.113.42"
                  inputMode="decimal"
                  aria-invalid={hasSubmitted && !ipValid}
                  aria-describedby="target-help"
                />
                <p id="target-help" className="text-xs text-muted-foreground">
                  {t("createSubdomain.targetIpHint")}
                </p>
                {hasSubmitted && !ipValid ? (
                  <p className="text-xs text-red-600">{t("domainDetail.ipInvalid")}</p>
                ) : null}
              </div>
            </fieldset>
            {errorMessage ? (
              <p role="alert" aria-live="polite" className="text-sm text-red-600">
                {errorMessage}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button type="submit" disabled={!canSubmit}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting
                  ? t("domainDetail.saving")
                  : isCreateMode
                    ? t("domainDetail.createAction")
                    : t("domainDetail.saveAction")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {!isCreateMode ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("domainDetail.domainInformation")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">{t("domainDetail.domainUuid")}</p>
              <p className="font-mono text-xs">{domain?.uuid ?? t("domainDetail.unknownValue")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("domainDetail.domainFqdn")}</p>
              <p>{domain?.fqdn ?? t("domainDetail.unknownValue")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("domainDetail.domainStatus")}</p>
              <p>{domain?.status ?? t("domainDetail.unknownValue")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("domainDetail.domainCreatedAt")}</p>
              <p>{createdAt}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("domainDetail.domainUpdatedAt")}</p>
              <p>{updatedAt}</p>
            </div>
            <hr />
            <div className="space-y-2 rounded-md border border-red-300/50 bg-red-50 p-3">
              <p className="flex items-center gap-2 font-medium text-red-700">
                <AlertTriangle className="h-4 w-4" />
                {t("domainDetail.dangerZone")}
              </p>
              <p className="text-xs text-red-700/80">{t("domainDetail.deleteDescription")}</p>
              <Button
                type="button"
                variant="outline"
                className="w-full border-red-400 text-red-700 hover:bg-red-100"
                disabled={isDeleting}
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? t("dashboard.deleting") : t("dashboard.delete")}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
