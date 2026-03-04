"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileImage, MapPin, Camera, Settings, Clock, HardDrive } from "lucide-react";
import { toast } from "sonner";

interface ExifEntry {
  label: string;
  value: string;
}

interface ExifGroups {
  file: ExifEntry[];
  camera: ExifEntry[];
  settings: ExifEntry[];
  datetime: ExifEntry[];
  gps: ExifEntry[];
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(2)} MB`;
}

function readUint16(view: DataView, offset: number, le: boolean): number {
  return view.getUint16(offset, le);
}

function readUint32(view: DataView, offset: number, le: boolean): number {
  return view.getUint32(offset, le);
}

function readRational(view: DataView, offset: number, le: boolean): number {
  const num = readUint32(view, offset, le);
  const den = readUint32(view, offset + 4, le);
  return den !== 0 ? num / den : 0;
}

function readSignedRational(view: DataView, offset: number, le: boolean): number {
  const num = view.getInt32(offset, le);
  const den = view.getInt32(offset + 4, le);
  return den !== 0 ? num / den : 0;
}

function readAscii(view: DataView, offset: number, count: number): string {
  let str = "";
  for (let i = 0; i < count - 1; i++) {
    const code = view.getUint8(offset + i);
    if (code === 0) break;
    str += String.fromCharCode(code);
  }
  return str.trim();
}

function readValue(view: DataView, type: number, count: number, valueOrOffset: number, base: number, le: boolean): string {
  // type: 1=BYTE, 2=ASCII, 3=SHORT, 4=LONG, 5=RATIONAL, 7=UNDEFINED, 9=SLONG, 10=SRATIONAL
  const typeSize = [0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8];
  const sz = typeSize[type] ?? 1;
  const total = sz * count;

  let offset: number;
  if (total <= 4) {
    // Value stored directly in the value field
    offset = -1; // flag: use valueOrOffset directly
  } else {
    offset = base + valueOrOffset;
  }

  const getU8 = (o: number) => total <= 4 ? (valueOrOffset >> (8 * o)) & 0xff : view.getUint8(offset + o);

  if (type === 2) {
    // ASCII
    if (total <= 4) {
      let s = "";
      for (let i = 0; i < count; i++) { const c = getU8(i); if (c === 0) break; s += String.fromCharCode(c); }
      return s.trim();
    }
    return readAscii(view, offset, count);
  }

  if (type === 3) {
    // SHORT
    if (total <= 4) {
      return String(le ? (valueOrOffset & 0xffff) : ((valueOrOffset >> 16) & 0xffff));
    }
    const vals: number[] = [];
    for (let i = 0; i < Math.min(count, 4); i++) vals.push(view.getUint16(offset + i * 2, le));
    return vals.join(", ");
  }

  if (type === 4) {
    // LONG
    if (total <= 4) return String(valueOrOffset);
    return String(readUint32(view, offset, le));
  }

  if (type === 5) {
    // RATIONAL
    if (count === 1) return readRational(view, offset, le).toFixed(4);
    const vals: string[] = [];
    for (let i = 0; i < Math.min(count, 3); i++) vals.push(readRational(view, offset + i * 8, le).toFixed(4));
    return vals.join(", ");
  }

  if (type === 10) {
    // SRATIONAL
    if (count === 1) return readSignedRational(view, offset, le).toFixed(4);
    return String(readSignedRational(view, offset, le).toFixed(4));
  }

  if (type === 9) {
    if (total <= 4) return String(view.getInt32(0, le));
    return String(view.getInt32(offset, le));
  }

  return "[binary]";
}

const ORIENTATION_MAP: Record<number, string> = {
  1: "Normal", 2: "Mirrored", 3: "Rotated 180°", 4: "Mirrored + Rotated 180°",
  5: "Mirrored + Rotated 90° CCW", 6: "Rotated 90° CW", 7: "Mirrored + Rotated 90° CW", 8: "Rotated 90° CCW",
};

const METERING_MAP: Record<number, string> = {
  0: "Unknown", 1: "Average", 2: "Center-weighted", 3: "Spot", 4: "Multi-spot", 5: "Multi-segment", 6: "Partial",
};

const FLASH_MAP: Record<number, string> = {
  0: "No Flash", 1: "Fired", 5: "Fired (No return)", 7: "Fired (Return)", 8: "On (Not fired)",
  9: "On (Fired)", 16: "Off", 24: "Auto (Not fired)", 25: "Auto (Fired)",
};

const WHITE_BALANCE_MAP: Record<number, string> = { 0: "Auto", 1: "Manual" };
const EXPOSURE_MODE_MAP: Record<number, string> = { 0: "Auto", 1: "Manual", 2: "Auto bracket" };
const SCENE_CAPTURE_MAP: Record<number, string> = { 0: "Standard", 1: "Landscape", 2: "Portrait", 3: "Night" };
const RESOLUTION_UNIT_MAP: Record<number, string> = { 1: "None", 2: "Inch", 3: "Centimeter" };

function parseExif(buffer: ArrayBuffer): Partial<ExifGroups> {
  const groups: Partial<ExifGroups> = { camera: [], settings: [], datetime: [], gps: [] };
  const bytes = new Uint8Array(buffer);

  // Find EXIF marker FF E1
  let exifStart = -1;
  for (let i = 0; i < bytes.length - 1; i++) {
    if (bytes[i] === 0xFF && bytes[i + 1] === 0xE1) {
      exifStart = i + 4; // skip marker + length
      break;
    }
  }
  if (exifStart < 0) return groups;

  // Check Exif header
  const exifHeader = String.fromCharCode(bytes[exifStart], bytes[exifStart + 1], bytes[exifStart + 2], bytes[exifStart + 3]);
  if (exifHeader !== "Exif") return groups;

  const tiffBase = exifStart + 6;
  const view = new DataView(buffer, tiffBase);

  // Byte order
  const byteOrder = view.getUint16(0, false);
  const le = byteOrder === 0x4949; // 'II' = little endian, 'MM' = big endian

  // IFD0 offset
  const ifd0Offset = readUint32(view, 4, le);

  function parseIFD(offset: number, targetGroups: Record<string, ExifEntry[]>, isGPS = false) {
    try {
      const count = readUint16(view, offset, le);
      for (let i = 0; i < count; i++) {
        const entryOffset = offset + 2 + i * 12;
        if (entryOffset + 12 > view.byteLength) break;

        const tag = readUint16(view, entryOffset, le);
        const type = readUint16(view, entryOffset + 2, le);
        const cnt = readUint32(view, entryOffset + 4, le);
        const valOff = readUint32(view, entryOffset + 8, le);

        const raw = readValue(view, type, cnt, valOff, 0, le);

        if (isGPS) {
          switch (tag) {
            case 0x0001: targetGroups.gps?.push({ label: "GPS Latitude Ref", value: raw }); break;
            case 0x0002: {
              const nums = raw.split(", ").map(Number);
              if (nums.length >= 3) targetGroups.gps?.push({ label: "GPS Latitude", value: `${nums[0]}° ${nums[1]}' ${nums[2].toFixed(4)}"` });
              break;
            }
            case 0x0003: targetGroups.gps?.push({ label: "GPS Longitude Ref", value: raw }); break;
            case 0x0004: {
              const nums = raw.split(", ").map(Number);
              if (nums.length >= 3) targetGroups.gps?.push({ label: "GPS Longitude", value: `${nums[0]}° ${nums[1]}' ${nums[2].toFixed(4)}"` });
              break;
            }
            case 0x0006: targetGroups.gps?.push({ label: "GPS Altitude", value: `${parseFloat(raw).toFixed(1)} m` }); break;
            case 0x001D: targetGroups.gps?.push({ label: "GPS Date Stamp", value: raw }); break;
          }
          return;
        }

        switch (tag) {
          // Camera
          case 0x010F: targetGroups.camera?.push({ label: "Make", value: raw }); break;
          case 0x0110: targetGroups.camera?.push({ label: "Model", value: raw }); break;
          case 0x0112: targetGroups.camera?.push({ label: "Orientation", value: ORIENTATION_MAP[parseInt(raw)] ?? raw }); break;
          case 0x0131: targetGroups.camera?.push({ label: "Software", value: raw }); break;
          case 0x013B: targetGroups.camera?.push({ label: "Artist", value: raw }); break;
          // Resolution
          case 0x011A: targetGroups.settings?.push({ label: "X Resolution", value: `${parseFloat(raw).toFixed(0)} dpi` }); break;
          case 0x011B: targetGroups.settings?.push({ label: "Y Resolution", value: `${parseFloat(raw).toFixed(0)} dpi` }); break;
          case 0x0128: targetGroups.settings?.push({ label: "Resolution Unit", value: RESOLUTION_UNIT_MAP[parseInt(raw)] ?? raw }); break;
          // Date
          case 0x0132: targetGroups.datetime?.push({ label: "Date Modified", value: raw }); break;
          // SubIFDs
          case 0x8769: {
            // ExifIFD
            const subOffset = valOff;
            const subCount = readUint16(view, subOffset, le);
            for (let j = 0; j < subCount; j++) {
              const sEntry = subOffset + 2 + j * 12;
              if (sEntry + 12 > view.byteLength) break;
              const sTag = readUint16(view, sEntry, le);
              const sType = readUint16(view, sEntry + 2, le);
              const sCnt = readUint32(view, sEntry + 4, le);
              const sValOff = readUint32(view, sEntry + 8, le);
              const sRaw = readValue(view, sType, sCnt, sValOff, 0, le);

              switch (sTag) {
                case 0x829A: {
                  const v = parseFloat(sRaw);
                  targetGroups.settings?.push({ label: "Exposure Time", value: v < 1 ? `1/${Math.round(1/v)}s` : `${v}s` }); break;
                }
                case 0x829D: targetGroups.settings?.push({ label: "F-Number (Aperture)", value: `f/${parseFloat(sRaw).toFixed(1)}` }); break;
                case 0x8827: targetGroups.settings?.push({ label: "ISO Speed", value: sRaw }); break;
                case 0x9003: targetGroups.datetime?.push({ label: "Date Taken", value: sRaw }); break;
                case 0x9004: targetGroups.datetime?.push({ label: "Date Digitized", value: sRaw }); break;
                case 0x920A: targetGroups.settings?.push({ label: "Focal Length", value: `${parseFloat(sRaw).toFixed(1)} mm` }); break;
                case 0xA002: targetGroups.settings?.push({ label: "Image Width (EXIF)", value: `${sRaw} px` }); break;
                case 0xA003: targetGroups.settings?.push({ label: "Image Height (EXIF)", value: `${sRaw} px` }); break;
                case 0x9207: targetGroups.settings?.push({ label: "Metering Mode", value: METERING_MAP[parseInt(sRaw)] ?? sRaw }); break;
                case 0x9209: targetGroups.settings?.push({ label: "Flash", value: FLASH_MAP[parseInt(sRaw)] ?? sRaw }); break;
                case 0xA402: targetGroups.settings?.push({ label: "Exposure Mode", value: EXPOSURE_MODE_MAP[parseInt(sRaw)] ?? sRaw }); break;
                case 0xA403: targetGroups.settings?.push({ label: "White Balance", value: WHITE_BALANCE_MAP[parseInt(sRaw)] ?? sRaw }); break;
                case 0xA405: targetGroups.settings?.push({ label: "Focal Length (35mm)", value: `${sRaw} mm` }); break;
                case 0xA406: targetGroups.settings?.push({ label: "Scene Capture Type", value: SCENE_CAPTURE_MAP[parseInt(sRaw)] ?? sRaw }); break;
              }
            }
            break;
          }
          case 0x8825: {
            // GPS IFD
            const gpsOffset = valOff;
            const gpsCount = readUint16(view, gpsOffset, le);
            for (let j = 0; j < gpsCount; j++) {
              const gEntry = gpsOffset + 2 + j * 12;
              if (gEntry + 12 > view.byteLength) break;
              const gTag = readUint16(view, gEntry, le);
              const gType = readUint16(view, gEntry + 2, le);
              const gCnt = readUint32(view, gEntry + 4, le);
              const gValOff = readUint32(view, gEntry + 8, le);
              const gRaw = readValue(view, gType, gCnt, gValOff, 0, le);
              const gpsGroups = { gps: targetGroups.gps };
              // Re-use GPS parsing
              switch (gTag) {
                case 0x0001: gpsGroups.gps?.push({ label: "GPS Latitude Ref", value: gRaw }); break;
                case 0x0002: {
                  const nums = gRaw.split(", ").map(Number);
                  if (nums.length >= 3) gpsGroups.gps?.push({ label: "GPS Latitude", value: `${nums[0]}° ${nums[1]}' ${nums[2].toFixed(4)}"` });
                  break;
                }
                case 0x0003: gpsGroups.gps?.push({ label: "GPS Longitude Ref", value: gRaw }); break;
                case 0x0004: {
                  const nums = gRaw.split(", ").map(Number);
                  if (nums.length >= 3) gpsGroups.gps?.push({ label: "GPS Longitude", value: `${nums[0]}° ${nums[1]}' ${nums[2].toFixed(4)}"` });
                  break;
                }
                case 0x0006: gpsGroups.gps?.push({ label: "GPS Altitude", value: `${parseFloat(gRaw).toFixed(1)} m` }); break;
                case 0x001D: gpsGroups.gps?.push({ label: "GPS Date Stamp", value: gRaw }); break;
              }
            }
            break;
          }
        }
      }
    } catch {
      // silently skip malformed IFD
    }
  }

  parseIFD(ifd0Offset, groups as Record<string, ExifEntry[]>);
  return groups;
}

