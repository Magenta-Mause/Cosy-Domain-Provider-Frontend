import { customInstance } from "./axios-instance";

export interface LinkedIdentity {
  provider: string;
  email: string;
}

export const getOAuthIdentities = (): Promise<LinkedIdentity[]> =>
  customInstance({ url: "/api/v1/user/oauth-identities", method: "GET" });
