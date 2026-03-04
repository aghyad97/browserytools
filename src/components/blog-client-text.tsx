"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

/** Blog header nav: back link + brand title */
export function BlogNavBar() {
  const t = useTranslations("Blog");
  return (
    <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
      <Link
        href="/"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("backToTools")}
      </Link>
      <Link href="/blog" className="font-semibold text-sm">
        {t("blogTitle")}
      </Link>
      <div className="w-24" />
    </div>
  );
}

/** Blog footer note */
export function BlogFooterNote() {
  const t = useTranslations("Blog");
  return (
    <p>
      {t("footerNote")}
    </p>
  );
}

/** Blog page hero title */
export function BlogHeroTitle() {
  const t = useTranslations("Blog");
  return <>{t("blogTitle")}</>;
}

/** Blog page privacy CTA section */
export function BlogPrivacyCta() {
  const t = useTranslations("Blog");
  return (
    <section className="rounded-2xl border-2 border-dashed p-8 text-center space-y-3">
      <div className="text-4xl">🔒</div>
      <h2 className="text-xl font-bold">{t("privacyTitle")}</h2>
      <p className="text-muted-foreground max-w-lg mx-auto text-sm">
        {t("privacyDesc")}
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity mt-2"
      >
        {t("exploreTools")}
      </Link>
    </section>
  );
}

/** Blog section headings (Featured / All Posts) */
export function BlogSectionLabel({ section }: { section: "featured" | "allPosts" }) {
  const t = useTranslations("Blog");
  return (
    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
      {t(section)}
    </h2>
  );
}
