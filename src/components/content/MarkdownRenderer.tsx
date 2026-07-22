import ReactMarkdown from "react-markdown";

type WithNode = { node?: unknown };

/**
 * react-markdown hands every custom component the mdast node it came from.
 * Spreading that straight onto a DOM element emitted an invalid
 * node="[object Object]" attribute on every heading, paragraph, list item, link
 * and blockquote across all 16 content pages: invalid HTML, and kilobytes of
 * noise in the served markup.
 *
 * Dropping it by destructuring would leave an unused binding in eleven places.
 * Removing the key explicitly says what is happening and why, once.
 */
function withoutNode<T extends WithNode>(props: T): Omit<T, "node"> {
  const rest = { ...props };
  delete rest.node;
  return rest;
}

/**
 * Direction is logical throughout. The blockquote previously used border-r and
 * pr, which look right in Arabic only because border-r lands on the start edge
 * in RTL. The moment this renders LTR, which the planned English and French
 * translation requires, the rule and the padding jump to the wrong side.
 *
 * Focus is left to the single global :focus-visible rule. The previous
 * focus:outline-none plus a box-shadow ring removed the outline that
 * forced-colors mode preserves and replaced it with a shadow that forced-colors
 * mode suppresses, leaving a high-contrast user with no focus indicator at all.
 */
export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-brand max-w-none">
      <ReactMarkdown
        components={{
          // Demoted. The page template owns the h1; a second one duplicated it
          // verbatim on all 16 markdown routes and, on /start, emitted h1, h2, h1.
          h1: (p) => <h2 className="mt-8 mb-4 text-3xl font-bold text-brand-purple" {...withoutNode(p)} />,
          h2: (p) => (
            <h3
              className="mt-8 mb-4 border-b border-brand-hairline pb-2 text-2xl font-bold"
              {...withoutNode(p)}
            />
          ),
          h3: (p) => <h4 className="mt-6 mb-3 text-xl font-bold" {...withoutNode(p)} />,
          p: (p) => <p className="mb-4 leading-[1.75]" {...withoutNode(p)} />,
          a: (p) => (
            <a
              className="rounded text-brand-orange underline decoration-brand-orange decoration-1 underline-offset-4 hover:decoration-2"
              {...withoutNode(p)}
            />
          ),
          ul: (p) => <ul className="mb-4 list-inside list-disc space-y-2" {...withoutNode(p)} />,
          ol: (p) => <ol className="mb-4 list-inside list-decimal space-y-2" {...withoutNode(p)} />,
          li: (p) => <li {...withoutNode(p)} />,
          code: (p) => (
            <code
              className="rounded bg-brand-surface px-1 py-0.5 font-mono text-sm text-brand-success"
              dir="ltr"
              {...withoutNode(p)}
            />
          ),
          pre: (p) => (
            <pre
              className="mb-4 overflow-x-auto rounded-lg border border-brand-hairline bg-brand-surface p-4"
              dir="ltr"
              {...withoutNode(p)}
            />
          ),
          blockquote: (p) => (
            <blockquote
              className="my-4 rounded-e border-s-4 border-brand-purple bg-brand-purple/5 py-1 ps-4 text-brand-muted"
              {...withoutNode(p)}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
