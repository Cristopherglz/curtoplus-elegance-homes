import { createFileRoute } from "@tanstack/react-router";
import { PropertyForm } from "@/components/admin/PropertyForm";

export const Route = createFileRoute("/admin/nueva")({
  component: () => (
    <>
      <h2 className="mt-10 font-display text-3xl text-navy">Nueva propiedad</h2>
      <PropertyForm />
    </>
  ),
});
