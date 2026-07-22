import { getContentData, getAllContentIds } from "@/lib/content";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import { NextSteps } from "@/components/layout/NextSteps";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * HIGH finding, 2026-07-21 audit. Left unset, this defaults to true, so every
 * request to a non-existent /learn/anything was rendered on demand and its 404
 * written permanently into the on-disk ISR cache. Unauthenticated, no eviction,
 * and therefore unbounded disk growth driven by anyone with a URL bar.
 *
 * false is the root-cause fix rather than a mitigation: an unknown slug is now
 * refused by the router before any render happens, so nothing is written at all.
 * The content set is a fixed directory of markdown files known at build time, so
 * nothing legitimate is lost. Adding a page means adding a file, which rebuilds.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const ids = getAllContentIds();
  return ids.map((id) => ({
    slug: id,
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const content = getContentData(slug);
  
  if (!content) {
    return { title: "الصفحة غير موجودة" };
  }
  
  return {
    // The site suffix comes from the title template in layout.tsx. Appending it
    // here too would render it twice, and it would append the Latin brand form
    // to an otherwise Arabic title.
    title: content.frontmatter.title,
    description: content.frontmatter.description || "نوستر عربيّة",
    // Explicit, because a child inherits the layout's openGraph block whole and
    // every guide would otherwise unfurl as the homepage when shared.
    openGraph: {
      title: content.frontmatter.title,
      description: content.frontmatter.description || "نوستر عربيّة",
      locale: "ar",
      type: "article",
    },
  };
}

export default async function LearnPage({ params }: Params) {
  const { slug } = await params;
  const document = getContentData(slug);

  if (!document) {
    notFound();
  }

  return (
    <main className="flex-1 flex flex-col p-6 sm:p-12 max-w-3xl mx-auto w-full pt-12">
      <article>
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-4">{document.frontmatter.title}</h1>
          {document.frontmatter.description && (
            <p className="text-xl text-brand-muted">{document.frontmatter.description}</p>
          )}
          
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-brand-muted border-t border-brand-muted/20 pt-4">
            {document.frontmatter.lastReviewed && (
              <div>آخر مراجعة: <bdi dir="ltr">{document.frontmatter.lastReviewed}</bdi></div>
            )}
            {document.frontmatter.level && (
              <div className="px-2 py-0.5 bg-brand-surface rounded text-brand-text">المستوى: {document.frontmatter.level}</div>
            )}
            {document.frontmatter.sources && document.frontmatter.sources.length > 0 && (
              <div className="flex gap-2">
                المصادر:
                {document.frontmatter.sources.map((source, i) => (
                  <span key={i} className="font-mono text-xs px-1 bg-brand-surface rounded" dir="ltr">{source}</span>
                ))}
              </div>
            )}
          </div>
        </header>

        <MarkdownRenderer content={document.content} />

        {/* Applied at the template so no guide can ship as a dead end. */}
        <NextSteps steps={["start", "apps", "community", "home"]} current={`/learn/${slug}`} />
      </article>
    </main>
  );
}
