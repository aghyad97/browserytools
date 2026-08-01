import { describe, it, expect } from "vitest";
import {
  ON_DEVICE_MODELS,
  totalBytesFor,
  type OnDeviceModelKey,
} from "@/lib/on-device-models";

describe("ON_DEVICE_MODELS registry", () => {
  const keys = Object.keys(ON_DEVICE_MODELS) as OnDeviceModelKey[];

  it("every entry has a non-empty webgpu and wasm file list with positive byte counts", () => {
    for (const key of keys) {
      const entry = ON_DEVICE_MODELS[key];
      expect(entry.webgpu.length, `${key} webgpu files`).toBeGreaterThan(0);
      expect(entry.wasm.length, `${key} wasm files`).toBeGreaterThan(0);
      for (const file of [...entry.webgpu, ...entry.wasm]) {
        expect(file.bytes, `${key}/${file.session}`).toBeGreaterThan(0);
      }
    }
  });

  it("every entry documents a real source URL (never a fabricated number)", () => {
    for (const key of keys) {
      expect(ON_DEVICE_MODELS[key].source).toMatch(/^https:\/\//);
    }
  });

  it("forceDevice entries have identical webgpu/wasm byte totals (device-independent)", () => {
    for (const key of keys) {
      const entry = ON_DEVICE_MODELS[key];
      if (!entry.forceDevice) continue;
      expect(totalBytesFor(key, "webgpu")).toBe(totalBytesFor(key, "wasm"));
    }
  });

  it("bg-removal (isnet_fp16, @imgly CDN) is registered with real, distinct webgpu/wasm sizes", () => {
    // Only the onnxruntime-web runtime differs by device here — the isnet_fp16
    // model itself is fixed, so webgpu (JSEP wasm build) should be strictly
    // larger than wasm (plain wasm build), never equal or smaller.
    const webgpu = totalBytesFor("bg-removal-isnet-fp16", "webgpu");
    const wasm = totalBytesFor("bg-removal-isnet-fp16", "wasm");
    expect(webgpu).toBeGreaterThan(wasm);
    expect(wasm).toBeGreaterThan(90_000_000); // model alone is ~88 MB
    expect(ON_DEVICE_MODELS["bg-removal-isnet-fp16"].source).toContain(
      "staticimgly.com",
    );
  });
});
