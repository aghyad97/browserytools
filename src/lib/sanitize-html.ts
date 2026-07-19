import DOMPurify from "dompurify";

/** Sanitize untrusted HTML (derived from user-uploaded files) before rendering. */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html);
}
