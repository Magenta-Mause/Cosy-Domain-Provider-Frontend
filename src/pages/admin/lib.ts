export interface AdminSubdomain {
  uuid: string;
  label: string;
  fqdn: string | null;
  targetIp: string | null;
  targetIpv6: string | null;
  status: "PENDING" | "ACTIVE" | "FAILED";
  labelMode: "CUSTOM" | "RANDOM";
  ownerUuid: string;
  ownerUsername: string;
  ownerEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  uuid: string;
  username: string;
  email: string;
  verified: boolean;
  tier: "FREE" | "PLUS";
  maxSubdomainCount: number;
  maxSubdomainCountOverride: number | null;
  subdomainCount: number;
  planExpiresAt: string | null;
  createdAt: string | null;
}

export interface AdminUserDetail extends Omit<AdminUser, "subdomainCount"> {
  subdomains: AdminSubdomain[];
}

const BASE = "/api/v1/admin";

function headers(key: string) {
  return { "X-Admin-Key": key, "Content-Type": "application/json" };
}

async function request<T>(
  url: string,
  key: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(url, { ...init, headers: headers(key) });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export const adminApi = {
  getSubdomains: (key: string) =>
    request<AdminSubdomain[]>(`${BASE}/subdomains`, key),

  getSubdomainDetail: (key: string, uuid: string) =>
    request<AdminSubdomain>(`${BASE}/subdomains/${uuid}`, key),

  getUsers: (key: string) => request<AdminUser[]>(`${BASE}/users`, key),

  getUserDetail: (key: string, uuid: string) =>
    request<AdminUserDetail>(`${BASE}/users/${uuid}`, key),

  setMaxSubdomainOverride: (key: string, uuid: string, value: number | null) =>
    request(`${BASE}/users/${uuid}/max-subdomain-override`, key, {
      method: "PATCH",
      body: JSON.stringify({ maxSubdomainCountOverride: value }),
    }),
};

export const ADMIN_KEY_STORAGE = "admin_key";
