import { describe, it, expect, beforeEach } from "vitest";
import { useTotpStore } from "@/store/totp-store";

const acct = (over: Record<string, unknown> = {}) => ({
  label: "user@x.com",
  issuer: "ACME",
  secret: "MZXW6YTBOI",
  algorithm: "SHA-1" as const,
  digits: 6 as const,
  period: 30,
  persisted: false,
  ...over,
});

beforeEach(() => {
  localStorage.clear();
  useTotpStore.setState({ accounts: [] }); // partial reset keeps actions
});

describe("totp-store", () => {
  it("adds an account with a generated id", () => {
    useTotpStore.getState().addAccount(acct());
    const [a] = useTotpStore.getState().accounts;
    expect(a.id).toBeTruthy();
    expect(a.label).toBe("user@x.com");
  });

  it("removes and replaces accounts by id", () => {
    useTotpStore.getState().addAccount(acct());
    const id = useTotpStore.getState().accounts[0].id;
    useTotpStore.getState().replaceAccount(id, acct({ label: "new" }));
    expect(useTotpStore.getState().accounts[0].label).toBe("new");
    expect(useTotpStore.getState().accounts[0].id).toBe(id);
    useTotpStore.getState().removeAccount(id);
    expect(useTotpStore.getState().accounts).toHaveLength(0);
  });

  it("persists ONLY accounts with persisted=true to localStorage", () => {
    useTotpStore.getState().addAccount(acct({ label: "ephemeral" }));
    useTotpStore.getState().addAccount(acct({ label: "saved", persisted: true }));
    const raw = localStorage.getItem("totp-storage");
    expect(raw).toBeTruthy();
    const stored = JSON.parse(raw as string);
    const labels = stored.state.accounts.map((a: { label: string }) => a.label);
    expect(labels).toEqual(["saved"]);
  });

  it("setPersisted(false) removes the account from storage", () => {
    useTotpStore.getState().addAccount(acct({ persisted: true }));
    const id = useTotpStore.getState().accounts[0].id;
    useTotpStore.getState().setPersisted(id, false);
    const stored = JSON.parse(localStorage.getItem("totp-storage") as string);
    expect(stored.state.accounts).toHaveLength(0);
  });
});
