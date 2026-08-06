import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchAllProperties,
  imageUrl,
  labelOf,
  OPERATIONS,
  priceLines,
  STATUSES,
} from "@/lib/properties";

export const Route = createFileRoute("/admin/")({
  component: AdminList,
});

function AdminList() {
  const qc = useQueryClient();
  const [limit, setLimit] = useState(20);
  const { data, isLoading } = useQuery({ queryKey: ["properties", "all"], queryFn: fetchAllProperties });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["properties"] });
  };

  const togglePublish = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
      const { error } = await supabase.from("properties").update({ is_published: value }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Publicación actualizada");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Propiedad eliminada");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return <p className="py-20 text-sm text-muted-foreground">Cargando propiedades…</p>;
  }

  const properties = data ?? [];

  if (!properties.length) {
    return (
      <div className="my-16 border border-dashed border-border p-14 text-center">
        <h2 className="font-display text-3xl text-navy">Todavía no hay propiedades</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Cargá la primera para que aparezca en el sitio.
        </p>
        <Link to="/admin/nueva" className="mt-8 inline-block bg-navy px-6 py-3 text-sm text-navy-foreground">
          Cargar propiedad
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-4">
      {properties.slice(0, limit).map((p) => (
        <article
          key={p.id}
          className="grid gap-5 border border-border bg-card p-4 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:items-center"
        >
          <div className="aspect-[4/3] w-full overflow-hidden bg-secondary sm:w-32">
            {p.images?.[0] ? (
              <img
                src={imageUrl(p.images[0], 300)}
                alt={p.title}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center font-display text-xl text-muted-foreground">
                C&amp;D
              </div>
            )}
          </div>


          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-ivory px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.18em] text-navy">
                {labelOf(OPERATIONS, p.operation)}
              </span>
              <span className="bg-navy px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.18em] text-navy-foreground">
                {labelOf(STATUSES, p.status)}
              </span>
              {!p.is_published && (
                <span className="border border-destructive px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.18em] text-destructive">
                  Borrador
                </span>
              )}
              {p.featured && (
                <span className="border border-gold px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.18em] text-gold">
                  Destacada
                </span>
              )}
            </div>
            <h2 className="mt-2 truncate font-display text-2xl text-navy">{p.title}</h2>
            <p className="truncate text-xs text-muted-foreground">
              {[p.neighborhood, p.city].filter(Boolean).join(" · ")} —{" "}
              {priceLines(p).map((l) => l.value).join(" | ")}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button
              onClick={() => togglePublish.mutate({ id: p.id, value: !p.is_published })}
              aria-label={p.is_published ? "Despublicar" : "Publicar"}
              className="border border-border p-3 text-navy transition-colors hover:bg-ivory"
            >
              {p.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
            <Link
              to="/admin/editar/$id"
              params={{ id: p.id }}
              aria-label="Editar"
              className="border border-border p-3 text-navy transition-colors hover:bg-ivory"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <button
              onClick={() => {
                if (confirm(`¿Eliminar "${p.title}"? Esta acción no se puede deshacer.`)) {
                  remove.mutate(p.id);
                }
              }}
              aria-label="Eliminar"
              className="border border-border p-3 text-destructive transition-colors hover:bg-ivory"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </article>
      ))}

      {properties.length > limit && (
        <div className="pt-4 text-center">
          <button
            type="button"
            onClick={() => setLimit((n) => n + 20)}
            className="rounded-full border border-navy px-8 py-3 text-sm text-navy transition-colors hover:bg-ivory"
          >
            Ver más ({properties.length - limit} restantes)
          </button>
        </div>
      )}
    </div>
  );
}
