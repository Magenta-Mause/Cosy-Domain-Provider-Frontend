import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { checkLabelAvailability } from "@/api/billing-api";
import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";
import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import { isValidIpv4, isValidSubdomainLabel } from "@/lib/validators";
import { DEBOUNCE_MS } from "../lib";

export type { LabelAvailability, NamingMode } from "../lib";

export function useCreateSubdomainLogic() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userPlan, isVerified } = useAuthInformation();
  const isPlus = userPlan === "PLUS";
  const { createSubdomain } = useDataInteractions();

  const [namingMode, setNamingMode] = useState<NamingMode>(
    isPlus ? "custom" : "random",
  );
  const [label, setLabelRaw] = useState("");
  const [labelAvailability, setLabelAvailability] =
    useState<LabelAvailability>("idle");
  const [targetIp, setTargetIp] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setLabel = (value: string) => {
    setLabelRaw(value);
    if (!isPlus) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!isValidSubdomainLabel(value)) {
      setLabelAvailability("idle");
      return;
    }
    setLabelAvailability("checking");
    debounceRef.current = setTimeout(async () => {
      try {
        const result = await checkLabelAvailability(value);
        setLabelAvailability(
          result.available
            ? "available"
            : result.reason === "reserved"
              ? "reserved"
              : "taken",
        );
      } catch {
        setLabelAvailability("idle");
      }
    }, DEBOUNCE_MS);
  };

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  const labelValid = useMemo(
    () =>
      namingMode === "random" ||
      (isValidSubdomainLabel(label) && labelAvailability === "available"),
    [namingMode, label, labelAvailability],
  );

  const ipValid = isValidIpv4(targetIp);
  const canSubmit =
    !isSubmitting &&
    ipValid &&
    (namingMode === "random" || (isPlus && labelAvailability === "available"));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);
    setErrorMessage(null);
    if (!ipValid) return;
    if (namingMode === "custom" && !labelValid) return;
    setIsSubmitting(true);
    try {
      const created = await createSubdomain({
        label: namingMode === "custom" ? label : "",
        targetIp,
      });
      if (created.uuid) {
        await navigate({
          to: "/domain/$domainId",
          params: { domainId: created.uuid },
        });
      } else {
        await navigate({ to: "/dashboard" });
      }
    } catch {
      setErrorMessage(t("createSubdomain.error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    isPlus,
    isVerified,
    namingMode,
    setNamingMode,
    label,
    setLabel,
    labelAvailability,
    targetIp,
    setTargetIp,
    hasSubmitted,
    isSubmitting,
    labelValid,
    ipValid,
    canSubmit,
    errorMessage,
    handleSubmit,
  };
}
