"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MetaFields { title: string; description: string; url: string; image: string; twitterHandle: string; type: string }

function esc(s: string) { return s.replace(/"/g, "&quot;"); }

function buildTags(f: MetaFields) {
  const basic = [
    f.title && `<title>${esc(f.title)}</title>`,
    f.description && `<meta name="description" content="${esc(f.description)}">`,
    f.url && `<link rel="canonical" href="${esc(f.url)}">`,
  ].filter(Boolean).join("\n");

  const og = [
    f.title && `<meta property="og:title" content="${esc(f.title)}">`,
    f.description && `<meta property="og:description" content="${esc(f.description)}">`,
    f.url && `<meta property="og:url" content="${esc(f.url)}">`,
    f.image && `<meta property="og:image" content="${esc(f.image)}">`,
    f.type && `<meta property="og:type" content="${esc(f.type)}">`,
  ].filter(Boolean).join("\n");

  const twitter = [
    `<meta name="twitter:card" content="${f.image ? "summary_large_image" : "summary"}">`,
    f.title && `<meta name="twitter:title" content="${esc(f.title)}">`,
    f.description && `<meta name="twitter:description" content="${esc(f.description)}">`,
    f.image && `<meta name="twitter:image" content="${esc(f.image)}">`,
    f.twitterHandle && `<meta name="twitter:site" content="${esc(f.twitterHandle)}">`,
  ].filter(Boolean).join("\n");

  return { basic, og, twitter };
}

export default function MetaTagsGenerator() {
  const t = useTranslations("Tools.MetaTagsGenerator");
  const [fields, setFields] = useState<MetaFields>({ title: "", description: "", url: "", image: "", twitterHandle: "", type: "website" });
  const set = (k: keyof MetaFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFields(f => ({ ...f, [k]: e.target.value }));
  const tags = buildTags(fields);
  const allTags = [tags.basic, tags.og, tags.twitter].filter(Boolean).join("\n\n");

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>{t("siteTitle")}</Label><Input value={fields.title} onChange={set("title")} placeholder={t("siteTitlePlaceholder")} /></div>
            <div className="space-y-2"><Label>{t("siteUrl")}</Label><Input value={fields.url} onChange={set("url")} placeholder={t("siteUrlPlaceholder")} dir="ltr" /></div>
          </div>
          <div className="space-y-2">
            <Label>{t("siteDescription")}</Label>
            <Textarea dir="auto" value={fields.description} onChange={set("description")} placeholder={t("siteDescriptionPlaceholder")} className="resize-none" rows={3} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>{t("ogImage")}</Label><Input value={fields.image} onChange={set("image")} placeholder={t("ogImagePlaceholder")} dir="ltr" /></div>
            <div className="space-y-2"><Label>{t("twitterHandle")}</Label><Input value={fields.twitterHandle} onChange={set("twitterHandle")} placeholder={t("twitterHandlePlaceholder")} dir="ltr" /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base">{t("htmlOutput")}</CardTitle>
            <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(allTags); toast.success(t("copied")); }}>{t("copyAll")}</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic">
            <TabsList>
              <TabsTrigger value="basic">{t("tabBasic")}</TabsTrigger>
              <TabsTrigger value="og">{t("tabOg")}</TabsTrigger>
              <TabsTrigger value="twitter">{t("tabTwitter")}</TabsTrigger>
            </TabsList>
            {(["basic", "og", "twitter"] as const).map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-3 space-y-2">
                <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap min-h-[80px]">{tags[tab] || "—"}</pre>
                <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(tags[tab]); toast.success(t("copied")); }}>{t("copyAll")}</Button>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
