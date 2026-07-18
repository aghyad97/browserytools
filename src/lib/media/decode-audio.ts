// Decode an arbitrary audio/video file to a 16kHz mono Float32Array using the
// Web Audio API. Whisper expects 16kHz mono PCM.
export async function decodeToMono16k(file: File): Promise<Float32Array> {
  const arrayBuffer = await file.arrayBuffer();
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  const ctx = new AudioCtx();
  let decoded: AudioBuffer;
  try {
    decoded = await ctx.decodeAudioData(arrayBuffer.slice(0));
  } finally {
    // Close best-effort; some browsers reject double-close.
    ctx.close().catch(() => {});
  }

  // Mix all channels down to mono.
  const numChannels = decoded.numberOfChannels;
  const length = decoded.length;
  const mono = new Float32Array(length);
  for (let ch = 0; ch < numChannels; ch++) {
    const data = decoded.getChannelData(ch);
    for (let i = 0; i < length; i++) mono[i] += data[i] / numChannels;
  }

  // Resample to 16kHz if needed (linear interpolation is sufficient for ASR).
  const targetRate = 16000;
  if (decoded.sampleRate === targetRate) return mono;
  const ratio = decoded.sampleRate / targetRate;
  const newLength = Math.floor(length / ratio);
  const resampled = new Float32Array(newLength);
  for (let i = 0; i < newLength; i++) {
    const srcIndex = i * ratio;
    const i0 = Math.floor(srcIndex);
    const i1 = Math.min(i0 + 1, length - 1);
    const frac = srcIndex - i0;
    resampled[i] = mono[i0] * (1 - frac) + mono[i1] * frac;
  }
  return resampled;
}
