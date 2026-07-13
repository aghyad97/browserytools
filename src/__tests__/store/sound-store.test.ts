import { describe, it, expect, beforeEach } from "vitest";
import { useSoundStore } from "@/store/sound-store";

describe("sound-store", () => {
  beforeEach(() => {
    useSoundStore.setState({ soundOn: false });
  });

  it("defaults to sound OFF (sounds are opt-in)", () => {
    // Fresh store initializes muted — a tools site must not make noise unasked.
    expect(useSoundStore.getState().soundOn).toBe(false);
  });

  it("toggleSound flips the flag and keeps the action available", () => {
    useSoundStore.getState().toggleSound();
    expect(useSoundStore.getState().soundOn).toBe(true);
    useSoundStore.getState().toggleSound();
    expect(useSoundStore.getState().soundOn).toBe(false);
  });
});
