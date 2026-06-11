import { type AxiosRequestConfig, isAxiosError } from "axios";

import { customInstance } from "./axios-instance";

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

export interface AdminSettings {
  domainCreationEnabled: boolean;
}

const BASE = "/api/v1/admin";

async function request<T>(key: string, config: AxiosRequestConfig): Promise<T> {
  try {
    return await customInstance<T>({
      ...config,
      headers: { "X-Admin-Key": key },
    });
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      if (error.response.status === 401) throw new Error("UNAUTHORIZED");
      throw new Error(`HTTP ${error.response.status}`);
    }
    throw error;
  }
}

export const adminApi = {
  getSubdomains: (key: string) =>
    request<AdminSubdomain[]>(key, { url: `${BASE}/subdomains` }),

  getSubdomainDetail: (key: string, uuid: string) =>
    request<AdminSubdomain>(key, { url: `${BASE}/subdomains/${uuid}` }),

  updateSubdomainIps: (
    key: string,
    uuid: string,
    body: { targetIp?: string; targetIpv6?: string },
  ) =>
    request<AdminSubdomain>(key, {
      url: `${BASE}/subdomains/${uuid}`,
      method: "PUT",
      data: body,
    }),

  relabelSubdomain: (key: string, uuid: string, label: string) =>
    request<AdminSubdomain>(key, {
      url: `${BASE}/subdomains/${uuid}/label`,
      method: "PATCH",
      data: { label },
    }),

  deleteSubdomain: (key: string, uuid: string) =>
    request<void>(key, {
      url: `${BASE}/subdomains/${uuid}`,
      method: "DELETE",
    }),

  getUsers: (key: string) =>
    request<AdminUser[]>(key, { url: `${BASE}/users` }),

  getUserDetail: (key: string, uuid: string) =>
    request<AdminUserDetail>(key, { url: `${BASE}/users/${uuid}` }),

  updateUser: (
    key: string,
    uuid: string,
    body: { username?: string; email?: string },
  ) =>
    request<AdminUser>(key, {
      url: `${BASE}/users/${uuid}`,
      method: "PATCH",
      data: body,
    }),

  deleteUser: (key: string, uuid: string) =>
    request<void>(key, { url: `${BASE}/users/${uuid}`, method: "DELETE" }),

  setMaxSubdomainOverride: (key: string, uuid: string, value: number | null) =>
    request(key, {
      url: `${BASE}/users/${uuid}/max-subdomain-override`,
      method: "PATCH",
      data: { maxSubdomainCountOverride: value },
    }),

  getSettings: (key: string) =>
    request<AdminSettings>(key, { url: `${BASE}/settings` }),

  updateSettings: (key: string, body: Partial<AdminSettings>) =>
    request<AdminSettings>(key, {
      url: `${BASE}/settings`,
      method: "PATCH",
      data: body,
    }),
};
