import { useTranslation } from "react-i18next";

import type { AdminSubdomain } from "@/api/admin-api";
import { FlatPanel } from "@/components/pixel/panel";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";

import { DangerZonePanel } from "../../danger-zone-panel";
import { DnsEntriesPanel } from "./components/dns-entries-panel";
import { SubdomainInfoPanels } from "./components/subdomain-info-panels";
import { deriveDnsEntries } from "./lib";
import { useSubdomainDetailLogic } from "./useSubdomainDetailLogic";

interface SubdomainDetailProps {
  readonly subdomain: AdminSubdomain;
  readonly adminKey: string;
  readonly onSaved: () => void;
}

export function SubdomainDetail({
  subdomain,
  adminKey,
  onSaved,
}: SubdomainDetailProps) {
  const { t } = useTranslation();

  const {
    domainSuffix,
    targetIp,
    setTargetIp,
    targetIpv6,
    setTargetIpv6,
    isSavingIps,
    saveIpsError,
    ipsUnchanged,
    handleSaveIps,
    label,
    setLabel,
    isSavingLabel,
    saveLabelError,
    labelUnchanged,
    handleSaveLabel,
    isDeleting,
    deleteError,
    handleDeleteSubdomain,
    handleBack,
    handleOwnerClick,
  } = useSubdomainDetailLogic(subdomain, adminKey, onSaved);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <button
          type="button"
          onClick={handleBack}
          className="pbtn sm secondary"
        >
          {t("admin.back")}
        </button>
      </div>

      <SubdomainInfoPanels
        subdomain={subdomain}
        onOwnerClick={handleOwnerClick}
      />

      <DnsEntriesPanel entries={deriveDnsEntries(subdomain)} />

      <FlatPanel className="px-5 py-4 flex flex-col gap-3">
        <h3 className="text-sm font-semibold opacity-70 uppercase tracking-wide">
          {t("admin.editIpsSection")}
        </h3>
        <div className="flex items-end gap-5">
          <FormField
            id="target-ip"
            label={t("admin.colTargetIpv4")}
            value={targetIp}
            onChange={setTargetIp}
            placeholder="192.0.2.1"
            inputMode="decimal"
          />
          <FormField
            id="target-ipv6"
            label={t("admin.fieldTargetIpv6")}
            value={targetIpv6}
            onChange={setTargetIpv6}
            placeholder="2001:db8::1"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleSaveIps}
            disabled={isSavingIps || ipsUnchanged}
            className="h-[50px] shrink-0"
          >
            {isSavingIps ? t("admin.savingIps") : t("admin.saveIps")}
          </Button>
        </div>
        {saveIpsError && (
          <p className="text-sm text-destructive">{saveIpsError}</p>
        )}
      </FlatPanel>

      <FlatPanel className="px-5 py-4 flex flex-col gap-3">
        <h3 className="text-sm font-semibold opacity-70 uppercase tracking-wide">
          {t("admin.renameSection")}
        </h3>
        <div className="flex items-end gap-5">
          <FormField
            id="label"
            label={t("admin.fieldNewLabel")}
            value={label}
            onChange={setLabel}
            suffix={domainSuffix}
            minLength={3}
            maxLength={45}
          />
          <Button
            type="button"
            size="sm"
            onClick={handleSaveLabel}
            disabled={isSavingLabel || labelUnchanged}
            className="h-[50px] shrink-0"
          >
            {isSavingLabel ? t("admin.savingLabel") : t("admin.saveLabel")}
          </Button>
        </div>
        {saveLabelError && (
          <p className="text-sm text-destructive">{saveLabelError}</p>
        )}
      </FlatPanel>

      <DangerZonePanel
        buttonLabel={t("admin.deleteSubdomain")}
        onDelete={handleDeleteSubdomain}
        isDeleting={isDeleting}
        error={deleteError}
      />
    </div>
  );
}
