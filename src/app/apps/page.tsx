import type { Metadata } from "next";
import { NextSteps } from "@/components/layout/NextSteps";
import data from "@/data/apps.json";

export const metadata: Metadata = {
  // Bare. The suffix comes from the title template in layout.tsx, and repeating
  // it here produced "دليل التطبيقات | نوستر عربيّة | نوستر عربيّة" in the tab.
  title: "دليل التطبيقات",
  description:
    "دليل تطبيقات نوستر، مرتّب حسب ما تريد أن تفعله. كل رابط فيه مفحوص، ومع كل تطبيق ما يعمل عليه وهل واجهته بالعربية.",
  // Set explicitly. A child page inherits the layout's openGraph block whole, so
  // without this the shared card for the directory unfurls as the homepage.
  openGraph: {
    title: "دليل التطبيقات",
    description:
      "دليل تطبيقات نوستر، مرتّب حسب ما تريد أن تفعله. كل رابط فيه مفحوص، ومع كل تطبيق ما يعمل عليه وهل واجهته بالعربية.",
    locale: "ar",
    type: "website",
  },
};

/**
 * The Arabic-interface label is the one thing in this directory that no other
 * Nostr app list publishes, so it is the one thing that must not be guessed.
 *
 * "unknown" deliberately renders NOTHING. Rendering it as "no Arabic" would
 * assert a negative we never tested, which is the same defect as a green status
 * pill with no probe behind it.
 */
const ARABIC_LABEL: Record<string, { text: string; tone: string } | null> = {
  "rtl-ok": { text: "بالعربية", tone: "text-brand-success border-brand-success" },
  /**
   * This tier holds two different situations, so its label must not assert
   * either one.
   *
   *   Blink and Cashu.me: evidence records a COMPLETE translation, with layout
   *   mirroring unconfirmed.
   *   Snort and Iris: translation is INCOMPLETE. Measured on Snort's own files,
   *   810 Arabic keys against 904 English with 746 shared, so 158 user-facing
   *   strings fall back to English. 82.5 percent coverage.
   *
   * Two earlier labels were each wrong for half the tier. "عربية جزئية" was
   * wrong for the two complete ones. "الاتجاه غير مؤكّد" was wrong for the two
   * incomplete ones, and it was reasoned from a byte-size comparison that does
   * not survive contact with UTF-8: Arabic costs two bytes per letter against
   * one for Latin, so a complete Arabic file must be far larger than its English
   * source, not two percent larger. A bigger file was read as evidence of
   * completeness when it was evidence of the opposite.
   *
   * The label now claims only what is known across all four.
   */
  partial: { text: "لم نتحقّق بالكامل", tone: "text-brand-warning border-brand-warning" },
  poor: { text: "الواجهة إنجليزية", tone: "text-brand-neutral border-brand-neutral" },
  unknown: null,
};