function buildGoogleMapsUrl(groups: Partial<ExifGroups>): string | null {
  const gps = groups.gps ?? [];
  const latEntry = gps.find((e) => e.label === "GPS Latitude");
  const latRefEntry = gps.find((e) => e.label === "GPS Latitude Ref");
  const lonEntry = gps.find((e) => e.label === "GPS Longitude");
  const lonRefEntry = gps.find((e) => e.label === "GPS Longitude Ref");

  if (!latEntry || !lonEntry) return null;

  function parseDMS(dms: string): number {
    const m = dms.match(/([\d.]+)°\s+([\d.]+)'\s+([\d.]+)"/);
    if (!m) return 0;
    return parseFloat(m[1]) + parseFloat(m[2]) / 60 + parseFloat(m[3]) / 3600;
  }

  let lat = parseDMS(latEntry.value);
  let lon = parseDMS(lonEntry.value);
  if (latRefEntry?.value === "S") lat = -lat;
  if (lonRefEntry?.value === "W") lon = -lon;
  if (lat === 0 && lon === 0) return null;
  return `https://maps.google.com/?q=${lat.toFixed(6)},${lon.toFixed(6)}`;
}

interface FileInfo {
  name: string;
  size: number;
  lastModified: string;
  width: number;
  height: number;
  type: string;
}

export default function ExifViewer() {
  const t = useTranslations("Tools.ExifViewer");
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [exifGroups, setExifGroups] = useState<Partial<ExifGroups> | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [parseError, setParseError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error(t("uploadError"));
      return;
    }
    setLoading(true);
    setParseError(false);
    setExifGroups(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const objUrl = URL.createObjectURL(file);

      const img = new Image();
      img.onload = () => {
        const info: FileInfo = {
          name: file.name,
          size: file.size,
          lastModified: new Date(file.lastModified).toLocaleString(),
          width: img.naturalWidth,
          height: img.naturalHeight,
          type: file.type,
        };
        setFileInfo(info);
        setPreviewSrc(objUrl);

        // Try EXIF parsing
        try {
          if (file.type === "image/jpeg" || file.name.toLowerCase().endsWith(".jpg") || file.name.toLowerCase().endsWith(".jpeg")) {
            const groups = parseExif(arrayBuffer);
            const hasData = Object.values(groups).some((g) => Array.isArray(g) && g.length > 0);
            if (hasData) {
              setExifGroups(groups);
            } else {
              setParseError(true);
              setExifGroups(null);
            }
          } else {
            setParseError(true);
          }
        } catch {
          setParseError(true);
        }
        setLoading(false);
      };
      img.onerror = () => {
        toast.error(t("loadError"));
        setLoading(false);
      };
      img.src = objUrl;
    };
    reader.onerror = () => {
      toast.error(t("readError"));
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  }, [t]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const mapsUrl = exifGroups ? buildGoogleMapsUrl(exifGroups) : null;

  const GroupSection = ({ title, icon, entries }: { title: string; icon: React.ReactNode; entries: ExifEntry[] }) => {
    if (!entries || entries.length === 0) return null;
    return (
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
          {icon} {title}
        </h3>
        <div className="rounded-lg border overflow-hidden">
          {entries.map((e, i) => (
            <div key={i} className={`flex items-start gap-4 px-4 py-2.5 text-sm ${i % 2 === 0 ? "bg-muted/20" : ""}`}>
              <span className="font-medium text-muted-foreground min-w-[160px] shrink-0">{e.label}</span>
              <span className="break-all" dir="ltr">{e.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <FileImage className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
        </div>

        {!fileInfo && (
          <Card
            className="border-dashed border-2 cursor-pointer hover:border-primary transition-colors"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <CardContent className="pt-12 pb-12 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">{t("dropPhoto")}</p>
                <p className="text-sm text-muted-foreground mt-1">{t("jpegRecommended")}</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card>
            <CardContent className="pt-8 pb-8 text-center">
              <p className="text-muted-foreground animate-pulse">{t("readingMetadata")}</p>
            </CardContent>
          </Card>
        )}

        {fileInfo && !loading && (
          <>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex gap-2 items-center flex-wrap">
                <Badge variant="outline">{fileInfo.width} × {fileInfo.height}px</Badge>
                <Badge variant="outline">{formatBytes(fileInfo.size)}</Badge>
                {exifGroups && <Badge className="bg-green-500 text-white">{t("exifDataFound")}</Badge>}
              </div>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                {t("loadAnother")}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </div>

            {previewSrc && (
              <Card>
                <CardContent className="p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewSrc} alt="Preview" className="w-full max-h-64 object-contain rounded-md" />
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {/* File Info */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
                  <HardDrive className="w-4 h-4" /> {t("fileSection")}
                </h3>
                <div className="rounded-lg border overflow-hidden">
                  {[
                    { label: t("fileName"), value: fileInfo.name },
                    { label: t("fileSize"), value: formatBytes(fileInfo.size) },
                    { label: t("fileType"), value: fileInfo.type },
                    { label: t("dimensions"), value: `${fileInfo.width} × ${fileInfo.height} ${t("pixels")}` },
                    { label: t("lastModified"), value: fileInfo.lastModified },
                  ].map((e, i) => (
                    <div key={i} className={`flex items-start gap-4 px-4 py-2.5 text-sm ${i % 2 === 0 ? "bg-muted/20" : ""}`}>
                      <span className="font-medium text-muted-foreground min-w-[160px] shrink-0">{e.label}</span>
                      <span className="break-all" dir="ltr">{e.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {exifGroups ? (
                <>
                  <GroupSection title={t("cameraSection")} icon={<Camera className="w-4 h-4" />} entries={exifGroups.camera ?? []} />
                  <GroupSection title={t("settingsSection")} icon={<Settings className="w-4 h-4" />} entries={exifGroups.settings ?? []} />
                  <GroupSection title={t("datetimeSection")} icon={<Clock className="w-4 h-4" />} entries={exifGroups.datetime ?? []} />

                  {(exifGroups.gps?.length ?? 0) > 0 && (
                    <>
                      <GroupSection title={t("gpsSection")} icon={<MapPin className="w-4 h-4" />} entries={exifGroups.gps ?? []} />
                      {mapsUrl && (
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-primary underline underline-offset-2 hover:opacity-80"
                        >
                          <MapPin className="w-4 h-4" />
                          {t("viewOnMaps")}
                        </a>
                      )}
                    </>
                  )}
                </>
              ) : parseError ? (
                <Card className="border-dashed">
                  <CardContent className="pt-5 pb-5">
                    <CardDescription>
                      {t("noExifMessage")}
                    </CardDescription>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
