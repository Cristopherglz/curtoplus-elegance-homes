import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { fetchProperty } from "@/lib/properties";

export const Route = createFileRoute("/admin/editar/$id")({
  component: EditarPropiedad,
});

function EditarPropiedad() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({ queryKey: ["property", id], queryFn: () => fetchProperty(id) });

  if (isLoading) return <p className="py-20 text-sm text-muted-foreground">Cargando…</p>;
  if (!data) return <p className="py-20 text-sm text-muted-foreground">Propiedad no encontrada.</p>;

  return (
    <>
      <h2 className="mt-10 font-display text-3xl text-navy">Editar propiedad</h2>
      <PropertyForm property={data} />
    </>
  );
}
