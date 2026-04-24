import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatPanel } from "@/components/pixel/panel";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { type AdminSubdomain, type AdminUserDetail, adminApi } from "../../lib";

interface UserDetailProps {
  detail: AdminUserDetail;
  adminKey: string;
  onSaved: () => void;
}

export function UserDetail({ detail, adminKey, onSaved }: UserDetailProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const savedValue =
    detail.maxSubdomainCountOverride !== null
      ? String(detail.maxSubdomainCountOverride)
      : "";

  const [overrideInput, setOverrideInput] = useState(savedValue);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const isUnchanged = overrideInput === savedValue;

  const handleSaveOverride = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const value = overrideInput.trim() === "" ? null : Number(overrideInput);
      await adminApi.setMaxSubdomainOverride(adminKey, detail.uuid, value);
      onSaved();
    } catch {
      setSaveError(t("admin.saveOverrideError"));
    } finally {
      setIsSaving(false);
    }
  };

  const StatusBadge = ({ status }: { status: AdminSubdomain["status"] }) => {
    const color =
      status === "ACTIVE"
        ? "text-green-600"
        : status === "FAILED"
          ? "text-destructive"
          : "text-yellow-400";
    return <span className={`text-sm ${color}`}>{status}</span>;
  };

  const Field = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="flex flex-col gap-1">
      <div className="text-[10px] opacity-50 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-base">{children}</div>
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 items-start">
        <button
          type="button"
          onClick={() => navigate({ to: "/admin/users" })}
          className="pbtn sm secondary"
        >
          {t("admin.back")}
        </button>
      </div>

      <FlatPanel className="px-5 py-4 grid grid-cols-2 gap-x-8 gap-y-4">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] opacity-50 uppercase tracking-wide">
            {t("admin.fieldUserId")}
          </div>
          <div className="text-sm font-mono">{detail.uuid}</div>
        </div>
        <Field label={t("admin.fieldEmail")}>{detail.email}</Field>
        <Field label={t("admin.fieldUsername")}>{detail.username}</Field>
        <Field label={t("admin.fieldVerified")}>
          {detail.verified ? t("admin.yes") : t("admin.no")}
        </Field>
        <Field label={t("admin.fieldTier")}>
          <span className="font-semibold">{detail.tier}</span>
        </Field>
        <Field label={t("admin.fieldPlanExpires")}>
          {detail.planExpiresAt
            ? new Date(detail.planExpiresAt).toLocaleDateString()
            : "—"}
        </Field>
        <Field label={t("admin.fieldJoined")}>
          {detail.createdAt
            ? new Date(detail.createdAt).toLocaleDateString()
            : "—"}
        </Field>
        <Field label={t("admin.fieldMaxSubdomains")}>
          {detail.maxSubdomainCount}
          {detail.maxSubdomainCountOverride !== null && (
            <span className="ml-2 opacity-50 text-sm">
              (
              {t("admin.overrideValueLabel", {
                value: String(detail.maxSubdomainCountOverride),
              })}
              )
            </span>
          )}
        </Field>
      </FlatPanel>

      <FlatPanel className="px-5 py-4 flex gap-3 flex-col">
        <div className="flex-1 w-full flex items-end gap-5">
          <FormField
            id="max-override"
            label={t("admin.fieldOverrideLabel")}
            type="number"
            value={overrideInput}
            onChange={setOverrideInput}
            placeholder={t("admin.fieldOverridePlaceholder")}
            error={saveError}
          />
          <Button
            type="button"
            size="sm"
            onClick={handleSaveOverride}
            disabled={isSaving || isUnchanged}
            className="h-[50px] mt-auto"
          >
            {isSaving ? t("admin.savingOverride") : t("admin.saveOverride")}
          </Button>
        </div>
      </FlatPanel>

      <div>
        <h3 className="text-base font-semibold mb-2">
          {t("admin.subdomainsSection", { count: detail.subdomains.length })}
        </h3>
        <FlatPanel className="p-0 overflow-hidden">
          <div
            className="grid text-sm"
            style={{ gridTemplateColumns: "2fr 2.5fr 1fr 1fr 1fr 1fr" }}
          >
            {[
              t("admin.colLabel"),
              t("admin.colFqdn"),
              t("admin.colStatus"),
              t("admin.colMode"),
              t("admin.colTargetIp"),
              t("admin.colCreated"),
            ].map((h) => (
              <div
                key={h}
                className="px-3 py-2 bg-btn-primary text-btn-secondary font-bold"
              >
                {h}
              </div>
            ))}
            {detail.subdomains.length === 0 && (
              <div className="col-span-6 px-3 py-4 opacity-50 text-center">
                {t("admin.noSubdomains")}
              </div>
            )}
            {detail.subdomains.map((s) => [
              <div
                key={`${s.uuid}-label`}
                className="px-3 py-2.5 border-t border-foreground/10 font-mono truncate"
              >
                {s.label}
              </div>,
              <div
                key={`${s.uuid}-fqdn`}
                className="px-3 py-2.5 border-t border-foreground/10 truncate opacity-70"
              >
                {s.fqdn ?? "—"}
              </div>,
              <div
                key={`${s.uuid}-status`}
                className="px-3 py-2.5 border-t border-foreground/10"
              >
                <StatusBadge status={s.status} />
              </div>,
              <div
                key={`${s.uuid}-mode`}
                className="px-3 py-2.5 border-t border-foreground/10 opacity-70"
              >
                {s.labelMode}
              </div>,
              <div
                key={`${s.uuid}-ip`}
                className="px-3 py-2.5 border-t border-foreground/10 truncate opacity-70"
              >
                {s.targetIp ?? "—"}
              </div>,
              <div
                key={`${s.uuid}-date`}
                className="px-3 py-2.5 border-t border-foreground/10 opacity-70"
              >
                {new Date(s.createdAt).toLocaleDateString()}
              </div>,
            ])}
          </div>
        </FlatPanel>
      </div>
    </div>
  );
}
