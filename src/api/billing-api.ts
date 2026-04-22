import { customInstance } from "./axios-instance";

export interface BillingPortalResponse {
  url: string;
}

export interface LabelAvailabilityResponse {
  available: boolean;
  reason: "taken" | "reserved" | null;
}

export const checkLabelAvailability = (
  label: string,
): Promise<LabelAvailabilityResponse> =>
  customInstance({
    url: "/api/v1/subdomain/check",
    method: "GET",
    params: { label },
  });

export const getBillingPortalUrl = (): Promise<BillingPortalResponse> =>
  customInstance({ url: "/api/v1/billing/portal", method: "GET" });

export const getCheckoutUrl = (): Promise<BillingPortalResponse> =>
  customInstance({ url: "/api/v1/billing/checkout", method: "POST" });
