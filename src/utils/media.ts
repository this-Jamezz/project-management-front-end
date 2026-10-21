/**
 * Resolves a stored image path to something an <img> can load.
 *
 * Cloudinary returns absolute URLs, which must be used as-is. Any locally
 * served path is still supported and gets the API origin prefixed, so this
 * keeps working if storage moves again.
 */
export function resolveMediaUrl(src?: string | null): string | null {
  if (!src) return null;

  if (/^https?:\/\//i.test(src)) return src;

  const base = import.meta.env.VITE_API_URL ?? "";
  return `${base}${src.startsWith("/") ? "" : "/"}${src}`;
}
