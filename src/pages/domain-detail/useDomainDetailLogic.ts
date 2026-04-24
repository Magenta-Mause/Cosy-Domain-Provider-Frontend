import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { checkLabelAvailability } from "@/api/billing-api";
import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";
import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import useDataLoading from "@/hooks/useDataLoading/useDataLoading";
import {
  isValidIpv4,
  isValidIpv6,
  isValidSubdomainLabel,
} from "@/lib/validators";
import { useAppSelector } from "@/store/hooks";

import {
  DEBOUNCE_MS,
  formatCreatedAt,
  getLocale,
  type LabelAvailability,
  type NamingMode,
  type TabKey,
} from "./lib";

export type { LabelAvailability, NamingMode, TabKey } from "./lib";

export function useDomainDetailLogic(domainId: string) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isCreateMode = domainId === "new";

  const { userTier, isVerified } = useAuthInformation();
  const isPlus = userTier === "PLUS";

  const { createSubdomain, updateSubdomain, deleteSubdomain } =
    useDataInteractions();
  const { loadSubdomainByUuid } = useDataLoading();
  const cachedSubdomain = useAppSelector((state) =>
    state.subdomains.items.find((item) => item.uuid === domainId),
  );

  const [loadedSubdomain, setLoadedSubdomain] =
    useState<typeof cachedSubdomain>(undefined);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [label, setLabelRaw] = useState("");
  const [targetIp, setTargetIp] = useState("");
  const [targetIpv6, setTargetIpv6] = useState("");
  const [originalTargetIp, setOriginalTargetIp] = useState("");
  const [originalTargetIpv6, setOriginalTargetIpv6] = useState("");
  const [ipTab, setIpTab] = useState<"ipv4" | "ipv6">("ipv4");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [labelAvailability, setLabelAvailability] =
    useState<LabelAvailability>("idle");
  const [namingMode, setNamingMode] = useState<NamingMode>(
    isPlus ? "custom" : "random",
  );

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setLabel = (value: string) => {
    setLabelRaw(value);

    if (!isCreateMode || !isPlus) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!isValidSubdomainLabel(value)) {
      setLabelAvailability("idle");
      return;
    }

    setLabelAvailability("checking");
    debounceRef.current = setTimeout(async () => {
      try {
        const result = await checkLabelAvailability(value);
        if (result.available) {
          setLabelAvailability("available");
        } else {
          setLabelAvailability(
            result.reason === "reserved" ? "reserved" : "taken",
          );
        }
      } catch {
        setLabelAvailability("idle");
      }
    }, DEBOUNCE_MS);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    if (isCreateMode) return;
    if (cachedSubdomain?.uuid) {
      setLoadedSubdomain(cachedSubdomain);
      setLabelRaw(cachedSubdomain.label ?? "");
      setTargetIp(cachedSubdomain.targetIp ?? "");
      setTargetIpv6(cachedSubdomain.targetIpv6 ?? "");
      setOriginalTargetIp(cachedSubdomain.targetIp ?? "");
      setOriginalTargetIpv6(cachedSubdomain.targetIpv6 ?? "");
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
      setLabelRaw(loaded.label ?? "");
      setTargetIp(loaded.targetIp ?? "");
      setTargetIpv6(loaded.targetIpv6 ?? "");
      setOriginalTargetIp(loaded.targetIp ?? "");
      setOriginalTargetIpv6(loaded.targetIpv6 ?? "");
    })();
    return () => {
      active = false;
    };
  }, [cachedSubdomain, domainId, isCreateMode, loadSubdomainByUuid, t]);

  const domain = cachedSubdomain ?? loadedSubdomain;

  const labelValid = useMemo(() => {
    if (!isCreateMode) return true;
    if (namingMode === "random") return true;
    return isValidSubdomainLabel(label) && labelAvailability === "available";
  }, [isCreateMode, namingMode, label, labelAvailability]);

  const ipv4Valid = targetIp.trim() === "" || isValidIpv4(targetIp);
  const ipv6Valid = targetIpv6.trim() === "" || isValidIpv6(targetIpv6);
  const atLeastOneIp = targetIp.trim() !== "" || targetIpv6.trim() !== "";
  const ipValid = isValidIpv4(targetIp);
  const hasChanges =
    isCreateMode ||
    targetIp !== originalTargetIp ||
    targetIpv6 !== originalTargetIpv6;
  const canSubmit =
    !isSubmitting &&
    ipv4Valid &&
    ipv6Valid &&
    atLeastOneIp &&
    hasChanges &&
    (isCreateMode
      ? namingMode === "random" || (isPlus && labelAvailability === "available")
      : labelValid);

  const locale = getLocale(i18n.language);
  const createdAt = formatCreatedAt(
    domain?.createdAt,
    locale,
    t("domainDetail.unknownValue"),
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);
    setErrorMessage(null);
    if (!ipv4Valid || !ipv6Valid || !atLeastOneIp) return;
    if (isCreateMode && namingMode === "custom" && !labelValid) return;
    setIsSubmitting(true);
    try {
      if (isCreateMode) {
        const created = await createSubdomain({
          label: namingMode === "custom" ? label : "",
          targetIp: targetIp.trim() || undefined,
          targetIpv6: targetIpv6.trim() || undefined,
        });
        if (created.uuid) {
          await navigate({
            to: "/domain/$domainId",
            params: { domainId: created.uuid },
          });
        } else {
          await navigate({ to: "/dashboard" });
        }
      } else {
        await updateSubdomain(domainId, {
          targetIp: targetIp.trim() || undefined,
          targetIpv6: targetIpv6.trim() || undefined,
        });
      }
    } catch {
      setErrorMessage(
        isCreateMode
          ? t("createSubdomain.error")
          : t("domainDetail.updateError"),
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

  return {
    domain,
    isCreateMode,
    isPlus,
    isVerified,
    isInitialLoading,
    label,
    setLabel,
    targetIp,
    setTargetIp,
    targetIpv6,
    setTargetIpv6,
    ipTab,
    setIpTab,
    errorMessage,
    isSubmitting,
    isDeleting,
    hasSubmitted,
    activeTab,
    setActiveTab,
    labelValid,
    labelAvailability,
    namingMode,
    setNamingMode,
    ipValid,
    ipv4Valid,
    ipv6Valid,
    atLeastOneIp,
    canSubmit,
    createdAt,
    handleSubmit,
    handleDelete,
  };
}
