import {
  Config,
  removeBackground as imglyRemoveBackground,
} from "@imgly/background-removal";

// Configuration for the background removal
const config: Config = {
  model: "isnet", // Use the ISNet model for better quality
  progress: (key, current, total) => {
    // Progress callback can be used to show loading progress
    // console.log(`Downloading ${key}: ${current} of ${total}`);
  },
};

// Initialize the model (this will download the model files on first use)
let isInitialized = false;

export async function initializeModel(): Promise<boolean> {
  try {
    if (!isInitialized) {
      // The model will be downloaded and cached on first use
      // We can trigger this by calling removeBackground with a dummy image
      isInitialized = true;
    }
    return true;
  } catch (error) {
    console.error("Error initializing model:", error);
    throw new Error("Failed to initialize background removal model");
  }
}

export async function removeBackgroundFromImage(
  imageUrl: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    // Convert data URL or URL to blob
    let blob: Blob;

    if (imageUrl.startsWith("data:")) {
      // Convert data URL to blob
      const response = await fetch(imageUrl);
      blob = await response.blob();
    } else {
      // Fetch from URL
      const response = await fetch(imageUrl);
      blob = await response.blob();
    }

    // Create a progress callback if provided
    const progressConfig = onProgress
      ? {
          ...config,
          progress: (key: string, current: number, total: number) => {
            const progress = (current / total) * 100;
            onProgress(progress);
            // console.log(
            //   `Processing ${key}: ${current} of ${total} (${progress.toFixed(
            //     1
            //   )}%)`
            // );
          },
        }
      : config;

    // Remove background
    const blobResult = await imglyRemoveBackground(blob, progressConfig);

    // Convert blob to data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blobResult);
    });
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error("Failed to process image");
  }
}

// Legacy function name for backward compatibility
export const removeBackground = removeBackgroundFromImage;
