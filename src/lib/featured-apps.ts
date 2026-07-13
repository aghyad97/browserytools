import { FileIcon, ImagesIcon, MicIcon, VideoIcon } from "lucide-react";

/**
 * Featured "Apps" strip on the landing (spec §6 / task-8 delta 2).
 *
 * HONESTY RULE: every entry MUST point at a live production route. No card
 * without a shipped tool. The prototype's aspirational apps (Subtitle Studio,
 * Chat-with-PDF, Invoice Studio) are intentionally NOT here.
 *
 * Growth waves swap entries in as they ship — add the new tool's `slug`/`href`
 * once its route is live, then drop the one it supersedes.
 *
 * Localized name + description are NOT duplicated here; the landing resolves
 * them from the existing `ToolsConfig.tools.<slug>` keys (binding: existing
 * i18n keys only). This file owns only the card's identity: which live tool,
 * its icon, and the decorative on-device vignette to render.
 */
export interface FeaturedApp {
  /** ToolsConfig slug — resolves the localized name + description. */
  slug: string;
  /** Live production route. Must exist in tools-config. */
  href: string;
  /** Lucide icon component for the card mark. */
  icon: typeof FileIcon;
  /**
   * Decorative vignette variant (see AppViz in landing.tsx). Each value renders
   * a tiny, faithful miniature of what the app *does* — not an abstract skeleton.
   */
  viz: "transcribe" | "pdf" | "compress" | "record";
}

export const FEATURED_APPS: FeaturedApp[] = [
  {
    slug: "audio-transcriber",
    href: "/tools/audio-transcriber",
    icon: MicIcon,
    viz: "transcribe",
  },
  {
    slug: "pdf",
    href: "/tools/pdf",
    icon: FileIcon,
    viz: "pdf",
  },
  {
    slug: "image-compression",
    href: "/tools/image-compression",
    icon: ImagesIcon,
    viz: "compress",
  },
  {
    slug: "screen-recorder",
    href: "/tools/screen-recorder",
    icon: VideoIcon,
    viz: "record",
  },
];
