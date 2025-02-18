export async function preprocessImage(
  url: string,
  width: number,
  height: number
) {
  const img = await loadImage(url);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = new Float32Array(width * height * 3);

  // Normalize and arrange data for model
  for (let i = 0; i < imageData.data.length; i += 4) {
    data[(i / 4) * 3] = imageData.data[i] / 255.0; // R
    data[(i / 4) * 3 + 1] = imageData.data[i + 1] / 255.0; // G
    data[(i / 4) * 3 + 2] = imageData.data[i + 2] / 255.0; // B
  }

  return { data, width, height };
}

export async function postprocessMask(originalUrl: string, mask: Float32Array) {
  const img = await loadImage(originalUrl);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Upscale mask to original image size
  const upscaledMask = await upscaleMask(mask, img.width, img.height);

  // Apply mask
  for (let i = 0; i < imageData.data.length; i += 4) {
    const alpha = upscaledMask[i / 4] * 255;
    imageData.data[i + 3] = alpha > 128 ? 255 : 0; // Binary threshold
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function upscaleMask(mask: Float32Array, width: number, height: number) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = 320;
  canvas.height = 320;

  // Convert mask to ImageData
  const maskImageData = ctx.createImageData(320, 320);
  for (let i = 0; i < mask.length; i++) {
    const value = mask[i] * 255;
    maskImageData.data[i * 4] = value;
    maskImageData.data[i * 4 + 1] = value;
    maskImageData.data[i * 4 + 2] = value;
    maskImageData.data[i * 4 + 3] = 255;
  }

  ctx.putImageData(maskImageData, 0, 0);

  // Upscale using canvas
  const upscaledCanvas = document.createElement("canvas");
  const upCtx = upscaledCanvas.getContext("2d")!;

  upscaledCanvas.width = width;
  upscaledCanvas.height = height;
  upCtx.drawImage(canvas, 0, 0, width, height);

  const upscaledData = upCtx.getImageData(0, 0, width, height);
  return new Float32Array(
    upscaledData.data.filter((_, i) => i % 4 === 0).map((x) => x / 255)
  );
}
