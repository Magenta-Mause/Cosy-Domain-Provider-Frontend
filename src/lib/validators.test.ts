import { describe, expect, it } from "vitest";
import {
  isPasswordWeak,
  isValidEmail,
  isValidIpv4,
  isValidIpv6,
  isValidPassword,
  isValidSubdomainLabel,
  isValidUsername,
  PASSWORD_MIN,
  USERNAME_MAX,
  USERNAME_MIN,
} from "./validators";

describe("isValidSubdomainLabel", () => {
  it("accepts lowercase alphanumeric labels", () => {
    expect(isValidSubdomainLabel("hello")).toBe(true);
    expect(isValidSubdomainLabel("abc123")).toBe(true);
  });

  it("accepts labels with hyphens in the middle", () => {
    expect(isValidSubdomainLabel("my-domain")).toBe(true);
    expect(isValidSubdomainLabel("a-b-c")).toBe(true);
  });

  it("accepts single character labels", () => {
    expect(isValidSubdomainLabel("a")).toBe(true);
    expect(isValidSubdomainLabel("1")).toBe(true);
  });

  it("rejects labels starting with a hyphen", () => {
    expect(isValidSubdomainLabel("-bad")).toBe(false);
  });

  it("rejects labels ending with a hyphen", () => {
    expect(isValidSubdomainLabel("bad-")).toBe(false);
  });

  it("rejects uppercase characters", () => {
    expect(isValidSubdomainLabel("Hello")).toBe(false);
    expect(isValidSubdomainLabel("ABC")).toBe(false);
  });

  it("rejects labels with dots", () => {
    expect(isValidSubdomainLabel("my.domain")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidSubdomainLabel("")).toBe(false);
  });

  it("rejects labels over 63 characters", () => {
    expect(isValidSubdomainLabel("a".repeat(64))).toBe(false);
  });

  it("accepts labels up to 63 characters", () => {
    expect(isValidSubdomainLabel("a".repeat(63))).toBe(true);
  });
});

describe("isValidIpv4", () => {
  it("accepts valid IPv4 addresses", () => {
    expect(isValidIpv4("192.168.1.1")).toBe(true);
    expect(isValidIpv4("0.0.0.0")).toBe(true);
    expect(isValidIpv4("255.255.255.255")).toBe(true);
    expect(isValidIpv4("10.0.0.1")).toBe(true);
  });

  it("rejects addresses with out-of-range octets", () => {
    expect(isValidIpv4("256.0.0.1")).toBe(false);
    expect(isValidIpv4("192.168.1.999")).toBe(false);
  });

  it("rejects wrong number of octets", () => {
    expect(isValidIpv4("192.168.1")).toBe(false);
    expect(isValidIpv4("192.168.1.1.1")).toBe(false);
  });

  it("rejects non-numeric segments", () => {
    expect(isValidIpv4("abc.def.ghi.jkl")).toBe(false);
    expect(isValidIpv4("192.168.1.a")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidIpv4("")).toBe(false);
  });
});

describe("isValidIpv6", () => {
  it("accepts full 8-group notation", () => {
    expect(isValidIpv6("2001:0db8:85a3:0000:0000:8a2e:0370:7334")).toBe(true);
    expect(isValidIpv6("fe80:0000:0000:0000:0202:b3ff:fe1e:8329")).toBe(true);
  });

  it("accepts compressed notation with ::", () => {
    expect(isValidIpv6("::1")).toBe(true);
    expect(isValidIpv6("fe80::1")).toBe(true);
    expect(isValidIpv6("2001:db8::1")).toBe(true);
    expect(isValidIpv6("::")).toBe(true);
  });

  it("rejects multiple :: occurrences", () => {
    expect(isValidIpv6("::1::1")).toBe(false);
    expect(isValidIpv6("fe80::1::2")).toBe(false);
  });

  it("rejects wrong group count in full notation", () => {
    expect(isValidIpv6("2001:db8:85a3:0:0:8a2e:370")).toBe(false);
  });

  it("rejects invalid hex characters", () => {
    expect(isValidIpv6("gggg::1")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidIpv6("")).toBe(false);
  });
});

describe("isValidEmail", () => {
  it("accepts standard email addresses", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("user.name+tag@sub.example.org")).toBe(true);
  });

  it("rejects addresses without @", () => {
    expect(isValidEmail("userexample.com")).toBe(false);
  });

  it("rejects addresses without domain", () => {
    expect(isValidEmail("user@")).toBe(false);
  });

  it("rejects addresses without TLD", () => {
    expect(isValidEmail("user@example")).toBe(false);
  });

  it("rejects addresses with spaces", () => {
    expect(isValidEmail("user @example.com")).toBe(false);
    expect(isValidEmail("user@ example.com")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });
});

describe("isValidUsername", () => {
  it("accepts usernames within the length bounds", () => {
    expect(isValidUsername("abc")).toBe(true);
    expect(isValidUsername("a".repeat(USERNAME_MAX))).toBe(true);
  });

  it("rejects usernames that are too short", () => {
    expect(isValidUsername("ab")).toBe(false);
    expect(isValidUsername("")).toBe(false);
  });

  it("rejects usernames that are too long", () => {
    expect(isValidUsername("a".repeat(USERNAME_MAX + 1))).toBe(false);
  });

  it("trims whitespace before checking length", () => {
    const padded = `  ${"a".repeat(USERNAME_MIN)}  `;
    expect(isValidUsername(padded)).toBe(true);

    const paddedTooShort = `  ${"a".repeat(USERNAME_MIN - 1)}  `;
    expect(isValidUsername(paddedTooShort)).toBe(false);
  });
});

describe("isValidPassword", () => {
  it("accepts passwords at or above the minimum length", () => {
    expect(isValidPassword("a".repeat(PASSWORD_MIN))).toBe(true);
    expect(isValidPassword("a".repeat(PASSWORD_MIN + 5))).toBe(true);
  });

  it("rejects passwords below the minimum length", () => {
    expect(isValidPassword("a".repeat(PASSWORD_MIN - 1))).toBe(false);
    expect(isValidPassword("")).toBe(false);
  });
});

describe("isPasswordWeak", () => {
  it("returns true for non-empty passwords below the minimum length", () => {
    expect(isPasswordWeak("abc")).toBe(true);
    expect(isPasswordWeak("a".repeat(PASSWORD_MIN - 1))).toBe(true);
  });

  it("returns false for empty string", () => {
    expect(isPasswordWeak("")).toBe(false);
  });

  it("returns false for passwords at or above the minimum length", () => {
    expect(isPasswordWeak("a".repeat(PASSWORD_MIN))).toBe(false);
    expect(isPasswordWeak("a".repeat(PASSWORD_MIN + 1))).toBe(false);
  });
});
