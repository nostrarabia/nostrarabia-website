import { CopyField } from "@/components/ui/CopyField";

/**
 * Kept as a named component because /start uses it, but its own clipboard
 * handling is gone. The previous implementation sent the rejection to
 * console.error, so on any non-secure context or in-app webview the reader
 * pressed the button, nothing happened, and the site looked broken. CopyField
 * owns every branch of that now, which means /start inherited the fix rather
 * than keeping its own copy of the bug.
 */
export function RelayCopy({ url = "wss://relay.nostrarabia.com" }: { url?: string }) {
  return <CopyField value={url} label="انسخ عنوان الريلاي" seam={false} />;
}
