import Link from "next/link";

/**
 * The site's own graph had almost no edges.
 *
 * Measured by the consortium on the served build: fourteen of sixteen routes
 * contained zero onward links inside main. /start, the destination of the hero
 * CTA, the header, the footer and the 404 page, had zero links of any kind while
 * its copy issued four instructions naming places the reader could not reach.
 * Every one of the twelve guides terminated, so a reader who finished one had
 * nothing but the footer.
 *
 * This is the fix for that, applied at the template so no guide can be added
 * without one. Each entry names a destination and the reason a reader who just
 * finished this page would want it. The current page is filtered out, because an
 * onward link pointing at where you already are is noise.
 */

export type StepKey = "start" | "apps" | "community" | "servers" | "faq" | "home";

const STEPS: Record<StepKey, { href: string; label: string; why: string }> = {
  start: { href: "/start", label: "ابدأ من هنا", why: "أنشئ مفتاحك في خطوات قليلة." },
  apps: { href: "/apps", label: "دليل التطبيقات", why: "اختر تطبيقاً يناسب جهازك وحاجتك." },
  community: { href: "/community", label: "المجتمع والأعضاء", why: "تابع أعضاء نوستر عربيّة." },
  servers: { href: "/#servers", label: "الخوادم", why: "عنوانا الريلاي وخادم الوسائط." },
  faq: { href: "/learn/faq", label: "أسئلة شائعة", why: "أجوبة قصيرة عن أكثر ما يُسأل." },
  home: { href: "/", label: "الصفحة الرئيسية", why: "ما هو نوستر ولماذا هذا المشروع." },
};

interface NextStepsProps {
  steps: StepKey[];
  /** Route of the page rendering this, so it never links to itself. */
  current?: string;
  title?: string;
}

export function NextSteps({ steps, current, title = "وبعد هذا" }: NextStepsProps) {
  const shown = steps.map((k) => STEPS[k]).filter((s) => s.href !== current);
  if (!shown.length) return null;

  return (
    <nav aria-labelledby="next-steps" className="mt-12 border-t border-brand-hairline pt-8">
      <h2 id="next-steps" className="text-[18px] leading-[1.5] font-bold">
        {title}
      </h2>
      <ul className="mt-4 grid gap-px overflow-hidden rounded-lg border border-brand-hairline bg-brand-hairline sm:grid-cols-2">
        {shown.map((step) => (
          <li key={step.href} className="bg-brand-bg">
            <Link
              href={step.href}
              className="flex min-h-[44px] flex-col justify-center gap-1 p-4 transition-colors hover:bg-brand-surface active:opacity-70"
            >
              <span className="text-[15px] font-bold text-brand-orange">{step.label}</span>
              <span className="text-[14px] leading-[1.7] text-brand-muted">{step.why}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
