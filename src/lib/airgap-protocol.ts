/**
 * Airgap QR Data Streaming Protocol.
 * Each packet carries a CRC32 so a camera-decoded but damaged QR frame is
 * rejected instead of silently corrupting the reconstructed file.
 */

export interface AirgapMeta {
  fileId: string;
  fileName: string;
  fileSize: number;
  compressedSize: number;
  totalChunks: number;
  chunkSize: number;
  checksum: string;
}

export interface AirgapPacket {
  version: "AG1";
  fileId: string;
  chunkIdx: number;
  totalChunks: number;
  fileSize: number;
  fileName: string;
  dataBase64: string;
}

export function crc32(bytes: Uint8Array): string {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, "0");
}

export async function compressBytes(data: Uint8Array): Promise<Uint8Array> {
  if (typeof CompressionStream === "undefined") return data;
  try {
    const stream = new Response(
      new Blob([data.buffer as ArrayBuffer]).stream().pipeThrough(new CompressionStream("gzip")),
    );
    return new Uint8Array(await stream.arrayBuffer());
  } catch (err) {
    console.warn("Compression failed, using uncompressed:", err);
    return data;
  }
}

export async function decompressBytes(data: Uint8Array): Promise<Uint8Array> {
  if (typeof DecompressionStream === "undefined") return data;
  try {
    const stream = new Response(
      new Blob([data.buffer as ArrayBuffer]).stream().pipeThrough(new DecompressionStream("gzip")),
    );
    return new Uint8Array(await stream.arrayBuffer());
  } catch (err) {
    console.warn("Decompression failed, returning raw bytes:", err);
    return data;
  }
}

export async function computeChecksum(data: Uint8Array): Promise<string> {
  if (typeof crypto === "undefined" || !crypto.subtle) return "00000000";
  const hashBuffer = await crypto.subtle.digest("SHA-256", data.buffer as ArrayBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 8);
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + 0x8000)));
  }
  return btoa(binary);
}

export function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function prepareFileForAirgap(
  file: File,
  chunkSize: number = 450,
): Promise<{ meta: AirgapMeta; packets: string[] }> {
  const rawBytes = new Uint8Array(await file.arrayBuffer());
  const checksum = await computeChecksum(rawBytes);
  const compressed = await compressBytes(rawBytes);
  const isCompressed = compressed.length < rawBytes.length;
  const payload = isCompressed ? compressed : rawBytes;
  const totalChunks = Math.max(1, Math.ceil(payload.length / chunkSize));
  const fileId = Math.random().toString(36).substring(2, 8);
  const meta: AirgapMeta = {
    fileId,
    fileName: file.name,
    fileSize: file.size,
    compressedSize: payload.length,
    totalChunks,
    chunkSize,
    checksum,
  };
  const safeFileName = encodeURIComponent(file.name);
  const packets: string[] = [];
  for (let i = 0; i < totalChunks; i++) {
    const chunk = payload.subarray(i * chunkSize, Math.min((i + 1) * chunkSize, payload.length));
    const flags = isCompressed ? "z" : "r";
    // AG1|id|index|total|fileSize|filename|flags|fileChecksum|chunkCrc|payload
    packets.push(
      `AG1|${fileId}|${i}|${totalChunks}|${file.size}|${safeFileName}|${flags}|${checksum}|${crc32(chunk)}|${bytesToBase64(chunk)}`,
    );
  }
  return { meta, packets };
}

export interface ParsedPacket {
  version: "AG1";
  fileId: string;
  chunkIdx: number;
  totalChunks: number;
  fileSize: number;
  fileName: string;
  isCompressed: boolean;
  checksum: string;
  data: Uint8Array;
}

export function parseAirgapPacket(raw: string): ParsedPacket | null {
  if (!raw.startsWith("AG1|")) return null;
  const parts = raw.split("|");
  // Reject the old 8-field packet format; it had no corruption detection.
  if (parts.length < 10) return null;
  const [, fileId, chunkIdxStr, totalChunksStr, fileSizeStr, safeFileName, flags, checksum, expectedCrc, b64] = parts;
  const chunkIdx = parseInt(chunkIdxStr, 10);
  const totalChunks = parseInt(totalChunksStr, 10);
  const fileSize = parseInt(fileSizeStr, 10);
  if (!Number.isInteger(chunkIdx) || chunkIdx < 0 || !Number.isInteger(totalChunks) || totalChunks < 1 ||
      chunkIdx >= totalChunks || !Number.isInteger(fileSize) || fileSize < 0 || !/^[0-9a-f]{8}$/i.test(checksum) ||
      !/^[0-9a-f]{8}$/i.test(expectedCrc)) return null;
  try {
    const data = base64ToBytes(b64);
    if (crc32(data).toLowerCase() !== expectedCrc.toLowerCase()) return null;
    return {
      version: "AG1", fileId, chunkIdx, totalChunks, fileSize,
      fileName: decodeURIComponent(safeFileName), isCompressed: flags === "z", checksum, data,
    };
  } catch {
    return null;
  }
}
