import { customInstance } from "./axios-instance";

export interface BillingPortalResponse {
  url: string;
}

export const getBillingPortalUrl = (): Promise<BillingPortalResponse> =>
  customInstance({ url: "/api/v1/billing/portal", method: "GET" });