function Chip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    // 13px, the micro step of the scale, not 11. Arabic renders optically
    // smaller than Latin at the same pixel size, which is the whole reason this
    // site sets a 17px base, and an 11px chip contradicted that in the one place
    // carrying the label a reader is scanning for.
    <span
      className={`inline-block shrink-0 rounded border px-1.5 text-[13px] leading-[1.7] font-bold whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
}

export default function AppsPage() {
  const totalCategories = data.categories.length;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-24 sm:px-8">
      <section className="max-w-[68ch] py-12 sm:py-16">
        <h1 className="text-[36px] leading-[1.35] font-extrabold">دليل التطبيقات</h1>
        <p className="mt-4 text-[17px] leading-[1.75] text-brand-muted">
          مفتاح واحد يعمل في كل ما هنا، ولا تسجيل في أيٍّ منها. الدليل مرتّب حسب ما تريد أن تفعله،
          لا حسب نوع البرنامج، فابدأ من الفئة التي تصف حاجتك.
        </p>

        <dl className="mt-8 grid gap-3 border-t border-brand-hairline pt-6 text-[15px] leading-[1.7]">
          <div className="flex flex-wrap items-baseline gap-2">
            <dt>
              <Chip className="text-brand-success border-brand-success">بالعربية</Chip>
            </dt>
            <dd className="text-brand-muted">
              {/*
                Says only what was measured. The earlier wording also asserted
                right-to-left layout, and the evidence behind at least one badged
                app records a complete Arabic translation with nothing about
                layout mirroring. The translated-versus-merely-accepts-Arabic
                distinction is the one that was actually tested, and it is the
                one that matters to the reader.
              */}
              واجهة التطبيق نفسها مترجمة إلى العربية، لا أنّها تقبل الكتابة بالعربية فحسب.
            </dd>
          </div>
          <div className="flex flex-wrap items-baseline gap-2">
            <dt>
              <Chip className="text-brand-warning border-brand-warning">لم نتحقّق بالكامل</Chip>
            </dt>
            <dd className="text-brand-muted">
              الترجمة موجودة، ولم نقِس اكتمالها ولا تأكّدنا من اتجاه العرض.
            </dd>
          </div>
          <div className="flex flex-wrap items-baseline gap-2">
            <dt>
              <Chip className="text-brand-orange border-brand-orange">ابدأ بهذا</Chip>
            </dt>
            <dd className="text-brand-muted">
              الوصف المعتمد لهذا التطبيق يوصي بالبدء به. الوسم يتبع الوصف ولا يُضاف من عندنا.
            </dd>
          </div>
          <div className="text-brand-muted">
            غياب وسم اللغة يعني أنّنا لم نفحص الواجهة بعد، لا أنّها بلا عربية.
          </div>
        </dl>

        <p className="mt-6 text-[13px] leading-[1.65] text-brand-muted">
          <bdi dir="ltr">{data.totalApps}</bdi> تطبيقاً في <bdi dir="ltr">{totalCategories}</bdi> فئة.
          كل عنوان فيها فُتح وفُحص بتاريخ <bdi dir="ltr">{data.generated}</bdi>.
        </p>
      </section>

      {/* With eighteen shelves the reader needs a way in that is not scrolling. */}
      <nav aria-label="فئات التطبيقات" className="border-y border-brand-hairline py-4">
        <ul className="flex flex-wrap gap-x-4 gap-y-2">
          {data.categories.map((c) => (
            <li key={c.slug}>
              <a
                href={`#${c.slug}`}
                className="inline-block py-1 text-[14px] text-brand-muted transition-colors hover:text-brand-orange active:opacity-70"
              >
                {c.nameAr}{" "}
                <bdi dir="ltr" className="text-brand-neutral">
                  {c.apps.length}
                </bdi>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {data.categories.map((category) => (
        <section key={category.slug} id={category.slug} className="border-t border-brand-hairline pt-8 pb-2">
          <h2 className="text-[22px] leading-[1.45] font-extrabold text-brand-purple">
            {category.nameAr}
          </h2>
          <p className="mt-1.5 max-w-[66ch] text-[15px] leading-[1.7] text-brand-muted">
            {category.descAr}
          </p>

          <ul className="mt-4">
            {category.apps.map((app) => {
              const label = ARABIC_LABEL[app.arabicSupport] ?? null;
              return (
                <li key={app.name} className="border-t border-brand-hairline py-3 first:border-t-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[15px] font-bold underline decoration-brand-border-ui decoration-1 underline-offset-4 transition-colors hover:text-brand-orange hover:decoration-brand-orange active:opacity-70"
                    >
                      <bdi dir="ltr" lang="en">
                        {app.name}
                      </bdi>
                      <span aria-hidden="true" className="ms-1 text-brand-muted">
                        ↗
                      </span>
                      <span className="sr-only">, يفتح في نافذة جديدة</span>
                    </a>
                    <Chip className="border-brand-hairline font-normal text-brand-muted">
                      {app.platformsAr}
                    </Chip>
                    {label && <Chip className={label.tone}>{label.text}</Chip>}
                    {app.pick && (
                      <Chip className="text-brand-orange border-brand-orange">ابدأ بهذا</Chip>
                    )}
                  </div>
                  <p className="mt-1 max-w-[70ch] text-[14px] leading-[1.7] text-brand-muted">
                    {app.descAr}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <p className="mt-10 border-t border-brand-hairline pt-6 text-[14px] leading-[1.7] text-brand-muted">
        القائمة تنمو. كل رابط فيها فُحص وهو يعمل، وما توقّف نحذفه. الإدراج هنا ليس تزكية،
        وإنّما يعني أنّ التطبيق موجود ويعمل على نوستر.
      </p>

      {/* 121 rows across 18 sections and no way onward was a dead end. */}
      <NextSteps steps={["start", "community", "servers", "home"]} current="/apps" />
    </main>
  );
}
