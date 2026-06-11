import { describe, expect, it } from "vitest";
import type { AdminSubdomain } from "@/api/admin-api";
import { deriveDnsEntries } from "./lib";

const baseSub: AdminSubdomain = {
  uuid: "s1",
  label: "castle",
  fqdn: "castle.play.cosy-hosting.net",
  targetIp: null,
  targetIpv6: null,
  status: "ACTIVE",
  labelMode: "CUSTOM",
  ownerUuid: "u1",
  ownerUsername: "alice",
  ownerEmail: "alice@example.com",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

describe("deriveDnsEntries", () => {
  it("returns no entries when no IPs are set", () => {
    expect(deriveDnsEntries(baseSub)).toEqual([]);
  });

  it("returns an A record for an IPv4 target", () => {
    expect(deriveDnsEntries({ ...baseSub, targetIp: "192.0.2.1" })).toEqual([
      {
        name: "castle.play.cosy-hosting.net",
        type: "A",
        value: "192.0.2.1",
      },
    ]);
  });

  it("returns an AAAA record for an IPv6 target", () => {
    expect(deriveDnsEntries({ ...baseSub, targetIpv6: "2001:db8::1" })).toEqual(
      [
        {
          name: "castle.play.cosy-hosting.net",
          type: "AAAA",
          value: "2001:db8::1",
        },
      ],
    );
  });

  it("falls back to the label when fqdn is null", () => {
    const entries = deriveDnsEntries({
      ...baseSub,
      fqdn: null,
      targetIp: "192.0.2.1",
    });
    expect(entries[0].name).toBe("castle");
  });
});
