import { createFileRoute } from "@tanstack/react-router";

// Las fotos viven en un bucket privado de Storage con lectura permitida al rol
// anónimo. El navegador no puede mandar el header `apikey` en un <img>, así que
// este endpoint hace de proxy usando la clave pública (no la de servicio).
export const Route = createFileRoute("/api/public/imagen/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
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

        const target = `${base.replace(/\/$/, "")}/storage/v1/object/property-images/${path
          .split("/")
          .map(encodeURIComponent)
          .join("/")}`;

        const upstream = await fetch(target, { headers: { apikey: key } });
        if (!upstream.ok || !upstream.body) {
          return new Response("Imagen no encontrada", { status: upstream.status || 404 });
        }

        return new Response(upstream.body, {
          status: 200,
          headers: {
            "content-type": upstream.headers.get("content-type") ?? "image/jpeg",
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
