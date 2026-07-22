import { getContentData } from "@/lib/content";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { RelayCopy } from "@/components/relay/RelayCopy";
import { NextSteps } from "@/components/layout/NextSteps";

export async function generateMetadata(): Promise<Metadata> {
  const content = getContentData("start");
  if (!content) return { title: "الصفحة غير موجودة" };
  return {
    // Bare, for the same reason as /apps and /learn/[slug]: layout.tsx owns the
    // suffix via the title template.
    title: content.frontmatter.title,
    description: content.frontmatter.description || "نوستر عربيّة",
    openGraph: {
      title: content.frontmatter.title,
      description: content.frontmatter.description || "نوستر عربيّة",
      locale: "ar",
      type: "article",
    },
  };
}

export default function StartPage() {
  const document = getContentData("start");

  if (!document) {
    notFound();
  }

  return (
    <main className="flex-1 flex flex-col p-6 sm:p-12 max-w-3xl mx-auto w-full pt-12">
      <article>
        <header className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-brand-purple">{document.frontmatter.title}</h1>
          {document.frontmatter.description && (
            <p className="text-xl text-brand-muted">{document.frontmatter.description}</p>
          )}
        </header>

        {/* Adding the Relay Copy widget as a special insertion since it's important for onboarding */}
        <div className="mb-12 p-6 bg-brand-surface rounded-2xl border border-brand-purple/20 flex flex-col items-center gap-4 text-center">
          <h2 className="text-xl font-bold">الريلاي العربي</h2>
          <p className="text-sm text-brand-muted max-w-sm">
            انسخ عنوان الريلاي لإضافته في تطبيق نوستر الخاص بك للاتصال بالمجتمع العربي.
          </p>
          <RelayCopy url="wss://relay.nostrarabia.com" />
        </div>

        <MarkdownRenderer content={document.content} />

        {/* Its own steps name an app to choose, the access rules, and people to
            follow. Before this the page had zero links of any kind. */}
        <NextSteps steps={["apps", "servers", "community", "faq"]} current="/start" />
      </article>
    </main>
  );
}
