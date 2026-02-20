import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getBlogPost, blogPosts } from "@/lib/blog-data";
import { Clock, Calendar, Tag, ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

// Dynamically import blog post content
async function getBlogContent(slug: string): Promise<React.ComponentType | null> {
  try {
    const mod = await import(`@/app/blog/posts/${slug}`);
    return mod.default ?? null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post Not Found" };

  const baseUrl = "https://browserytools.com";
  return {
    title: `${post.title} | BrowseryTools Blog`,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      siteName: "BrowseryTools",
      url: `${baseUrl}/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        author: { "@type": "Organization", name: post.author, url: baseUrl },
        publisher: { "@type": "Organization", name: "BrowseryTools", url: baseUrl },
        keywords: post.tags.join(", "),
        url: `${baseUrl}/blog/${slug}`,
        mainEntityOfPage: { "@type": "WebPage", "@id": `${baseUrl}/blog/${slug}` },
      }),
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const PostContent = await getBlogContent(slug);
  const postIndex = blogPosts.findIndex((p) => p.slug === slug);
  const prevPost = postIndex > 0 ? blogPosts[postIndex - 1] : null;
  const nextPost = postIndex < blogPosts.length - 1 ? blogPosts[postIndex + 1] : null;

  return (
    <article className="max-w-4xl mx-auto px-4 py-10">
      {/* Cover */}
      <div className={`rounded-2xl h-48 md:h-64 bg-gradient-to-br ${post.coverGradient} flex items-center justify-center mb-8`}>
        <span className="text-8xl" role="img" aria-label={post.category}>{post.coverEmoji}</span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-muted-foreground">
        <Badge variant="secondary">{post.category}</Badge>
        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime} min read</span>
        <span>By {post.author}</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">{post.title}</h1>
      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{post.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-10">
        {post.tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
            <Tag className="w-3 h-3" />{tag}
          </span>
        ))}
      </div>

      <hr className="mb-10" />

      {/* Content */}
      {PostContent ? (
        <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-code:bg-muted prose-code:px-1 prose-code:rounded prose-pre:bg-muted">
          <PostContent />
        </div>
      ) : (
        <div className="text-muted-foreground text-center py-16">
          Blog content coming soon...
        </div>
      )}

      <hr className="mt-12 mb-8" />

      {/* Navigation */}
      <nav className="flex flex-col sm:flex-row gap-4 justify-between">
        {prevPost ? (
          <Link href={`/blog/${prevPost.slug}`} className="group flex items-center gap-2 text-sm hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="line-clamp-1">{prevPost.title}</span>
          </Link>
        ) : <div />}
        {nextPost ? (
          <Link href={`/blog/${nextPost.slug}`} className="group flex items-center gap-2 text-sm hover:text-primary transition-colors sm:text-right">
            <span className="line-clamp-1">{nextPost.title}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : <div />}
      </nav>

      {/* CTA */}
      <div className="mt-12 rounded-2xl border-2 border-dashed p-8 text-center space-y-3">
        <div className="text-3xl">🛠️</div>
        <h2 className="text-lg font-bold">Try the Tools — 100% Free, No Sign-Up</h2>
        <p className="text-sm text-muted-foreground">
          Everything runs in your browser. No uploads. No accounts. No ads.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">
          Explore All Tools →
        </Link>
      </div>
    </article>
  );
}
