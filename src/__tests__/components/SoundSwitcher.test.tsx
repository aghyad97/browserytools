import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SoundSwitcher } from "@/components/sound-switcher";
import { useSoundStore } from "@/store/sound-store";

vi.mock("@/lib/ui-sound", () => ({ playCue: vi.fn() }));
import { playCue } from "@/lib/ui-sound";

describe("SoundSwitcher", () => {
  beforeEach(() => {
    useSoundStore.setState({ soundOn: false });
  });

  it("renders the 'Sound off' label when muted", () => {
    render(<SoundSwitcher />);
    expect(
      screen.getByRole("button", { name: "Sound off" }),
    ).toBeInTheDocument();
  });

  it("toggles the store and swaps the aria-label on click", async () => {
    const user = userEvent.setup();
    render(<SoundSwitcher />);

    await user.click(screen.getByRole("button", { name: "Sound off" }));

    expect(useSoundStore.getState().soundOn).toBe(true);
    expect(screen.getByRole("button", { name: "Sound on" })).toBeInTheDocument();
  });

  it("plays the toggle cue when turning sound ON (autoplay unlock gesture)", async () => {
    const user = userEvent.setup();
    render(<SoundSwitcher />);

    await user.click(screen.getByRole("button", { name: "Sound off" }));

    expect(playCue).toHaveBeenCalledWith("toggle");
  });

  it("plays no cue when turning sound OFF", async () => {
    const user = userEvent.setup();
    useSoundStore.setState({ soundOn: true });
    render(<SoundSwitcher />);

    await user.click(screen.getByRole("button", { name: "Sound on" }));

    expect(useSoundStore.getState().soundOn).toBe(false);
    expect(playCue).not.toHaveBeenCalled();
  });
});
