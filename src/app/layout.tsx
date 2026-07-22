import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic", "latin"],
  display: "swap",
});

/**
 * Indexing is OFF unless explicitly switched on.
 *
 * This may run on a preview URL while nostrarabia.com still serves the existing
 * landing page. An indexable copy on a second hostname would compete with
 * the real apex for the project's own name. Default-deny means forgetting to set
 * this costs visibility, and forgetting to unset it would cost a live site, so
 * the failure that stays quiet is the harmless one.
 *
 * This is a BUILD-time flag. Every route here is statically prerendered, so the
 * resulting meta tag is compiled into the HTML and setting the variable in the
 * host's environment changes nothing until a redeploy. src/app/robots.ts carries
 * the same gate and the same caveat.
 */
const indexable = process.env.NOSTRARABIA_ALLOW_INDEXING === "true";

export const metadata: Metadata = {
  title: {
    default: "نوستر عربيّة",
    template: "%s | نوستر عربيّة",
  },
  description:
    "طريق عربي للدخول إلى نوستر. شرح من أوّله، ودليل تطبيقات مفحوص، وريلاي وخادم وسائط نشغّلهما للمجتمع.",
  robots: indexable ? undefined : { index: false, follow: false },
  openGraph: {
    title: "نوستر عربيّة",
    description:
      "طريق عربي للدخول إلى نوستر. شرح من أوّله، ودليل تطبيقات مفحوص، وريلاي وخادم وسائط نشغّلهما للمجتمع.",
    locale: "ar",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${notoSansArabic.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-brand-bg text-brand-text">
        {/*
          WCAG 2.4.1. There was no bypass mechanism anywhere in the app, and the
          header nav now wraps to two rows on narrow screens, so it precedes the
          content on every route. Visible only on focus.
        */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:m-3 focus:rounded-lg focus:bg-brand-orange focus:px-4 focus:py-2 focus:text-[15px] focus:font-bold focus:text-brand-bg"
        >
          تخطَّ إلى المحتوى
        </a>
        <Header />
        <div id="main" tabIndex={-1} className="flex flex-1 flex-col">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
