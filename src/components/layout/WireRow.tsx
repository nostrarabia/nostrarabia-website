import React from "react";
import { CopyField } from "@/components/ui/CopyField";

interface WireRowProps {
  label: string;
  value: string;
  copyLabel: string;
  status?: React.ReactNode;
  micro?: React.ReactNode;
}

/**
 * The signature element. Hairlines above and below only, no box, no fill, no
 * radius, so it reads as a seam rather than a card.
 *
 * The 2px purple tick sits at the inline-start edge of the value, marking
 * exactly where Arabic ends and machine text begins. Making the bidi seam
 * visible on purpose is the one memorable gesture on the page, and it carries
 * the lineage of the purple in the original site's gradient.
 *
 * The row itself is never clickable. Everything actionable inside it is its own
 * control, so there is no ambiguous hit target wrapping a copy button.
 */
export function WireRow({ label, value, copyLabel, status, micro }: WireRowProps) {
  return (
    <div className="border-t border-brand-hairline last:border-b">
      <div className="flex flex-wrap items-center gap-4 py-4">
        <span className="flex min-w-[175px] flex-wrap items-center gap-3">
          <b className="text-[15px] font-bold">{label}</b>
          {status}
        </span>
        <CopyField value={value} label={copyLabel} className="ms-auto" />
        {micro && (
          <span className="basis-full text-[14px] leading-[1.7] text-brand-muted">{micro}</span>
        )}
      </div>
    </div>
  );
}
