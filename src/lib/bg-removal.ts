import {
  env,
  AutoModel,
  AutoProcessor,
  RawImage,
  PreTrainedModel,
  Processor,
} from "@huggingface/transformers";

const WEBGPU_MODEL_ID = "Xenova/modnet";
const FALLBACK_MODEL_ID = "briaai/RMBG-1.4";

interface ModelState {
  model: PreTrainedModel | null;
  processor: Processor | null;
  isWebGPUSupported: boolean;
  currentModelId: string;
  isIOS: boolean;
}

const state: ModelState = {
  model: null,
  processor: null,
  isWebGPUSupported: false,
  currentModelId: FALLBACK_MODEL_ID,
  isIOS: isIOS(),
};

function isIOS() {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
}

export async function initializeModel() {
  try {
    // Always use RMBG-1.4 for iOS
    if (state.isIOS) {
      env.allowLocalModels = false;
      if (env.backends?.onnx?.wasm) {
        env.backends.onnx.wasm.proxy = true;
      }

      state.model = await AutoModel.from_pretrained(FALLBACK_MODEL_ID);
      state.processor = await AutoProcessor.from_pretrained(
        FALLBACK_MODEL_ID,
        {}
      );
      state.currentModelId = FALLBACK_MODEL_ID;
      return true;
    }

    // Try WebGPU first
    if ((navigator as any).gpu) {
      try {
        env.allowLocalModels = false;
        if (env.backends?.onnx?.wasm) {
          env.backends.onnx.wasm.proxy = false;
        }

        state.model = await AutoModel.from_pretrained(WEBGPU_MODEL_ID, {
          device: "webgpu",
        });
        state.processor = await AutoProcessor.from_pretrained(
          WEBGPU_MODEL_ID,
          {}
        );
        state.isWebGPUSupported = true;
        state.currentModelId = WEBGPU_MODEL_ID;
        return true;
      } catch (error) {
        console.warn("WebGPU initialization failed, falling back to WASM");
      }
    }

    // Fallback to WASM
    env.allowLocalModels = false;
    if (env.backends?.onnx?.wasm) {
      env.backends.onnx.wasm.proxy = true;
    }

    state.model = await AutoModel.from_pretrained(FALLBACK_MODEL_ID);
    state.processor = await AutoProcessor.from_pretrained(
      FALLBACK_MODEL_ID,
      {}
    );
    state.currentModelId = FALLBACK_MODEL_ID;
    return true;
  } catch (error) {
    console.error("Error initializing model:", error);
    throw new Error("Failed to initialize background removal model");
  }
}

export async function removeBackground(imageUrl: string): Promise<string> {
  if (!state.model || !state.processor) {
    throw new Error("Model not initialized. Call initializeModel() first.");
  }

  try {
    const img = await RawImage.fromURL(imageUrl);

    // Pre-process image
    const { pixel_values } = await state.processor(img);

    // Predict alpha matte
    const { output } = await state.model({ input: pixel_values });

    // Resize mask back to original size
    const maskData = (
      await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(
        img.width,
        img.height
      )
    ).data;

    // Create new canvas
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2d context");

    // Draw original image
    ctx.drawImage(img.toCanvas(), 0, 0);

    // Update alpha channel
    const pixelData = ctx.getImageData(0, 0, img.width, img.height);
    for (let i = 0; i < maskData.length; ++i) {
      pixelData.data[4 * i + 3] = maskData[i];
    }
    ctx.putImageData(pixelData, 0, 0);

    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error("Failed to process image");
  }
}
