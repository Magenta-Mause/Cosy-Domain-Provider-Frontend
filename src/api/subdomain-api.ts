import { customInstance } from "./axios-instance";

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
