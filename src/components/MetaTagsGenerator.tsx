"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { AlertTriangle, ImageOff } from "lucide-react";
import { ToolShell } from "@/components/template/tool-shell";
import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { OutputPanel } from "@/components/shared/OutputPanel";

interface MetaFields {
  title: string;
  description: string;
  url: string;
  image: string;
  siteName: string;
  twitterHandle: string;
  type: string;
  twitterCard: string;
}

const EMPTY: MetaFields = {
  title: "",
  description: "",
  url: "",
  image: "",
  siteName: "",
  twitterHandle: "",
  type: "website",
  twitterCard: "summary_large_image",
};

// Recommended limits used both for truncation hints and validation.
const LIMITS = {
  titleMax: 60,
  descMax: 160,
  ogImageW: 1200,
  ogImageH: 630,
} as const;

function esc(s: string) {
  return s.replace(/"/g, "&quot;");
}

function buildTags(f: MetaFields) {
  const basic = [
    f.title && `<title>${esc(f.title)}</title>`,
    f.description && `<meta name="description" content="${esc(f.description)}">`,
    f.url && `<link rel="canonical" href="${esc(f.url)}">`,
  ]
    .filter(Boolean)
    .join("\n");

  const og = [
    f.title && `<meta property="og:title" content="${esc(f.title)}">`,
    f.description && `<meta property="og:description" content="${esc(f.description)}">`,
    f.url && `<meta property="og:url" content="${esc(f.url)}">`,
    f.image && `<meta property="og:image" content="${esc(f.image)}">`,
    f.siteName && `<meta property="og:site_name" content="${esc(f.siteName)}">`,
    f.type && `<meta property="og:type" content="${esc(f.type)}">`,
  ]
    .filter(Boolean)
    .join("\n");

  const twitter = [
    `<meta name="twitter:card" content="${esc(f.twitterCard)}">`,
    f.title && `<meta name="twitter:title" content="${esc(f.title)}">`,
    f.description && `<meta name="twitter:description" content="${esc(f.description)}">`,
    f.image && `<meta name="twitter:image" content="${esc(f.image)}">`,
    f.twitterHandle && `<meta name="twitter:site" content="${esc(f.twitterHandle)}">`,
  ]
    .filter(Boolean)
    .join("\n");

  return { basic, og, twitter };
}

// Parse a pasted block of HTML <head> markup into known fields. Pure
// client-side via DOMParser; never fetches anything.
function parseHtml(html: string): Partial<MetaFields> {
  const out: Partial<MetaFields> = {};
  if (typeof DOMParser === "undefined") return out;
  const doc = new DOMParser().parseFromString(html, "text/html");

  const pick = (selector: string) =>
    doc.querySelector(selector)?.getAttribute("content")?.trim() || "";

  const titleEl = doc.querySelector("title")?.textContent?.trim();
  const ogTitle = pick('meta[property="og:title"]');
  const twTitle = pick('meta[name="twitter:title"]');
  const title = ogTitle || twTitle || titleEl;
  if (title) out.title = title;

  const desc =
    pick('meta[name="description"]') ||
    pick('meta[property="og:description"]') ||
    pick('meta[name="twitter:description"]');
  if (desc) out.description = desc;

  const url =
    pick('meta[property="og:url"]') ||
    doc.querySelector('link[rel="canonical"]')?.getAttribute("href")?.trim() ||
    "";
  if (url) out.url = url;

  const image = pick('meta[property="og:image"]') || pick('meta[name="twitter:image"]');
  if (image) out.image = image;

  const siteName = pick('meta[property="og:site_name"]');
  if (siteName) out.siteName = siteName;

  const handle = pick('meta[name="twitter:site"]') || pick('meta[name="twitter:creator"]');
  if (handle) out.twitterHandle = handle;

  const ogType = pick('meta[property="og:type"]');
  if (ogType) out.type = ogType;

  const card = pick('meta[name="twitter:card"]');
  if (card) out.twitterCard = card;

  return out;
}

// Truncate text to a max length with an ellipsis, mirroring how platforms clip.
function clip(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

function hostOf(url: string, fallback = "example.com") {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url ? url.replace(/^https?:\/\//, "").split("/")[0] || fallback : fallback;
  }
}

interface Warning {
  key: string;
  values?: Record<string, string | number>;
}

export default function MetaTagsGenerator() {
  const t = useTranslations("Tools.MetaTagsGenerator");
  const tc = useTranslations("ToolsConfig");
  const [fields, setFields] = useState<MetaFields>(EMPTY);
  const [pasted, setPasted] = useState("");
  const [imgError, setImgError] = useState(false);
  const [imgDims, setImgDims] = useState<{ w: number; h: number } | null>(null);

  const setText =
    (k: keyof MetaFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((f) => ({ ...f, [k]: e.target.value }));

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImgError(false);
    setImgDims(null);
    setFields((f) => ({ ...f, image: e.target.value }));
  };

  const handleParse = () => {
    const parsed = parseHtml(pasted);
    if (Object.keys(parsed).length === 0) {
      toast.error(t("parseEmpty"));
      return;
    }
    setImgError(false);
    setImgDims(null);
    setFields((f) => ({ ...f, ...parsed }));
    toast.success(t("parseSuccess"));
  };

  const tags = useMemo(() => buildTags(fields), [fields]);
  const allTags = [tags.basic, tags.og, tags.twitter].filter(Boolean).join("\n\n");

  const warnings = useMemo<Warning[]>(() => {
    const w: Warning[] = [];
    if (!fields.title) w.push({ key: "warnNoTitle" });
    else if (fields.title.length > LIMITS.titleMax)
      w.push({ key: "warnTitleLong", values: { len: fields.title.length, max: LIMITS.titleMax } });
    if (!fields.description) w.push({ key: "warnNoDescription" });
    else if (fields.description.length > LIMITS.descMax)
      w.push({
        key: "warnDescriptionLong",
        values: { len: fields.description.length, max: LIMITS.descMax },
      });
    if (!fields.image) w.push({ key: "warnNoImage" });
    else if (imgError) w.push({ key: "warnImageUnreachable" });
    else if (imgDims && (imgDims.w < LIMITS.ogImageW || imgDims.h < LIMITS.ogImageH))
      w.push({
        key: "warnImageSmall",
        values: {
          w: imgDims.w,
          h: imgDims.h,
          rw: LIMITS.ogImageW,
          rh: LIMITS.ogImageH,
        },
      });
    if (!fields.url) w.push({ key: "warnNoUrl" });
    return w;
  }, [fields, imgError, imgDims]);

  // Shared preview values.
  const host = hostOf(fields.url);
  const title = fields.title || t("previewTitleFallback");
  const desc = fields.description || t("previewDescFallback");
  const siteName = fields.siteName || host;
  const hasImg = Boolean(fields.image) && !imgError;

  // A reusable image thumbnail that reports natural dimensions for validation.
  const Thumb = ({ className }: { className?: string }) =>
    hasImg ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={fields.image}
        alt=""
        className={className}
        onError={() => setImgError(true)}
        onLoad={(e) =>
          setImgDims({
            w: e.currentTarget.naturalWidth,
            h: e.currentTarget.naturalHeight,
          })
        }
      />
    ) : (
      <div
        className={`flex items-center justify-center bg-zinc-200 text-zinc-400 ${className ?? ""}`}
      >
        <ImageOff className="w-8 h-8" />
      </div>
    );

  return (
    <ToolShell
      slug="meta-tags"
      title={tc("tools.meta-tags.name")}
      sub={tc("tools.meta-tags.description")}
    >
      <div className="max-w-5xl mx-auto space-y-4">
      <SettingsCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <OptionRow
              label={t("siteTitle")}
              htmlFor="mt-title"
              hint={t("charCount", { len: fields.title.length, max: LIMITS.titleMax })}
            >
              <Input
                id="mt-title"
                value={fields.title}
                onChange={setText("title")}
                placeholder={t("siteTitlePlaceholder")}
              />
            </OptionRow>
            <OptionRow label={t("siteUrl")} htmlFor="mt-url">
              <Input
                id="mt-url"
                value={fields.url}
                onChange={setText("url")}
                placeholder={t("siteUrlPlaceholder")}
                dir="ltr"
              />
            </OptionRow>
          </div>

          <OptionRow
            label={t("siteDescription")}
            htmlFor="mt-desc"
            hint={t("charCount", { len: fields.description.length, max: LIMITS.descMax })}
          >
            <Textarea
              id="mt-desc"
              dir="auto"
              value={fields.description}
              onChange={setText("description")}
              placeholder={t("siteDescriptionPlaceholder")}
              className="resize-none"
              rows={3}
            />
          </OptionRow>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <OptionRow
              label={t("ogImage")}
              htmlFor="mt-image"
              hint={imgDims ? <span dir="ltr">{imgDims.w} × {imgDims.h}</span> : undefined}
            >
              <Input
                id="mt-image"
                value={fields.image}
                onChange={onImageChange}
                placeholder={t("ogImagePlaceholder")}
                dir="ltr"
              />
            </OptionRow>
            <OptionRow label={t("siteNameLabel")} htmlFor="mt-sitename">
              <Input
                id="mt-sitename"
                value={fields.siteName}
                onChange={setText("siteName")}
                placeholder={t("siteNamePlaceholder")}
              />
            </OptionRow>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <OptionRow label={t("twitterHandle")} htmlFor="mt-handle">
              <Input
                id="mt-handle"
                value={fields.twitterHandle}
                onChange={setText("twitterHandle")}
                placeholder={t("twitterHandlePlaceholder")}
                dir="ltr"
              />
            </OptionRow>
            <OptionRow label={t("twitterCardType")}>
              <Select
                value={fields.twitterCard}
                onValueChange={(v) => setFields((f) => ({ ...f, twitterCard: v }))}
              >
                <SelectTrigger aria-label={t("twitterCardType")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary_large_image">
                    {t("cardLargeImage")}
                  </SelectItem>
                  <SelectItem value="summary">{t("cardSummary")}</SelectItem>
                </SelectContent>
              </Select>
            </OptionRow>
            <OptionRow label={t("ogTypeLabel")}>
              <Select
                value={fields.type}
                onValueChange={(v) => setFields((f) => ({ ...f, type: v }))}
              >
                <SelectTrigger aria-label={t("ogTypeLabel")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">website</SelectItem>
                  <SelectItem value="article">article</SelectItem>
                  <SelectItem value="product">product</SelectItem>
                  <SelectItem value="profile">profile</SelectItem>
                </SelectContent>
              </Select>
            </OptionRow>
          </div>

          <OptionRow label={t("pasteLabel")} htmlFor="mt-paste">
            <div className="space-y-2">
              <Textarea
                id="mt-paste"
                dir="ltr"
                value={pasted}
                onChange={(e) => setPasted(e.target.value)}
                placeholder={t("pastePlaceholder")}
                className="resize-none font-mono text-xs"
                rows={3}
              />
              <Button variant="outline" size="sm" onClick={handleParse} disabled={!pasted.trim()}>
                {t("parseButton")}
              </Button>
            </div>
          </OptionRow>
      </SettingsCard>

      {warnings.length > 0 && (
        <SettingsCard
          title={
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              {t("validationTitle")}
            </span>
          }
        >
          <ul className="space-y-1 text-sm text-muted-foreground list-disc ps-5">
            {warnings.map((wn) => (
              <li key={wn.key} data-testid="meta-warning">
                {t(
                  // literal keys for next-intl
                  wn.key === "warnNoTitle"
                    ? "warnNoTitle"
                    : wn.key === "warnTitleLong"
                      ? "warnTitleLong"
                      : wn.key === "warnNoDescription"
                        ? "warnNoDescription"
                        : wn.key === "warnDescriptionLong"
                          ? "warnDescriptionLong"
                          : wn.key === "warnNoImage"
                            ? "warnNoImage"
                            : wn.key === "warnImageUnreachable"
                              ? "warnImageUnreachable"
                              : wn.key === "warnImageSmall"
                                ? "warnImageSmall"
                                : "warnNoUrl",
                  wn.values
                )}
              </li>
            ))}
          </ul>
        </SettingsCard>
      )}

      <SettingsCard title={t("previewsTitle")} description={t("previewsSubtitle")}>
          <Tabs defaultValue="google">
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="google">{t("tabGoogle")}</TabsTrigger>
              <TabsTrigger value="twitter">{t("tabTwitterPreview")}</TabsTrigger>
              <TabsTrigger value="facebook">{t("tabFacebook")}</TabsTrigger>
              <TabsTrigger value="linkedin">{t("tabLinkedIn")}</TabsTrigger>
              <TabsTrigger value="discord">{t("tabDiscord")}</TabsTrigger>
              <TabsTrigger value="slack">{t("tabSlack")}</TabsTrigger>
            </TabsList>

            {/*
              content value: these mockups faithfully replicate each external
              platform's fixed, real-world visual branding (Google SERP blue,
              Twitter/Facebook/LinkedIn card chrome, Discord/Slack embed
              colors) — they must render true-to-platform regardless of the
              app's own theme, same allowlist class as InvoiceGenerator's
              WYSIWYG PDF preview. Always LTR regardless of locale.
            */}
            <TabsContent value="google" className="mt-4">
              <div dir="ltr" className="max-w-xl text-left" data-testid="preview-google">
                <p className="text-xs text-[#202124] truncate">{host}{fields.url ? "" : ""}</p>
                <p className="text-[#1a0dab] text-xl leading-tight hover:underline cursor-pointer truncate">
                  {clip(title, LIMITS.titleMax)}
                </p>
                <p className="text-sm text-[#4d5156] mt-1 line-clamp-2">
                  {clip(desc, LIMITS.descMax)}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="twitter" className="mt-4 space-y-6">
              {fields.twitterCard === "summary" ? (
                <div
                  dir="ltr"
                  className="max-w-[440px] rounded-2xl border border-zinc-200 overflow-hidden flex bg-white text-left"
                  data-testid="preview-twitter"
                >
                  <Thumb className="w-[130px] h-[130px] object-cover shrink-0" />
                  <div className="p-3 min-w-0 flex flex-col justify-center">
                    <p className="text-[13px] text-zinc-500 truncate">{host}</p>
                    <p className="text-[15px] text-zinc-900 font-semibold truncate">
                      {clip(title, 70)}
                    </p>
                    <p className="text-[14px] text-zinc-500 line-clamp-2">{clip(desc, 125)}</p>
                  </div>
                </div>
              ) : (
                <div
                  dir="ltr"
                  className="max-w-[440px] rounded-2xl border border-zinc-200 overflow-hidden bg-white text-left"
                  data-testid="preview-twitter"
                >
                  <Thumb className="w-full aspect-[1.91/1] object-cover" />
                  <div className="px-3 py-2">
                    <p className="text-[13px] text-zinc-500 truncate">{host}</p>
                    <p className="text-[15px] text-zinc-900 truncate">{clip(title, 70)}</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="facebook" className="mt-4">
              <div
                dir="ltr"
                className="max-w-[500px] border border-zinc-200 bg-white text-left"
                data-testid="preview-facebook"
              >
                <Thumb className="w-full aspect-[1.91/1] object-cover" />
                <div className="bg-[#f2f3f5] px-3 py-2.5 border-t border-zinc-200">
                  <p className="text-[12px] text-[#606770] uppercase truncate">{host}</p>
                  <p className="text-[16px] font-semibold text-[#1d2129] leading-tight line-clamp-2">
                    {clip(title, 88)}
                  </p>
                  <p className="text-[14px] text-[#606770] mt-0.5 line-clamp-1">
                    {clip(desc, 110)}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="linkedin" className="mt-4">
              <div
                dir="ltr"
                className="max-w-[520px] rounded-lg border border-zinc-200 bg-white overflow-hidden text-left"
                data-testid="preview-linkedin"
              >
                <Thumb className="w-full aspect-[1.91/1] object-cover" />
                <div className="px-3 py-2.5">
                  <p className="text-[16px] font-semibold text-zinc-900 leading-tight line-clamp-2">
                    {clip(title, 100)}
                  </p>
                  <p className="text-[12px] text-zinc-500 mt-1 truncate">{host}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="discord" className="mt-4">
              <div
                dir="ltr"
                className="max-w-[440px] rounded bg-[#2b2d31] ps-3 py-2 pe-3 border-s-4 border-[#4f545c] text-left"
                data-testid="preview-discord"
              >
                <p className="text-[12px] text-[#dbdee1]">{siteName}</p>
                <p className="text-[16px] font-semibold text-[#00a8fc] leading-tight mt-0.5">
                  {clip(title, 80)}
                </p>
                <p className="text-[14px] text-[#dbdee1] mt-1 line-clamp-3">{clip(desc, 300)}</p>
                {hasImg && (
                  <Thumb className="w-full mt-2 rounded aspect-[1.91/1] object-cover" />
                )}
              </div>
            </TabsContent>

            <TabsContent value="slack" className="mt-4">
              <div
                dir="ltr"
                className="max-w-[440px] ps-3 border-s-4 border-zinc-300 text-left"
                data-testid="preview-slack"
              >
                <p className="text-[13px] font-bold text-zinc-700">{siteName}</p>
                <p className="text-[15px] text-[#1264a3] font-bold leading-tight">
                  {clip(title, 80)}
                </p>
                <p className="text-[13px] text-zinc-700 mt-0.5 line-clamp-2">{clip(desc, 200)}</p>
                {hasImg && (
                  <Thumb className="w-full mt-2 rounded max-w-[360px] aspect-[1.91/1] object-cover" />
                )}
              </div>
            </TabsContent>
          </Tabs>
      </SettingsCard>

      <SettingsCard
        title={t("htmlOutput")}
        action={<CopyButton text={allTags} label={t("copyAll")} successMessage={t("copied")} />}
      >
          <Tabs defaultValue="basic">
            <TabsList>
              <TabsTrigger value="basic">{t("tabBasic")}</TabsTrigger>
              <TabsTrigger value="og">{t("tabOg")}</TabsTrigger>
              <TabsTrigger value="twitter">{t("tabTwitter")}</TabsTrigger>
            </TabsList>
            {(["basic", "og", "twitter"] as const).map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-3">
                <OutputPanel
                  text={tags[tab]}
                  copyLabel={t("copyAll")}
                  copySuccessMessage={t("copied")}
                >
                  <pre dir="ltr" className="p-3.5 text-sm font-mono whitespace-pre-wrap break-words min-h-[80px] text-left">
                    {tags[tab] || "—"}
                  </pre>
                </OutputPanel>
              </TabsContent>
            ))}
          </Tabs>
      </SettingsCard>
      </div>
    </ToolShell>
  );
}
