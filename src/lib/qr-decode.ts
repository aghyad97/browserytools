/**
 * Decode a QR code from an image file, fully client-side.
 * jsqr is dynamically imported — only users of the QR tab pay for it.
 */
export async function decodeQrFromImageFile(file: File): Promise<string | null> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("image-decode-failed");
  }
  try {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("image-decode-failed");
    ctx.drawImage(bitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { default: jsQR } = await import("jsqr");
    const result = jsQR(imageData.data, imageData.width, imageData.height);
    return result?.data ?? null;
  } finally {
    bitmap.close?.();
  }
}
