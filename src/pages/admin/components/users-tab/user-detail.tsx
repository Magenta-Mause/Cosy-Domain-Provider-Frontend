import { useTranslation } from "react-i18next";

import { FlatPanel } from "@/components/pixel/panel";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";

import type { AdminUserDetail } from "../../lib";
import { DetailField } from "./components/detail-field";
import { UserSubdomainsTable } from "./components/user-subdomains-table";
import { useUserDetailLogic } from "./useUserDetailLogic";

interface UserDetailProps {
  detail: AdminUserDetail;
  adminKey: string;
  onSaved: () => void;
}

export function UserDetail({ detail, adminKey, onSaved }: UserDetailProps) {
  const { t } = useTranslation();
  const {
    overrideInput,
    setOverrideInput,
    isSaving,
    saveError,
    isUnchanged,
    handleSaveOverride,
    handleBack,
  } = useUserDetailLogic(detail, adminKey, onSaved);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 items-start">
        <button type="button" onClick={handleBack} className="pbtn sm secondary">
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
        <DetailField label={t("admin.fieldEmail")}>{detail.email}</DetailField>
        <DetailField label={t("admin.fieldUsername")}>
          {detail.username}
        </DetailField>
        <DetailField label={t("admin.fieldVerified")}>
          {detail.verified ? t("admin.yes") : t("admin.no")}
        </DetailField>
        <DetailField label={t("admin.fieldTier")}>
          <span className="font-semibold">{detail.tier}</span>
        </DetailField>
        <DetailField label={t("admin.fieldPlanExpires")}>
          {detail.planExpiresAt
            ? new Date(detail.planExpiresAt).toLocaleDateString()
            : "—"}
        </DetailField>
        <DetailField label={t("admin.fieldJoined")}>
          {detail.createdAt
            ? new Date(detail.createdAt).toLocaleDateString()
            : "—"}
        </DetailField>
        <DetailField label={t("admin.fieldMaxSubdomains")}>
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
        </DetailField>
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
        <UserSubdomainsTable subdomains={detail.subdomains} />
      </div>
    </div>
  );
}
