import Link from "next/link";

const EXPLORE = [
  { href: "/start", label: "ابدأ" },
  { href: "/apps", label: "دليل التطبيقات" },
  { href: "/#servers", label: "الخوادم" },
  { href: "/#follow", label: "تابعنا على نوستر" },
  { href: "/#support", label: "ادعم التشغيل" },
];

const LEARN = [
  { href: "/learn/what-is-nostr", label: "ما هو نوستر" },
  { href: "/learn/security", label: "الأمان" },
  { href: "/learn/relays", label: "الريلايات" },
  { href: "/learn/zaps", label: "الزاب" },
  { href: "/learn/faq", label: "أسئلة شائعة" },
  { href: "/learn/glossary", label: "المصطلحات" },
];

const PROJECT = [
  { href: "/learn/about", label: "عن المشروع" },
  { href: "/community", label: "المجتمع والأعضاء" },
  { href: "/learn/nostr-address", label: "عنوان نوستر" },
  { href: "/learn/privacy", label: "الخصوصية" },
  { href: "/learn/credits", label: "الحقوق والائتمان" },
];

const STACK = [
  { name: "strfry", href: "https://github.com/hoytech/strfry" },
  { name: "noteguard", href: "https://github.com/damus-io/noteguard" },
  { name: "blossom-server", href: "https://github.com/hzrd149/blossom-server" },
];

function Column({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-[14px] font-bold text-brand-text">{title}</h2>
      <ul className="mt-3 flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              // Same 24px floor as the header nav, for the same reason: these
              // are standalone navigation, not links inside a sentence.
              className="inline-block min-h-[24px] min-w-[24px] py-1 text-[14px] text-brand-muted transition-colors hover:text-brand-orange active:opacity-70"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 w-full border-t border-brand-hairline bg-brand-surface py-10">
      <div className="mx-auto grid max-w-5xl gap-8 px-6 sm:grid-cols-2 md:grid-cols-4 sm:px-8">
        <div>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-[16px] font-extrabold text-brand-text">نوستر عربيّة</span>
            <bdi dir="ltr" lang="en" className="tracking-latin text-[14px] font-bold text-brand-muted">
              NostrArabia
            </bdi>
          </div>
          <p className="mt-3 max-w-[36ch] text-[14px] leading-[1.7] text-brand-muted">
            طريق عربي للدخول إلى نوستر، وريلاي وخادم وسائط نشغّلهما للمجتمع.
          </p>
        </div>

        <Column title="استكشف" items={EXPLORE} />
        <Column title="تعلّم المزيد" items={LEARN} />
        <Column title="المشروع" items={PROJECT} />
      </div>

      <div className="mx-auto mt-10 max-w-5xl border-t border-brand-hairline px-6 pt-6 sm:px-8">
        {/*
          Never ship this as one plain string. An Arabic waw abutting a Latin
          token puts strong-RTL directly against strong-LTR with no isolation,
          and the bidi algorithm reorders it differently across browsers. Each
          name is isolated on its own, and the waw stays outside the isolate.
        */}
        <p className="text-[14px] leading-[1.7] text-brand-muted">
          مبنيّ باستخدام{" "}
          {STACK.map((tool, i) => (
            <span key={tool.name}>
              {i > 0 ? "و" : null}
              <a
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-brand-border-ui decoration-1 underline-offset-[3px] transition-colors hover:text-brand-orange hover:decoration-brand-orange"
              >
                <bdi dir="ltr" lang="en">
                  {tool.name}
                </bdi>
              </a>
              {i < STACK.length - 1 ? " " : "."}
            </span>
          ))}
        </p>

        <p className="mt-2 max-w-[70ch] text-[14px] leading-[1.7] text-brand-muted">
          شيفرة الموقع برخصة{" "}
          <bdi dir="ltr" lang="en">
            MIT
          </bdi>
          ، والمحتوى برخصة{" "}
          <bdi dir="ltr" lang="en">
            CC BY-SA 4.0
          </bdi>
          . أعد استخدام المحتوى وترجمته بحرّية، وانسب المصدر وأبقِ الرخصة نفسها.
        </p>

        <p className="mt-3 text-[14px] font-bold text-brand-text">لا نطلب رقمك السري أبداً.</p>
      </div>
    </footer>
  );
}
