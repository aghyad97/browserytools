import { describe, it, expect } from "vitest";
import {
  prepareFileForAirgap,
  parseAirgapPacket,
  compressBytes,
  decompressBytes,
  computeChecksum,
} from "@/lib/airgap-protocol";

describe("airgap-protocol", () => {
  it("compresses and decompresses byte buffers correctly", async () => {
    const text = "BrowseryTools AirQA fast airgap transfer protocol test string repeated many times ".repeat(20);
    const original = new TextEncoder().encode(text);
    const compressed = await compressBytes(original);
    expect(compressed.length).toBeLessThan(original.length);

    const decompressed = await decompressBytes(compressed);
    expect(new TextDecoder().decode(decompressed)).toBe(text);
  });

  it("splits a file into valid AG1 packets and parses them back", async () => {
    const content = "Confidential air-gapped payload ".repeat(50);
    const blob = new Blob([content], { type: "text/plain" });
    const file = new File([blob], "secret-document.txt", { type: "text/plain" });

    const { meta, packets } = await prepareFileForAirgap(file, 200);
    expect(packets.length).toBeGreaterThan(0);
    expect(meta.fileName).toBe("secret-document.txt");
    expect(meta.totalChunks).toBe(packets.length);

    const parsedPackets = packets.map((p) => parseAirgapPacket(p));
    for (const parsed of parsedPackets) {
      expect(parsed).not.toBeNull();
      expect(parsed?.fileName).toBe("secret-document.txt");
      expect(parsed?.totalChunks).toBe(packets.length);
    }

    // Reconstruct
    const sorted = [...parsedPackets].sort((a, b) => a!.chunkIdx - b!.chunkIdx);
    const totalLen = sorted.reduce((acc, p) => acc + p!.data.length, 0);
    const merged = new Uint8Array(totalLen);
    let offset = 0;
    for (const p of sorted) {
      merged.set(p!.data, offset);
      offset += p!.data.length;
    }

    const reconstructed = sorted[0]!.isCompressed ? await decompressBytes(merged) : merged;
    expect(new TextDecoder().decode(reconstructed)).toBe(content);
  });

  it("computes 8-character checksum correctly", async () => {
    const data = new Uint8Array([1, 2, 3, 4, 5]);
    const hash = await computeChecksum(data);
    expect(hash).toHaveLength(8);
  });
});
