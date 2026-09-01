/**
 * Airgap QR Data Streaming Protocol
 *
 * Designed for screen-to-camera transmission without network connectivity.
 * Features:
 * - Chunking & optional Gzip compression via browser standard CompressionStream / DecompressionStream
 * - Sequential packet carousel with frame indexing and SHA-256 integrity check
 * - Compact base64 packet framing: "AG1|<fileId>|<chunkIdx>|<totalChunks>|<fileSize>|<fileName>|<flags>|<base64Chunk>"
 */

export interface AirgapMeta {
  fileId: string;
  fileName: string;
  fileSize: number;
  compressedSize: number;
  totalChunks: number;
  chunkSize: number;
  checksum: string; // First 8 hex chars of SHA-256
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

// Compress data with gzip using Web Streams API
export async function compressBytes(data: Uint8Array): Promise<Uint8Array> {
  if (typeof CompressionStream === "undefined") {
    return data; // Fallback if not supported
  }
  try {
    const stream = new Response(
      new Blob([data.buffer as ArrayBuffer]).stream().pipeThrough(new CompressionStream("gzip"))
    );
    const buffer = await stream.arrayBuffer();
    return new Uint8Array(buffer);
  } catch (err) {
    console.warn("Compression failed, using uncompressed:", err);
    return data;
  }
}

// Decompress gzip data using Web Streams API
export async function decompressBytes(data: Uint8Array): Promise<Uint8Array> {
  if (typeof DecompressionStream === "undefined") {
    return data;
  }
  try {
    const stream = new Response(
      new Blob([data.buffer as ArrayBuffer]).stream().pipeThrough(new DecompressionStream("gzip"))
    );
    const buffer = await stream.arrayBuffer();
    return new Uint8Array(buffer);
  } catch (err) {
    console.warn("Decompression failed, returning raw bytes:", err);
    return data;
  }
}

// Compute SHA-256 short hash
export async function computeChecksum(data: Uint8Array): Promise<string> {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    return "00000000";
  }
  const hashBuffer = await crypto.subtle.digest("SHA-256", data.buffer as ArrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 8);
}

// Convert bytes to base64 safely
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const len = bytes.byteLength;
  const chunkSize = 0x8000;
  for (let i = 0; i < len; i += chunkSize) {
    const sub = bytes.subarray(i, Math.min(i + chunkSize, len));
    binary += String.fromCharCode.apply(null, Array.from(sub));
  }
  return btoa(binary);
}

// Convert base64 to bytes safely
export function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Prepare file chunks for transmission
export async function prepareFileForAirgap(
  file: File,
  chunkSize: number = 450
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

  const packets: string[] = [];
  const safeFileName = encodeURIComponent(file.name);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, payload.length);
    const chunkBytes = payload.subarray(start, end);
    const b64 = bytesToBase64(chunkBytes);

    // Format: AG1|fileId|chunkIdx|totalChunks|fileSize|safeFileName|flags|b64
    const flags = isCompressed ? "z" : "r";
    const packet = `AG1|${fileId}|${i}|${totalChunks}|${file.size}|${safeFileName}|${flags}|${b64}`;
    packets.push(packet);
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
  data: Uint8Array;
}

// Parse an incoming QR string
export function parseAirgapPacket(raw: string): ParsedPacket | null {
  if (!raw.startsWith("AG1|")) return null;
  const parts = raw.split("|");
  if (parts.length < 8) return null;

  const [, fileId, chunkIdxStr, totalChunksStr, fileSizeStr, safeFileName, flags, b64] = parts;
  const chunkIdx = parseInt(chunkIdxStr, 10);
  const totalChunks = parseInt(totalChunksStr, 10);
  const fileSize = parseInt(fileSizeStr, 10);
  const fileName = decodeURIComponent(safeFileName);
  const isCompressed = flags === "z";

  if (isNaN(chunkIdx) || isNaN(totalChunks) || isNaN(fileSize)) {
    return null;
  }

  try {
    const data = base64ToBytes(b64);
    return {
      version: "AG1",
      fileId,
      chunkIdx,
      totalChunks,
      fileSize,
      fileName,
      isCompressed,
      data,
    };
  } catch (err) {
    console.error("Failed to decode packet payload:", err);
    return null;
  }
}
