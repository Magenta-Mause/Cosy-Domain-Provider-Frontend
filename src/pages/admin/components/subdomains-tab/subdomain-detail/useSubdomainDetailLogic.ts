import { useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { type AdminSubdomain, adminApi } from "../../../lib";

export function useSubdomainDetailLogic(
  subdomain: AdminSubdomain,
  adminKey: string,
  onSaved: () => void,
) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const router = useRouter();

  const domainSuffix = subdomain.fqdn
    ? subdomain.fqdn.slice(subdomain.label.length)
    : "";

  // Edit IPs
  const [targetIp, setTargetIp] = useState(subdomain.targetIp ?? "");
  const [targetIpv6, setTargetIpv6] = useState(subdomain.targetIpv6 ?? "");
  const [isSavingIps, setIsSavingIps] = useState(false);
  const [saveIpsError, setSaveIpsError] = useState<string | null>(null);

  const ipsUnchanged =
    targetIp === (subdomain.targetIp ?? "") &&
    targetIpv6 === (subdomain.targetIpv6 ?? "");

  const handleSaveIps = async () => {
    if (!targetIp && !targetIpv6) {
      setSaveIpsError(t("admin.saveIpsAtLeastOne"));
      return;
    }
    setIsSavingIps(true);
    setSaveIpsError(null);
    try {
      await adminApi.updateSubdomainIps(adminKey, subdomain.uuid, {
        targetIp: targetIp || undefined,
        targetIpv6: targetIpv6 || undefined,
      });
      onSaved();
    } catch {
      setSaveIpsError(t("admin.saveIpsError"));
    } finally {
      setIsSavingIps(false);
    }
  };

  // Rename
  const [label, setLabel] = useState(subdomain.label);
  const [isSavingLabel, setIsSavingLabel] = useState(false);
  const [saveLabelError, setSaveLabelError] = useState<string | null>(null);

  const labelUnchanged = label === subdomain.label;

  const handleSaveLabel = async () => {
    setIsSavingLabel(true);
    setSaveLabelError(null);
    try {
      await adminApi.relabelSubdomain(adminKey, subdomain.uuid, label);
      onSaved();
    } catch {
      setSaveLabelError(t("admin.saveLabelError"));
    } finally {
      setIsSavingLabel(false);
    }
  };

  // Delete
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteSubdomain = async () => {
    if (!window.confirm(t("admin.deleteSubdomainConfirm"))) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await adminApi.deleteSubdomain(adminKey, subdomain.uuid);
      await navigate({ to: "/admin/subdomains" });
    } catch {
      setDeleteError(t("admin.deleteSubdomainError"));
      setIsDeleting(false);
    }
  };

  const handleBack = () => router.history.back();

  return {
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
  };
}
