"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2, ArrowRightLeft, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { TwoPane } from "@/components/shared/TwoPane";
import { OutputPanel } from "@/components/shared/OutputPanel";
import { ModePicker } from "@/components/shared/ModePicker";

const SAMPLE_URL = "https://example.com/search?q=hello world&lang=en&filter=a+b";
const SAMPLE_TEXT = "Hello World! Special chars: @#$%^&*() URL: https://example.com/path?foo=bar";

export default function UrlEncoderDecoder() {
  const t = useTranslations("Tools.UrlEncoderDecoder");
  const tc = useTranslations("ToolsConfig");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [tab, setTab] = useState("encode");
  const [fullUrl, setFullUrl] = useState(false);

  useEffect(() => {
    if (!input.trim()) { setOutput(""); return; }
    try {
      if (tab === "encode") {
        setOutput(fullUrl ? encodeURI(input) : encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch { setOutput(""); }
  }, [input, tab, fullUrl]);

  const handleEncode = () => {
    if (!input.trim()) { toast.error(t("pleaseEnterInput")); return; }
    try {
      setOutput(fullUrl ? encodeURI(input) : encodeURIComponent(input));
      toast.success(t("encodedSuccessfully"));
    } catch (e) { toast.error(t("encodingFailed", { msg: e instanceof Error ? e.message : String(e) })); }
  };

  const handleDecode = () => {
    if (!input.trim()) { toast.error(t("pleaseEnterInput")); return; }
    try {
      setOutput(decodeURIComponent(input));
      toast.success(t("decodedSuccessfully"));
    } catch (e) { toast.error(t("decodingFailed", { msg: e instanceof Error ? e.message : String(e) })); }
  };

  const handleSwap = () => { setInput(output); setOutput(input); };
  const handleClear = () => { setInput(""); setOutput(""); };

  const handleLoadSample = () => { setInput(fullUrl ? SAMPLE_URL : SAMPLE_TEXT); };

  return (
    <ToolShell
      slug="url-encoder"
      title={tc("tools.url-encoder.name")}
      sub={tc("tools.url-encoder.description")}
    >
      <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <ModePicker
              aria-label={t("encode")}
              value={tab}
              onChange={setTab}
              options={[
                { value: "encode", label: t("encode") },
                { value: "decode", label: t("decode") },
              ]}
            />
            <Button onClick={tab === "encode" ? handleEncode : handleDecode}>
              {tab === "encode" ? t("encodeBtn") : t("decodeBtn")}
            </Button>
            <Button variant="outline" onClick={handleSwap}><ArrowRightLeft className="h-4 w-4 me-2" />{t("swap")}</Button>
            <Button variant="outline" onClick={handleLoadSample}><FileText className="h-4 w-4 me-2" />{t("loadSample")}</Button>
            <Button variant="ghost" onClick={handleClear}><Trash2 className="h-4 w-4 me-2" />{t("clear")}</Button>
            <div className="flex items-center gap-2 ms-auto">
              <Switch id="full-url" checked={fullUrl} onCheckedChange={setFullUrl} />
              <Label htmlFor="full-url" className="text-sm text-muted-foreground whitespace-nowrap">{t("encodeFullUrl")}</Label>
            </div>
          </div>
          <TwoPane
            start={
              <Card className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{tab === "encode" ? t("textToEncode") : t("textToDecode")}</span>
                  {input && <span className="text-xs text-muted-foreground">{input.length} {t("chars")}</span>}
                </div>
                <Textarea placeholder={t("inputPlaceholder")} className="min-h-[420px] font-mono text-sm resize-none" dir="ltr" value={input} onChange={(e) => setInput(e.target.value)} />
              </Card>
            }
            end={
              <OutputPanel
                text={output}
                title={
                  <>
                    {t("output")}
                    {output ? ` · ${output.length} ${t("chars")}` : ""}
                  </>
                }
                copyLabel={t("copy")}
                copySuccessMessage={t("copiedToClipboard")}
                copyErrorMessage={t("failedToCopy")}
              >
                <Textarea placeholder={t("outputPlaceholder")} className="min-h-[420px] rounded-none border-0 bg-transparent font-mono text-sm resize-none focus-visible:ring-0" dir="ltr" value={output} readOnly />
              </OutputPanel>
            }
          />
      </div>
    </ToolShell>
  );
}
