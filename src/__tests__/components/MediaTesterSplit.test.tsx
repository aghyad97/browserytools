import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import MicTester from "@/components/MicTester";
import WebcamTester from "@/components/WebcamTester";
import MicCameraTester from "@/components/MicCameraTester";

// Fake device list: one camera + one microphone.
const FAKE_DEVICES = [
  { deviceId: "cam-1", kind: "videoinput", label: "FaceTime HD Camera" },
  { deviceId: "mic-1", kind: "audioinput", label: "MacBook Pro Microphone" },
];

// Light AudioContext shim — panels touch it only when a preview starts, but
// keep it present so nothing throws if metering is exercised.
class MockAudioContext {
  createAnalyser = vi.fn().mockReturnValue({
    fftSize: 0,
    smoothingTimeConstant: 0,
    minDecibels: 0,
    maxDecibels: 0,
    connect: vi.fn(),
    disconnect: vi.fn(),
    getFloatTimeDomainData: vi.fn(),
  });
  createMediaStreamSource = vi
    .fn()
    .mockReturnValue({ connect: vi.fn(), disconnect: vi.fn() });
  close = vi.fn().mockResolvedValue(undefined);
}

beforeEach(() => {
  // @ts-expect-error test shim
  global.AudioContext = MockAudioContext;
  // happy-dom's video element has no play(); stub it.
  Object.defineProperty(HTMLMediaElement.prototype, "play", {
    configurable: true,
    value: vi.fn().mockResolvedValue(undefined),
  });
  navigator.mediaDevices.enumerateDevices = vi
    .fn()
    .mockResolvedValue(FAKE_DEVICES);
  navigator.mediaDevices.getUserMedia = vi.fn().mockResolvedValue({
    getTracks: () => [{ stop: vi.fn() }],
  });
  navigator.mediaDevices.addEventListener = vi.fn();
  navigator.mediaDevices.removeEventListener = vi.fn();
});

describe("Media tester split", () => {
  it("MicTester renders the mic select and level meter, but no video element", async () => {
    const { container } = render(<MicTester />);
    await waitFor(() => {
      expect(container.querySelector("#mct-mic")).not.toBeNull();
    });
    expect(screen.getByText("Mic Level")).toBeInTheDocument();
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("#mct-camera")).toBeNull();
  });

  it("WebcamTester renders the video preview, but no mic select or level meter", async () => {
    const { container } = render(<WebcamTester />);
    await waitFor(() => {
      expect(container.querySelector("#mct-camera")).not.toBeNull();
    });
    expect(container.querySelector("video")).not.toBeNull();
    expect(container.querySelector("#mct-mic")).toBeNull();
    expect(screen.queryByText("Mic Level")).not.toBeInTheDocument();
  });

  it("MicCameraTester renders both panels — camera select, mic select, video and level meter", async () => {
    const { container } = render(<MicCameraTester />);
    await waitFor(() => {
      expect(container.querySelector("#mct-camera")).not.toBeNull();
    });
    expect(container.querySelector("#mct-mic")).not.toBeNull();
    expect(container.querySelector("video")).not.toBeNull();
    expect(screen.getByText("Mic Level")).toBeInTheDocument();
  });
});
