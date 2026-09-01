"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import QRCode from "qrcode";
import {
  Camera,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Play,
  Square,
  RefreshCw,
  Download,
  Maximize2,
  Minimize2,
  Send,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToolShell } from "@/components/template/tool-shell";
import { ModePicker } from "@/components/shared/ModePicker";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { StatStrip } from "@/components/shared/StatStrip";
import { SliderRow } from "@/components/shared/SliderRow";
import { OptionRow, SettingsCard } from "@/components/shared/SettingsCard";
import { downloadBlob } from "@/lib/download";
import {
  prepareFileForAirgap,
  parseAirgapPacket,
  decompressBytes,
  type AirgapMeta,
} from "@/lib/airgap-protocol";

type TransferMode = "send" | "receive" | "pair";

export default function AirgapTransfer() {
  const [mode, setMode] = useState<TransferMode>("send");

  // --- Sender State ---
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<AirgapMeta | null>(null);
  const [packets, setPackets] = useState<string[]>([]);
  const [currentPacketIdx, setCurrentPacketIdx] = useState<number>(0);
  const [isSending, setIsSending] = useState(false);
  const [fps, setFps] = useState<number>(10);
  const [chunkSize, setChunkSize] = useState<number>(450);
  const [senderDataUrl, setSenderDataUrl] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // --- Receiver State ---
  const [isReceiving, setIsReceiving] = useState(false);
  const [receivedChunks, setReceivedChunks] = useState<Map<number, Uint8Array>>(new Map());
  const [incomingMeta, setIncomingMeta] = useState<{
    fileId: string;
    fileName: string;
    fileSize: number;
    totalChunks: number;
    isCompressed: boolean;
  } | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [completedBlob, setCompletedBlob] = useState<{ blob: Blob; fileName: string } | null>(null);

  // Telemetry metrics
  const [startTime, setStartTime] = useState<number | null>(null);
  const [lastScanTime, setLastScanTime] = useState<number | null>(null);
  const [instantSpeedKBps, setInstantSpeedKBps] = useState<number>(0);

  // Pairing QR
  const [pairUrlQr, setPairUrlQr] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanLoopRef = useRef<number | null>(null);
  const senderIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate pairing QR (direct link to receive mode)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}${window.location.pathname}#receive`;
      QRCode.toDataURL(url, { width: 220, margin: 1, errorCorrectionLevel: "M" })
        .then(setPairUrlQr)
        .catch(console.error);
    }
  }, []);

  // Hash route listener (#receive opens receiver mode)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#receive") {
      setMode("receive");
    }
  }, []);

  // Prepare sender file
  const handleFileSelect = async (files: File[]) => {
    if (!files.length) return;
    const selected = files[0];
    setFile(selected);
    try {
      const prep = await prepareFileForAirgap(selected, chunkSize);
      setMeta(prep.meta);
      setPackets(prep.packets);
      setCurrentPacketIdx(0);
      setIsSending(false);

      if (prep.packets.length > 0) {
        const url = await QRCode.toDataURL(prep.packets[0], {
          width: 380,
          margin: 1,
          errorCorrectionLevel: "L",
        });
        setSenderDataUrl(url);
      }
    } catch (err) {
      console.error("Failed to prepare file:", err);
    }
  };

  // Sender stream loop
  useEffect(() => {
    if (!isSending || packets.length === 0) {
      if (senderIntervalRef.current) clearInterval(senderIntervalRef.current);
      return;
    }

    let idx = currentPacketIdx;
    const intervalMs = Math.max(40, Math.floor(1000 / fps));

    senderIntervalRef.current = setInterval(async () => {
      idx = (idx + 1) % packets.length;
      setCurrentPacketIdx(idx);
      try {
        const url = await QRCode.toDataURL(packets[idx], {
          width: 380,
          margin: 1,
          errorCorrectionLevel: "L",
        });
        setSenderDataUrl(url);
      } catch (err) {
        console.error("QR render error:", err);
      }
    }, intervalMs);

    return () => {
      if (senderIntervalRef.current) clearInterval(senderIntervalRef.current);
    };
  }, [isSending, packets, fps, currentPacketIdx]);

  // Start / Stop Camera Receiver
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsReceiving(true);
      setStartTime(Date.now());
      setLastScanTime(Date.now());
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setCameraError(err?.message || "Camera permission denied or camera not found");
    }
  };

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    if (scanLoopRef.current) {
      cancelAnimationFrame(scanLoopRef.current);
      scanLoopRef.current = null;
    }
    setIsReceiving(false);
  }, [cameraStream]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      if (scanLoopRef.current) {
        cancelAnimationFrame(scanLoopRef.current);
      }
      if (senderIntervalRef.current) {
        clearInterval(senderIntervalRef.current);
      }
    };
  }, [cameraStream]);

  // QR Scanning Loop using jsQR
  useEffect(() => {
    if (!isReceiving || !videoRef.current || !cameraStream) return;

    let active = true;

    const scanFrame = async () => {
      if (!active) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && video.readyState === video.HAVE_ENOUGH_DATA && canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          try {
            const { default: jsQR } = await import("jsqr");
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            });

            if (code && code.data.startsWith("AG1|")) {
              const packet = parseAirgapPacket(code.data);
              if (packet) {
                setIncomingMeta((prev) => {
                  if (!prev || prev.fileId !== packet.fileId) {
                    // Reset chunks for new file stream
                    setReceivedChunks(new Map([[packet.chunkIdx, packet.data]]));
                    return {
                      fileId: packet.fileId,
                      fileName: packet.fileName,
                      fileSize: packet.fileSize,
                      totalChunks: packet.totalChunks,
                      isCompressed: packet.isCompressed,
                    };
                  }
                  return prev;
                });

                setReceivedChunks((prevMap) => {
                  if (prevMap.has(packet.chunkIdx)) return prevMap;
                  const newMap = new Map(prevMap);
                  newMap.set(packet.chunkIdx, packet.data);

                  // Update telemetry metrics
                  const now = Date.now();
                  setLastScanTime((last) => {
                    if (last && now > last) {
                      const deltaSec = (now - last) / 1000;
                      if (deltaSec > 0.05) {
                        const speed = packet.data.length / 1024 / deltaSec;
                        setInstantSpeedKBps(parseFloat(speed.toFixed(1)));
                      }
                    }
                    return now;
                  });

                  return newMap;
                });
              }
            }
          } catch (err) {
            console.error("Scanner frame error:", err);
          }
        }
      }

      if (active) {
        scanLoopRef.current = requestAnimationFrame(scanFrame);
      }
    };

    scanLoopRef.current = requestAnimationFrame(scanFrame);

    return () => {
      active = false;
      if (scanLoopRef.current) {
        cancelAnimationFrame(scanLoopRef.current);
      }
    };
  }, [isReceiving, cameraStream]);

  // Assembly and Auto-Download on Complete
  useEffect(() => {
    if (!incomingMeta) return;
    if (receivedChunks.size >= incomingMeta.totalChunks && incomingMeta.totalChunks > 0) {
      const assembleAndComplete = async () => {
        const sortedIndices = Array.from({ length: incomingMeta.totalChunks }, (_, i) => i);
        let totalLen = 0;
        for (const idx of sortedIndices) {
          const chunk = receivedChunks.get(idx);
          if (chunk) totalLen += chunk.length;
        }

        const merged = new Uint8Array(totalLen);
        let offset = 0;
        for (const idx of sortedIndices) {
          const chunk = receivedChunks.get(idx);
          if (chunk) {
            merged.set(chunk, offset);
            offset += chunk.length;
          }
        }

        let finalBytes: Uint8Array = merged;
        if (incomingMeta.isCompressed) {
          finalBytes = await decompressBytes(merged);
        }

        const blob = new Blob([finalBytes.buffer as ArrayBuffer]);
        setCompletedBlob({ blob, fileName: incomingMeta.fileName });
        downloadBlob(blob, incomingMeta.fileName);
        stopCamera();
      };

      assembleAndComplete();
    }
  }, [receivedChunks, incomingMeta, stopCamera]);

  // Estimated Time Remaining calculation
  const receiverProgress = useMemo(() => {
    if (!incomingMeta || incomingMeta.totalChunks === 0) return 0;
    return Math.min(100, Math.round((receivedChunks.size / incomingMeta.totalChunks) * 100));
  }, [receivedChunks.size, incomingMeta]);

  const etaSeconds = useMemo(() => {
    if (!incomingMeta || receivedChunks.size === 0 || !startTime) return null;
    const elapsed = (Date.now() - startTime) / 1000;
    const rate = receivedChunks.size / Math.max(1, elapsed);
    const remainingChunks = incomingMeta.totalChunks - receivedChunks.size;
    if (remainingChunks <= 0) return 0;
    return Math.ceil(remainingChunks / Math.max(0.1, rate));
  }, [incomingMeta, receivedChunks.size, startTime]);

  return (
    <ToolShell
      slug="airgap-transfer"
      title="Airgap QR File Transfer"
      sub="Stream files securely between offline devices over animated QR codes — zero network, zero radio."
    >
      <div className="space-y-6">
        {/* Mode Switcher in Stage Header */}
        <ModePicker
          options={[
            { value: "send", label: "Sender (Stream)" },
            { value: "receive", label: "Receiver (Camera)" },
            { value: "pair", label: "Pair Device" },
          ]}
          value={mode}
          onChange={(val) => {
            setMode(val);
            if (val !== "receive") stopCamera();
          }}
          aria-label="Transfer Mode"
        />

        {/* ================= SENDER MODE ================= */}
        {mode === "send" && (
          <div className="grid gap-6 md:grid-cols-12">
            <div className="space-y-4 md:col-span-5">
              <FileDropzone
                onFiles={handleFileSelect}
                title="Drop file to transmit"
                subtitle="Files are compressed and streamed optically"
              />

              {meta && (
                <StatStrip
                  items={[
                    {
                      label: "Original Size",
                      value: `${(meta.fileSize / 1024).toFixed(1)} KB`,
                    },
                    {
                      label: "Compressed",
                      value: `${(meta.compressedSize / 1024).toFixed(1)} KB`,
                      sub: `${Math.round((1 - meta.compressedSize / meta.fileSize) * 100)}% saved`,
                    },
                    {
                      label: "Packets",
                      value: `${meta.totalChunks}`,
                    },
                  ]}
                />
              )}

              <SettingsCard title="Stream Transmission">
                <SliderRow
                  label="Frames / Sec"
                  value={fps}
                  min={2}
                  max={25}
                  step={1}
                  display={`${fps} FPS`}
                  onChange={setFps}
                />
                <OptionRow
                  label="Chunk Density"
                  hint="Larger chunks increase speed but require a clear camera focus."
                  htmlFor="chunk-density-select"
                >
                  <Select
                    value={String(chunkSize)}
                    onValueChange={(val) => {
                      const sz = parseInt(val, 10);
                      setChunkSize(sz);
                      if (file) handleFileSelect([file]);
                    }}
                  >
                    <SelectTrigger id="chunk-density-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="250">Low Density (250B - Best for low-res cameras)</SelectItem>
                      <SelectItem value="450">Medium Density (450B - Recommended)</SelectItem>
                      <SelectItem value="800">High Density (800B - High speed)</SelectItem>
                    </SelectContent>
                  </Select>
                </OptionRow>
              </SettingsCard>
            </div>

            <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-6 md:col-span-7">
              {senderDataUrl ? (
                <div className="flex flex-col items-center space-y-4">
                  <div
                    className={`relative flex items-center justify-center rounded-lg border-2 border-primary/20 bg-white p-4 shadow-sm ${
                      isFullscreen ? "fixed inset-0 z-50 flex-col bg-white p-8" : ""
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={senderDataUrl}
                      alt="Airgap QR Frame"
                      className={isFullscreen ? "max-h-[80vh] w-auto" : "h-64 w-64 md:h-80 md:w-80"}
                    />
                    {isFullscreen && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="mt-4"
                        onClick={() => setIsFullscreen(false)}
                      >
                        <Minimize2 className="mr-2 h-4 w-4" /> Exit Fullscreen
                      </Button>
                    )}
                  </div>

                  <div className="w-full max-w-sm space-y-2">
                    <div className="flex justify-between text-xs font-mono text-muted-foreground">
                      <span>
                        Packet: {currentPacketIdx + 1} / {packets.length}
                      </span>
                      <span>{fps} FPS (~{((chunkSize * fps) / 1024).toFixed(1)} KB/s)</span>
                    </div>
                    <Progress
                      value={((currentPacketIdx + 1) / Math.max(1, packets.length)) * 100}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => setIsSending(!isSending)}
                      variant={isSending ? "destructive" : "default"}
                    >
                      {isSending ? (
                        <>
                          <Square className="mr-2 h-4 w-4" /> Pause Loop
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" /> Start Streaming
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      title="Fullscreen QR"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                  <QrCode className="mb-3 h-16 w-16 opacity-30" />
                  <p className="text-sm">Select a file above to generate the QR optical stream.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= RECEIVER MODE ================= */}
        {mode === "receive" && (
          <div className="grid gap-6 md:grid-cols-12">
            <div className="space-y-4 md:col-span-7">
              <div className="relative overflow-hidden rounded-xl border bg-black shadow-inner">
                <video
                  ref={videoRef}
                  className="h-72 w-full object-cover md:h-96"
                  muted
                  playsInline
                  autoPlay
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Overlay target frame */}
                {isReceiving && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-8">
                    <div className="h-48 w-48 rounded-lg border-2 border-dashed border-primary/70 bg-primary/5 animate-pulse" />
                  </div>
                )}

                {!isReceiving && !cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 p-4 text-center text-white">
                    <Camera className="mb-3 h-12 w-12 opacity-60" />
                    <p className="mb-4 text-sm">Point your camera at the sender's screen.</p>
                    <Button onClick={startCamera}>
                      <Camera className="mr-2 h-4 w-4" /> Open Camera & Scan
                    </Button>
                  </div>
                )}

                {cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/20 p-4 text-center">
                    <AlertCircle className="mb-2 h-8 w-8 text-destructive" />
                    <p className="text-sm font-medium text-destructive">{cameraError}</p>
                    <Button className="mt-4" variant="outline" onClick={startCamera}>
                      <RefreshCw className="mr-2 h-4 w-4" /> Retry Camera
                    </Button>
                  </div>
                )}
              </div>

              {isReceiving && (
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={stopCamera}>
                    <Square className="mr-2 h-4 w-4" /> Stop Camera
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4 md:col-span-5">
              <div className="rounded-xl border bg-card p-5">
                <h3 className="mb-3 font-semibold">Incoming Transmission</h3>
                {incomingMeta ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm font-medium">
                        <span className="truncate">{incomingMeta.fileName}</span>
                        <Badge variant="secondary">
                          {(incomingMeta.fileSize / 1024).toFixed(1)} KB
                        </Badge>
                      </div>
                      <Progress value={receiverProgress} className="mt-2" />
                    </div>

                    <StatStrip
                      items={[
                        {
                          label: "Progress",
                          value: `${receiverProgress}%`,
                          sub: `${receivedChunks.size} / ${incomingMeta.totalChunks} pkts`,
                        },
                        {
                          label: "Speed",
                          value: `${instantSpeedKBps} KB/s`,
                        },
                        {
                          label: "Time Left",
                          value: etaSeconds !== null ? `~${etaSeconds}s` : "...",
                        },
                      ]}
                    />

                    {/* Packet Reception Grid Indicator */}
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground font-mono">
                        Packet Reception Matrix ({receivedChunks.size}/{incomingMeta.totalChunks})
                      </span>
                      <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto p-1 rounded bg-muted/40">
                        {Array.from({ length: incomingMeta.totalChunks }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-2.5 w-2.5 rounded-sm transition-colors ${
                              receivedChunks.has(i)
                                ? "bg-primary"
                                : "bg-muted-foreground/20"
                            }`}
                            title={`Chunk #${i + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    Waiting for incoming optical signal...
                  </div>
                )}
              </div>

              {completedBlob && (
                <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Transfer Complete!</p>
                      <p className="text-xs text-muted-foreground">{completedBlob.fileName}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => downloadBlob(completedBlob.blob, completedBlob.fileName)}
                  >
                    <Download className="mr-2 h-4 w-4" /> Save File
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= PAIR DEVICE ================= */}
        {mode === "pair" && (
          <div className="flex flex-col items-center justify-center space-y-4 rounded-xl border bg-card p-8 text-center">
            <h3 className="text-lg font-semibold">Scan to Open Receiver on Another Device</h3>
            <p className="max-w-md text-sm text-muted-foreground">
              Scan this QR code with your phone or second computer to open the receiver mode directly.
            </p>
            {pairUrlQr && (
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pairUrlQr} alt="Pairing QR" className="h-56 w-56" />
              </div>
            )}
            <Badge variant="outline" className="font-mono text-xs">
              No internet connection required once page is loaded
            </Badge>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
