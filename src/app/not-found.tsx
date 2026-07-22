import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
};

/**
 * Renders inside the root layout, which is what sets lang="ar" dir="rtl". A 404
 * built outside that layout ships left-to-right, which is the one bug on this
 * page a reader would notice instantly.
 *
 * Deliberately does not link to /learn. There is no /learn index route, only
 * /learn/[slug], so a link there would be a 404 pointing at another 404.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-24 sm:px-12">
      <h1 className="text-[36px] leading-[1.35] font-bold">الصفحة غير موجودة</h1>
      <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.75] text-brand-muted">
        الرابط الذي فتحته لا يؤدي إلى صفحة على هذا الموقع. قد يكون العنوان قديمًا أو فيه خطأ مطبعي.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-orange px-6 text-[16px] font-bold text-brand-bg transition-opacity hover:opacity-90 active:opacity-75"
        >
          العودة إلى الصفحة الرئيسية
        </Link>
        <Link
          href="/start"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-brand-border-ui px-6 text-[16px] font-bold text-brand-text transition-colors hover:border-brand-orange hover:text-brand-orange active:bg-brand-surface"
        >
          ابدأ من هنا
        </Link>
      </div>
    </main>
  );
}
