import { customInstance } from "./axios-instance";

/**
 * Staging gate endpoints. These run before the app/store is populated, so the
 * StagingAuthProvider calls them directly rather than through
 * useDataLoading/useDataInteractions (see docs/patterns/state-management.md).
 */

export const checkStagingAuth = (): Promise<void> =>
  customInstance({ url: "/api/v1/staging-auth", method: "GET" });

export const submitStagingAuth = (
  username: string,
  password: string,
): Promise<void> => {
  const token = btoa(`${username}:${password}`);
  return customInstance({
    url: "/api/v1/staging-auth",
    method: "POST",
    data: {},
    headers: { Authorization: `Basic ${token}` },
  });
};
