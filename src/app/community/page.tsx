import type { Metadata } from "next";
import Link from "next/link";
import { NextSteps } from "@/components/layout/NextSteps";
import { notFound } from "next/navigation";
import { getContentData } from "@/lib/content";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import data from "@/data/members.json";

export async function generateMetadata(): Promise<Metadata> {
  const content = getContentData("community");
  const title = content?.frontmatter.title ?? "المجتمع";
  const description =
    "أعضاء نوستر عربيّة، وهم أصحاب المعرّفات التي يصدرها المشروع والمعتمدون للنشر على ريلايه.";
  return {
    title,
    description,
    openGraph: { title, description, locale: "ar", type: "article" },
  };
}

export default function CommunityPage() {
  const document = getContentData("community");
  if (!document) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-24 sm:px-8">
      <article className="max-w-[68ch] py-12 sm:py-16">
        <h1 className="text-[36px] leading-[1.35] font-extrabold">{document.frontmatter.title}</h1>
        {document.frontmatter.description && (
          <p className="mt-4 text-[17px] leading-[1.75] text-brand-muted">
            {document.frontmatter.description}
          </p>
        )}
        <div className="mt-10">
          <MarkdownRenderer content={document.content} />
        </div>
      </article>

      <section id="members" className="border-t border-brand-hairline pt-10">
        <h2 className="text-[28px] leading-[1.4] font-extrabold">أعضاء نوستر عربيّة</h2>
        <p className="mt-2.5 max-w-[66ch] text-[17px] leading-[1.75] text-brand-muted">
          هؤلاء أصحاب المعرّفات التي يصدرها المشروع، وهم أنفسهم المعتمدون للنشر على ريلاينا. أي
          منشور تقرأه من ريلاينا كتبه واحد من هؤلاء.
        </p>
        {/*
          The claim above is only true while the served identities and the relay
          whitelist are the same set. scripts/build-members.mjs reads both and
          refuses to regenerate this list if they have diverged, so the claim
          cannot quietly rot into a falsehood.
        */}
        <p className="mt-3 max-w-[66ch] text-[15px] leading-[1.7] text-brand-muted">
          القائمة مولّدة من الملف الذي يخدمه هذا الموقع ومن قائمة الريلاي نفسها، ولا تُبنى إن
          اختلفتا. تحقّق بنفسك من{" "}
          <a
            href="/.well-known/nostr.json"
            className="underline decoration-brand-border-ui decoration-1 underline-offset-[3px] transition-colors hover:text-brand-orange hover:decoration-brand-orange active:opacity-70"
          >
            الملف مباشرة
          </a>
          .
        </p>

        <p className="mt-6 text-[13px] leading-[1.65] text-brand-muted">
          <bdi dir="ltr">{data.count}</bdi> عضواً.
        </p>

        {/* The 1px gaps over a hairline background become the rules, so cell
            dividers never double up at the seams. */}
        <ul className="mt-4 grid gap-px overflow-hidden rounded-lg border border-brand-hairline bg-brand-hairline sm:grid-cols-2 lg:grid-cols-3">
          {data.members.map((member) => (
            <li key={member.npub} className="flex flex-col gap-1 bg-brand-bg p-4 hover:bg-brand-surface">
              <a
                href={`https://njump.me/${member.npub}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] font-bold underline decoration-brand-border-ui decoration-1 underline-offset-4 transition-colors hover:text-brand-orange hover:decoration-brand-orange active:opacity-70"
              >
                <bdi dir="ltr" lang="en">
                  {member.handle}
                </bdi>
                <span aria-hidden="true" className="ms-1 text-brand-muted">
                  ↗
                </span>
                <span className="sr-only">, يفتح الحساب في نافذة جديدة</span>
              </a>
              <bdi
                dir="ltr"
                lang="en"
                className="font-mono text-[13px] leading-[1.6] text-brand-muted [overflow-wrap:anywhere]"
              >
                {member.nip05}
              </bdi>
            </li>
          ))}
        </ul>

        <p className="mt-6 max-w-[66ch] text-[14px] leading-[1.7] text-brand-muted">
          الإدراج هنا لا يعني أنّ المشروع يوافق على كل ما ينشره الحساب. وللانضمام إلى القائمة،
          راجع{" "}
          <Link
            href="/#publishing"
            className="underline decoration-brand-border-ui decoration-1 underline-offset-[3px] transition-colors hover:text-brand-orange hover:decoration-brand-orange active:opacity-70"
          >
            قواعد النشر على ريلاينا
          </Link>
          .
        </p>

        <NextSteps steps={["start", "apps", "servers", "home"]} current="/community" />
      </section>
    </main>
  );
}
