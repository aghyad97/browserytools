import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { blogPosts, getFeaturedPosts, getPostsByLocale } from "@/lib/blog-data";
import type { Locale } from "@/lib/locales";
import { Clock, Tag } from "lucide-react";
import { BlogHeroTitle, BlogPrivacyCta, BlogSectionLabel } from "@/components/blog-client-text";

/**
 * The blog index, rendered for an explicit locale.
 *
 * Extracted from `src/app/blog/page.tsx` so `/blog` (locale from cookie) and
 * `/{locale}/blog` (locale from the URL) render exactly the same listing.
 * Post links stay unprefixed: translated posts already have their own
 * top-level URLs via the `-<locale>` slug suffix, and those are the canonical
 * ones.
 */
function PostCard({ post }: { post: typeof blogPosts[0]; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl border bg-card hover:border-primary/50 hover:shadow-md transition-all overflow-hidden"
    >
      {/* Cover visual */}
      <div className={`h-32 bg-gradient-to-br ${post.coverGradient} flex items-center justify-center`}>
        <span className="text-6xl" role="img" aria-label={post.category}>{post.coverEmoji}</span>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">{post.category}</Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />{post.readTime} min read
          </span>
        </div>

        <h2 className="font-semibold text-base leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h2>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {post.description}
        </p>

        <div className="flex items-center justify-between">
          <time className="text-xs text-muted-foreground">
            {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </time>
          <span className="text-xs text-primary font-medium group-hover:underline">Read more →</span>
        </div>
      </div>
    </Link>
  );
}

export function BlogIndex({ locale }: { locale: Locale }) {

  const featured = getFeaturedPosts(locale);
  const rest = getPostsByLocale(locale).filter((p) => !p.featured);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <Badge className="mb-2">Privacy-First Tools</Badge>
        <h1 className="text-4xl font-bold tracking-tight">
          <BlogHeroTitle />
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Guides, tips and tutorials on using free browser-based tools that respect your privacy.
          No uploads. No tracking. No nonsense.
        </p>
      </div>

      {/* Featured posts */}
      {featured.length > 0 && (
        <section>
          <BlogSectionLabel section="featured" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((post) => (
              <PostCard key={post.slug} post={post} featured />
            ))}
          </div>
        </section>
      )}

      {/* All posts */}
      <section>
        <BlogSectionLabel section="allPosts" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <BlogPrivacyCta />
    </div>
  );
}
