import { CopyField } from "@/components/ui/CopyField";

export interface Person {
  /** Display name in Arabic. */
  nameAr: string;
  nip05: string;
  npub: string;
  githubUser: string;
  site: string;
  siteLabel: string;
}

function ExternalValue({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-brand-border-ui decoration-1 underline-offset-[3px] transition-colors hover:text-brand-orange hover:decoration-brand-orange active:opacity-70"
    >
      {children}
      <span aria-hidden="true" className="ms-1 text-brand-muted">
        ↗
      </span>
      <span className="sr-only">, يفتح في نافذة جديدة</span>
    </a>
  );
}

/**
 * Role lines are omitted on purpose. There is no verified record of who did
 * what, and printing "founder" or "infrastructure lead" under a collaborator's
 * name would be inventing a claim about a real person, which is the same
 * failure as inventing a fact about the protocol.
 *
 * Keys are never truncated with an ellipsis. A key you cannot read in full is a
 * key you cannot check an impersonator against, which defeats the reason this
 * card exists.
 */
export function PersonCard({ person }: { person: Person }) {
  return (
    <div className="rounded-xl border border-brand-hairline bg-brand-surface p-6">
      <h3 className="text-[20px] leading-[1.45] font-bold">{person.nameAr}</h3>

      <dl className="mt-4 grid gap-x-4 gap-y-2.5 sm:grid-cols-[auto_1fr]">
        <dt className="text-[13px] whitespace-nowrap text-brand-muted">المعرّف</dt>
        <dd className="m-0 font-mono text-[13px] [overflow-wrap:anywhere]">
          <bdi dir="ltr" lang="en">
            {person.nip05}
          </bdi>
        </dd>

        <dt className="text-[13px] whitespace-nowrap text-brand-muted">غيتهاب</dt>
        <dd className="m-0 font-mono text-[13px] [overflow-wrap:anywhere]">
          <ExternalValue href={`https://github.com/${person.githubUser}`}>
            <bdi dir="ltr" lang="en">{`github.com/${person.githubUser}`}</bdi>
          </ExternalValue>
        </dd>

        <dt className="text-[13px] whitespace-nowrap text-brand-muted">الموقع</dt>
        <dd className="m-0 font-mono text-[13px] [overflow-wrap:anywhere]">
          <ExternalValue href={person.site}>
            <bdi dir="ltr" lang="en">
              {person.siteLabel}
            </bdi>
          </ExternalValue>
        </dd>
      </dl>

      <div className="mt-4 border-t border-brand-hairline pt-4">
        <div className="text-[13px] text-brand-muted">المفتاح المعلن</div>
        <div className="mt-2">
          <CopyField value={person.npub} label={`انسخ المفتاح المعلن لـ ${person.nameAr}`} />
        </div>
        <div className="mt-2">
          <ExternalValue href={`https://njump.me/${person.npub}`}>
            <span className="text-[13px]">افتح الحساب</span>
          </ExternalValue>
        </div>
      </div>
    </div>
  );
}
