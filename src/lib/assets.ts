// Los archivos subidos al CDN se sirven desde el dominio de Lovable.
// Al desplegar en otro host (Vercel, etc.) la ruta relativa /__l5e/... no existe,
// por eso siempre la resolvemos contra el origen del CDN.
const CDN_ORIGIN = "https://curtoplus-elegance-homes.lovable.app";

export function assetUrl(url: string) {
  if (!url) return "";
  return url.startsWith("/__l5e/") ? `${CDN_ORIGIN}${url}` : url;
}
