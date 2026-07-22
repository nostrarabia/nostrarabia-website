"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/start", label: "ابدأ" },
  { href: "/learn/what-is-nostr", label: "تعرّف على نوستر" },
  { href: "/apps", label: "التطبيقات" },
  { href: "/#servers", label: "الخوادم" },
  { href: "/learn/faq", label: "أسئلة شائعة" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-hairline bg-brand-bg/90 backdrop-blur">
      {/*
        The header wraps to a second row on narrow screens rather than hiding
        the navigation. Hiding it left a phone reader who opened /apps from a
        shared link with no way to reach /start except scrolling past 121 apps
        to the footer, and there is no drawer here to hide it behind.
      */}
      {/* max-w-5xl and the same padding as main and footer. It was max-w-6xl,
          which put the wordmark on a different grid from every page below it. */}
      <div className="mx-auto flex min-h-16 max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-6 py-2 sm:px-8">
        {/*
          Bilingual lockup. Arabic leads because the site is Arabic-first. The
          Latin form stays because the domain, the relay and the repositories all
          carry it, so a visitor arriving from a relay directory must recognise
          the page as the one they were sent to.

          The divider is a border, not a character. A middot between an Arabic
          and a Latin run is bidi-neutral and reorders unpredictably across
          browsers. A border cannot reorder.

          The two sizes are deliberately unequal because Arabic renders optically
          smaller than Latin at the same pixel size, and the pair has to read as
          one lockup rather than two separate words.
        */}
        {/*
          The name is explicit because the two spans concatenate into
          "نوستر عربيّةNostrArabia" when a screen reader derives the name from
          contents. The visual gap is CSS, and CSS gaps are not word separators.
        */}
        <Link href="/" aria-label="نوستر عربيّة NostrArabia، الصفحة الرئيسية" className="inline-flex items-center gap-2.5">
          <span className="text-[1.2rem] leading-[1.2] font-extrabold text-brand-purple">
            نوستر عربيّة
          </span>
          <bdi
            dir="ltr"
            lang="en"
            className="tracking-latin hidden border-s border-brand-hairline ps-2.5 text-[0.92rem] leading-[1.2] font-bold text-brand-muted min-[420px]:inline"
          >
            NostrArabia
          </bdi>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-4 gap-y-0 text-[14px] sm:gap-x-5 sm:text-[15px]">
          {NAV.map((item) => {
            const active = !item.href.includes("#") && pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                // min-w keeps a two-letter Arabic label above the 24px floor of
                // WCAG 2.5.8. These are standalone navigation, so the exception
                // for links inline in a sentence does not apply to them.
                className={`relative inline-block min-w-[24px] py-1.5 transition-colors ${
                  active
                    ? "text-brand-text after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-brand-orange after:content-['']"
                    : "text-brand-muted hover:text-brand-text active:opacity-70"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
