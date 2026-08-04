import { createFileRoute } from "@tanstack/react-router";

// Legacy route: property images are now served directly from Supabase Storage's
// public URL. We keep this endpoint as a permanent redirect so old links keep
// working, and it no longer needs any service-role key.
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

        const target = `${base.replace(/\/$/, "")}/storage/v1/object/public/property-images/${path
          .split("/")
          .map(encodeURIComponent)
          .join("/")}`;

        return new Response(null, {
          status: 301,
          headers: {
            location: target,
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
