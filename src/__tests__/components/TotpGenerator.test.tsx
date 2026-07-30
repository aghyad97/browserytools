import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TotpGenerator from "@/components/TotpGenerator";
import { useTotpStore } from "@/store/totp-store";

vi.mock("@/lib/qr-decode", () => ({
  decodeQrFromImageFile: vi.fn(),
}));

beforeEach(() => {
  localStorage.clear();
  useTotpStore.setState({ accounts: [] });
});
afterEach(() => {
  vi.useRealTimers();
});

async function addManualAccount(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/account/i), "user@x.com");
  await user.type(screen.getByLabelText(/secret key/i), "JBSWY3DPEHPK3PXP");
  await user.click(screen.getByRole("button", { name: /^add$/i }));
}

describe("TotpGenerator", () => {
  it("shows the empty state and trust banner", () => {
    render(<TotpGenerator />);
    expect(screen.getByText(/no accounts yet/i)).toBeInTheDocument();
    expect(screen.getByText(/secrets never leave/i)).toBeInTheDocument();
  });

  it("adds a manual account and renders a live code", async () => {
    const user = userEvent.setup();
    render(<TotpGenerator />);
    await addManualAccount(user);
    expect(await screen.findByText("user@x.com")).toBeInTheDocument();
    // A 6-digit grouped code appears (e.g. "123 456").
    await waitFor(() =>
      expect(screen.getByText(/^\d{3} \d{3}$/)).toBeInTheDocument()
    );
    expect(useTotpStore.getState().accounts).toHaveLength(1);
    expect(useTotpStore.getState().accounts[0].persisted).toBe(false);
  });

  it("rejects an invalid base32 secret with an inline error", async () => {
    const user = userEvent.setup();
    render(<TotpGenerator />);
    await user.type(screen.getByLabelText(/account/i), "x");
    await user.type(screen.getByLabelText(/secret key/i), "not!!valid");
    await user.click(screen.getByRole("button", { name: /^add$/i }));
    expect(await screen.findByText(/isn't valid base32/i)).toBeInTheDocument();
    expect(useTotpStore.getState().accounts).toHaveLength(0);
  });

  it("adds an account from an otpauth URI via the URI tab", async () => {
    const user = userEvent.setup();
    render(<TotpGenerator />);
    await user.click(screen.getByRole("tab", { name: /otpauth link/i }));
    await user.type(
      screen.getByLabelText(/otpauth:\/\/ link/i),
      "otpauth://totp/GitHub:octocat?secret=JBSWY3DPEHPK3PXP&issuer=GitHub"
    );
    await user.click(screen.getByRole("button", { name: /^add$/i }));
    expect(await screen.findByText(/octocat/)).toBeInTheDocument();
    expect(useTotpStore.getState().accounts[0].issuer).toBe("GitHub");
  });

  it("shows migration-specific guidance for otpauth-migration URIs", async () => {
    const user = userEvent.setup();
    render(<TotpGenerator />);
    await user.click(screen.getByRole("tab", { name: /otpauth link/i }));
    await user.type(
      screen.getByLabelText(/otpauth:\/\/ link/i),
      "otpauth-migration://offline?data=abc"
    );
    await user.click(screen.getByRole("button", { name: /^add$/i }));
    expect(
      await screen.findByText(/export accounts one at a time/i)
    ).toBeInTheDocument();
  });

  it("copies the code to the clipboard", async () => {
    const user = userEvent.setup();
    render(<TotpGenerator />);
    await addManualAccount(user);
    await waitFor(() =>
      expect(screen.getByText(/^\d{3} \d{3}$/)).toBeInTheDocument()
    );
    const spy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    await user.click(screen.getByRole("button", { name: /copy/i }));
    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/^\d{6}$/));
  });

  it("persist toggle writes only that account to localStorage", async () => {
    const user = userEvent.setup();
    render(<TotpGenerator />);
    await addManualAccount(user);
    await user.click(screen.getByTestId("totp-persist-toggle"));
    const stored = JSON.parse(localStorage.getItem("totp-storage") as string);
    expect(stored.state.accounts).toHaveLength(1);
    await user.click(screen.getByTestId("totp-persist-toggle"));
    const stored2 = JSON.parse(localStorage.getItem("totp-storage") as string);
    expect(stored2.state.accounts).toHaveLength(0);
  });

  it("deletes an account after inline confirm", async () => {
    const user = userEvent.setup();
    render(<TotpGenerator />);
    await addManualAccount(user);
    await user.click(screen.getByRole("button", { name: /delete/i }));
    await user.click(screen.getByRole("button", { name: /confirm/i }));
    expect(useTotpStore.getState().accounts).toHaveLength(0);
    expect(screen.getByText(/no accounts yet/i)).toBeInTheDocument();
  });

  it("prompts on duplicate secret+label and can keep both", async () => {
    const user = userEvent.setup();
    render(<TotpGenerator />);
    await addManualAccount(user);
    await addManualAccount(user);
    expect(await screen.findByText(/already exists/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /keep both/i }));
    expect(useTotpStore.getState().accounts).toHaveLength(2);
  });
});
