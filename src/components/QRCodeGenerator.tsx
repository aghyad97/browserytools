"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Download, RotateCcw, QrCode } from "lucide-react";
import NumberFlow from "@number-flow/react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { SliderRow } from "@/components/shared/SliderRow";
import { downloadBlob, downloadDataUrl } from "@/lib/download";

// QR Code generator using the qrcode package
const generateQRCode = async (
  text: string,
  size: number,
  errorCorrectionLevel: string,
  format: string = "png"
): Promise<string> => {
  try {
    const options = {
      width: size,
      margin: 2,
      // content value: QR codes must render dark-on-light regardless of UI theme (qrcode render options, not chrome)
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: errorCorrectionLevel as "L" | "M" | "Q" | "H",
    };

    if (format === "svg") {
      return await QRCode.toString(text, { ...options, type: "svg" });
    } else {
      const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
      return await QRCode.toDataURL(text, { ...options, type: mimeType });
    }
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};

export default function QRCodeGenerator() {
  const t = useTranslations("Tools.QRCodeGenerator");
  const tc = useTranslations("ToolsConfig");
  const [inputText, setInputText] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [size, setSize] = useState(256);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("M");
  const [fileName, setFileName] = useState("qrcode");
  const [format, setFormat] = useState("png");

  const generateQR = async () => {
    if (!inputText.trim()) {
      toast.error(t("noTextToEncode"));
      return;
    }

    try {
      const qrCode = await generateQRCode(
        inputText,
        size,
        errorCorrectionLevel,
        format
      );
      setQrCodeDataUrl(qrCode);
    } catch (error) {
      toast.error(t("errorGenerating"));
    }
  };

  const handleCopy = async () => {
    if (!qrCodeDataUrl) {
      toast.error(t("noTextToEncode"));
      return;
    }

    try {
      if (format === "svg") {
        // For SVG, copy the raw SVG content as text
        await navigator.clipboard.writeText(qrCodeDataUrl);
        toast.success(t("copiedToClipboard"));
      } else {
        // For PNG/JPEG, convert data URL to blob and copy to clipboard
        const response = await fetch(qrCodeDataUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
        toast.success(t("copiedToClipboard"));
      }
    } catch (error) {
      toast.error(t("copyFailed"));
    }
  };

  const handleDownload = async () => {
    if (!inputText.trim()) {
      toast.error(t("noTextToEncode"));
      return;
    }

    try {
      const qrCodeData = await generateQRCode(
        inputText,
        size,
        errorCorrectionLevel,
        format
      );

      if (format === "svg") {
        // For SVG, create a blob with the SVG content
        const blob = new Blob([qrCodeData], { type: "image/svg+xml" });
        downloadBlob(blob, `${fileName}.${format}`);
      } else {
        // For PNG/JPEG, use the data URL directly
        downloadDataUrl(qrCodeData, `${fileName}.${format}`);
      }

      toast.success(t("downloadStarted"));
    } catch (error) {
      toast.error(t("downloadFailed"));
    }
  };

  const handleClear = () => {
    setInputText("");
    setQrCodeDataUrl("");
    setFileName("qrcode");
  };

  const handleSampleText = (type: string) => {
    const samples = {
      url: "https://www.example.com",
      email: "mailto:contact@example.com",
      phone: "tel:+1234567890",
      sms: "sms:+1234567890:Hello World",
      wifi: "WIFI:T:WPA;S:MyNetwork;P:password123;H:false;;",
      text: "Hello, this is a sample QR code!",
    };

    setInputText(samples[type as keyof typeof samples] || samples.text);
  };

  // Auto-generate when text changes
  useEffect(() => {
    if (inputText.trim()) {
      generateQRCode(inputText, size, errorCorrectionLevel, format)
        .then(setQrCodeDataUrl)
        .catch((error) => {
          console.error("Error auto-generating QR code:", error);
        });
    }
  }, [inputText, size, errorCorrectionLevel, format]);

  return (
    <ToolShell
      slug="qr-generator"
      title={tc("tools.qr-generator.name")}
      sub={tc("tools.qr-generator.description")}
      width="wide"
    >
      <div className="flex flex-col lg:flex-row gap-4 h-screen lg:h-[calc(100vh-2rem)]">
        {/* Input Section - Sticky Sidebar */}
        <div className="w-full lg:w-1/3 overflow-y-auto space-y-4 pe-4 scrollbar-hide">
          <SettingsCard title={t("inputTitle")} description={t("inputDesc")}>
            <OptionRow label={t("textOrUrl")} htmlFor="input-text">
              <Textarea
                id="input-text"
                placeholder={t("inputPlaceholder")}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[120px] resize-none text-left"
                dir="ltr"
              />
            </OptionRow>

            <OptionRow label={t("quickSamples")}>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => handleSampleText("url")}>URL</Button>
                <Button variant="outline" size="sm" onClick={() => handleSampleText("email")}>Email</Button>
                <Button variant="outline" size="sm" onClick={() => handleSampleText("phone")}>Phone</Button>
                <Button variant="outline" size="sm" onClick={() => handleSampleText("wifi")}>WiFi</Button>
              </div>
            </OptionRow>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleClear}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Clear
              </Button>
            </div>
          </SettingsCard>

          {/* Settings */}
          <SettingsCard title={t("settingsTitle")} description={t("settingsDesc")}>
            <SliderRow
              label={t("size")}
              value={size}
              min={128}
              max={512}
              step={32}
              onChange={setSize}
              display={<><NumberFlow value={size} />px</>}
            />

            <OptionRow label={t("errorCorrectionLevel")} htmlFor="error-correction">
              <Select
                value={errorCorrectionLevel}
                onValueChange={setErrorCorrectionLevel}
              >
                <SelectTrigger id="error-correction">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (7%)</SelectItem>
                  <SelectItem value="M">Medium (15%)</SelectItem>
                  <SelectItem value="Q">Quartile (25%)</SelectItem>
                  <SelectItem value="H">High (30%)</SelectItem>
                </SelectContent>
              </Select>
            </OptionRow>

            <OptionRow label={t("downloadFormat")} htmlFor="format">
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG (Raster)</SelectItem>
                  <SelectItem value="jpeg">JPEG (Raster)</SelectItem>
                  <SelectItem value="svg">SVG (Vector)</SelectItem>
                </SelectContent>
              </Select>
            </OptionRow>

            <OptionRow label={t("downloadFilename")} htmlFor="filename">
              <Input
                id="filename"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="qrcode"
                dir="ltr"
              />
            </OptionRow>
          </SettingsCard>
        </div>

        {/* Output Section - Sticky Content */}
        <div className="w-full lg:w-2/3 lg:sticky lg:top-4 lg:h-fit space-y-4">
          <SettingsCard title={t("qrCodeTitle")} description={t("qrCodeDesc")}>
              <div className="flex flex-col items-center space-y-4">
                {qrCodeDataUrl ? (
                  <>
                    <div className="p-4 bg-white rounded-lg border">
                      {format === "svg" ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: qrCodeDataUrl }}
                          className="max-w-full h-auto"
                        />
                      ) : (
                        <img
                          src={qrCodeDataUrl}
                          alt={t("generatedQrAlt")}
                          className="max-w-full h-auto"
                        />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCopy}
                        className="flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        {t("copy")}
                      </Button>
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        {t("download", { format: format.toUpperCase() })}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <QrCode className="w-16 h-16 mb-4" />
                    <p>{t("enterTextToGenerate")}</p>
                  </div>
                )}
              </div>
          </SettingsCard>

          {/* Info */}
          <SettingsCard title={t("qrCodeTypes")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium mb-1">{t("typeUrls")}</p>
                  <p dir="ltr">https://www.example.com</p>
                </div>
                <div>
                  <p className="font-medium mb-1">{t("typeEmail")}</p>
                  <p dir="ltr">mailto:contact@example.com</p>
                </div>
                <div>
                  <p className="font-medium mb-1">{t("typePhone")}</p>
                  <p dir="ltr">tel:+1234567890</p>
                </div>
                <div>
                  <p className="font-medium mb-1">{t("typeSms")}</p>
                  <p dir="ltr">sms:+1234567890:Message</p>
                </div>
                <div>
                  <p className="font-medium mb-1">{t("typeWifi")}</p>
                  <p dir="ltr">WIFI:T:WPA;S:Network;P:Password;;</p>
                </div>
                <div>
                  <p className="font-medium mb-1">{t("typePlainText")}</p>
                  <p>{t("typePlainTextDesc")}</p>
                </div>
              </div>
          </SettingsCard>
        </div>
      </div>
    </ToolShell>
  );
}
