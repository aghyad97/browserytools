import { generateToolMetadata } from "@/lib/metadata";
import path from "path";
import fs from "fs";
import PhoneMockups from "@/components/PhoneMockups";

export const metadata = generateToolMetadata("/tools/phone-mockups");

type MockupItem = {
  filename: string;
  url: string;
  brand: string;
  model: string;
  orientation: "portrait" | "landscape" | "front" | "left" | "right";
  aspectRatio: number | null;
};

type MockupGroup = {
  key: string;
  brand: string;
  model: string;
  items: MockupItem[];
};

const ORIENTATION_KEYS = [
  "portrait",
  "landscape",
  "front",
  "left",
  "right",
] as const;

function parseFilename(file: string): Omit<MockupItem, "url"> {
  const name = file.replace(/\.png$/i, "");
  const parts = name.split("-");
  let orientation: MockupItem["orientation"] = "portrait";
  for (const key of ORIENTATION_KEYS) {
    if (name.endsWith(key)) {
      orientation = key;
      break;
    }
  }

  const brand = prettifyBrand(parts[0] ?? "unknown");

  const withoutBrand = parts.slice(1);
  const maybeModelTokens: string[] = [];
  for (let i = 0; i < withoutBrand.length; i++) {
    const token = withoutBrand[i];
    if (ORIENTATION_KEYS.includes(token as any)) break;
    maybeModelTokens.push(token);
  }
  const modelRaw = maybeModelTokens.join(" ");
  const model = prettifyModel(modelRaw);

  return {
    filename: file,
    brand,
    model: model || name,
    orientation,
    aspectRatio: null,
  };
}

function prettifyBrand(raw: string): string {
  const map: Record<string, string> = {
    apple: "Apple",
    samsung: "Samsung",
    google: "Google",
    huawei: "Huawei",
    motorola: "Motorola",
    microsoft: "Microsoft",
    dell: "Dell",
    nokia: "Nokia",
  };
  const key = raw.toLowerCase();
  return map[key] ?? capitalizeFirst(raw);
}

function prettifyModel(modelRaw: string): string {
  let m = modelRaw
    .replace(
      /\b(black|gold|cloudblue|rose|obsidian|space|grey|gray|aluminum|titanium|orange|ocean|band|closed|front)\b/gi,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();

  if (!m) return m;

  // Insert spaces between letters and numbers and common suffixes
  m = m
    .replace(/([a-zA-Z]+)(\d+)/g, "$1 $2")
    .replace(/(\d+)([a-zA-Z]+)/g, "$1 $2")
    .replace(/(galaxy)([a-z0-9]+)/i, "Galaxy $2")
    .replace(/\b(s\d{1,2})(ultra|plus|max|pro)\b/gi, (s) =>
      s.replace(/(s\d{1,2})([a-z]+)/i, "$1 $2")
    );

  // Title case words
  m = m
    .split(/\s+/)
    .map((w) => capitalizeFirst(w))
    .join(" ");

  // Apple-style i prefix
  m = m
    .replace(/\bIphone\b/g, "iPhone")
    .replace(/\bIpad\b/g, "iPad")
    .replace(/\bIpod\b/g, "iPod");

  return m.trim();
}

function capitalizeFirst(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function loadGroups(): Promise<MockupGroup[]> {
  const publicDir = path.join(process.cwd(), "public", "mockup_templates");
  const files = fs
    .readdirSync(publicDir)
    .filter((f) => f.toLowerCase().endsWith(".png"));

  const items: MockupItem[] = files.map((file) => {
    const parsed = parseFilename(file);
    return {
      ...parsed,
      url: `/mockup_templates/${file}`,
    };
  });

  const groupsMap = new Map<string, MockupGroup>();
  for (const item of items) {
    const key = `${item.brand}:${item.model}`.toLowerCase();
    if (!groupsMap.has(key)) {
      groupsMap.set(key, {
        key,
        brand: item.brand,
        model: item.model,
        items: [],
      });
    }
    groupsMap.get(key)!.items.push(item);
  }

  const groups = Array.from(groupsMap.values()).sort((a, b) => {
    const priority = (brand: string) => {
      const n = brand.toLowerCase();
      if (n.startsWith("apple")) return 0;
      if (n.startsWith("google")) return 1;
      if (n.startsWith("samsung")) return 2;
      return 3;
    };
    const pa = priority(a.brand) - priority(b.brand);
    if (pa !== 0) return pa;
    return (a.model || "").localeCompare(b.model || "");
  });

  return groups;
}

export default async function PhoneMockupsPage() {
  const groups = await loadGroups();
  return <PhoneMockups groups={groups} />;
}
