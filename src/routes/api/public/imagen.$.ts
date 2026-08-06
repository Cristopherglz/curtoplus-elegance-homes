import { createFileRoute } from "@tanstack/react-router";

// Las fotos viven en un bucket privado de Storage con lectura permitida al rol
// anónimo. El navegador no puede mandar el header `apikey` en un <img>, así que
// este endpoint hace de proxy usando la clave pública (no la de servicio).
// Con `?w=` se sirve una versión redimensionada (y en WebP si el navegador lo
// soporta), lo que reduce el peso de las fotos de ~2 MB a decenas de KB.
export const Route = createFileRoute("/api/public/imagen/$")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const path = (params as { _splat?: string })._splat;
        if (!path) return new Response("Not found", { status: 404 });

        const base =
          import.meta.env.VITE_SUPABASE_URL ||
          process.env['SUPABASE_URL'] ||
          "https://qgcglqrfvnhpuezecubu.supabase.co";
        const key =
          import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
          process.env['SUPABASE_PUBLISHABLE_KEY'] ||
          "";

        const encoded = path.split("/").map(encodeURIComponent).join("/");
        const url = new URL(request.url);
        const rawWidth = Number(url.searchParams.get("w"));
        const width = Number.isFinite(rawWidth) && rawWidth > 0 ? Math.min(Math.round(rawWidth), 2000) : null;
        const rawQuality = Number(url.searchParams.get("q"));
        const quality = Number.isFinite(rawQuality) && rawQuality >= 20 && rawQuality <= 100
          ? Math.round(rawQuality)
          : 70;

        const root = base.replace(/\/$/, "");
        const target = width
          ? `${root}/storage/v1/render/image/authenticated/property-images/${encoded}?width=${width}&quality=${quality}&resize=contain`
          : `${root}/storage/v1/object/property-images/${encoded}`;

        const accept = request.headers.get("accept") ?? "image/webp,image/avif,image/*,*/*";
        let upstream = await fetch(target, { headers: { apikey: key, accept } });

        // Si la transformación falla (formato no soportado, etc.) servimos el original.
        if (!upstream.ok && width) {
          upstream = await fetch(`${root}/storage/v1/object/property-images/${encoded}`, {
            headers: { apikey: key },
          });
        }

        if (!upstream.ok || !upstream.body) {
          return new Response("Imagen no encontrada", { status: upstream.status || 404 });
        }

        return new Response(upstream.body, {
          status: 200,
          headers: {
            "content-type": upstream.headers.get("content-type") ?? "image/jpeg",
            "cache-control": "public, max-age=31536000, immutable",
            vary: "Accept",
          },
        });
      },
    },
  },
});
