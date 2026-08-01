import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchHours, type Hour } from "@/hooks/use-hours";

export const Route = createFileRoute("/admin/horarios")({
  component: Horarios,
});

const field =
  "w-full border border-border bg-card px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-accent";

function Horarios() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["site_settings", "hours"], queryFn: fetchHours });
  const [rows, setRows] = useState<Hour[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data) setRows(data);
  }, [data]);

  const update = (i: number, key: keyof Hour, value: string) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));

  const save = async () => {
    setBusy(true);
    try {
      const clean = rows
        .map((r) => ({ day: r.day.trim(), time: r.time.trim() }))
        .filter((r) => r.day || r.time);
      const { error } = await supabase
        .from("site_settings")
        .upsert({ id: "hours", value: clean, updated_at: new Date().toISOString() });
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["site_settings", "hours"] });
      toast.success("Horarios actualizados");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setBusy(false);
    }
  };

  if (isLoading) return <p className="py-20 text-sm text-muted-foreground">Cargando…</p>;

  return (
    <div className="mt-10 max-w-2xl">
      <h2 className="font-display text-3xl text-navy">Horarios de atención</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Se muestran en la página de contacto del sitio.
      </p>

      <div className="mt-8 space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-3">
            <input
              value={row.day}
              onChange={(e) => update(i, "day", e.target.value)}
              placeholder="Días"
              aria-label="Días"
              className={field}
            />
            <input
              value={row.time}
              onChange={(e) => update(i, "time", e.target.value)}
              placeholder="Horario"
              aria-label="Horario"
              className={field}
            />
            <button
              type="button"
              aria-label="Quitar fila"
              onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))}
              className="border border-border px-4 text-destructive transition-colors hover:bg-ivory"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setRows((prev) => [...prev, { day: "", time: "" }])}
          className="inline-flex items-center gap-2 border border-border px-5 py-3 text-sm text-navy transition-colors hover:bg-ivory"
        >
          <Plus className="h-4 w-4" /> Agregar fila
        </button>
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="bg-navy px-6 py-3 text-sm text-navy-foreground transition-colors hover:bg-navy-deep disabled:opacity-60"
        >
          {busy ? "Guardando…" : "Guardar horarios"}
        </button>
      </div>
    </div>
  );
}
