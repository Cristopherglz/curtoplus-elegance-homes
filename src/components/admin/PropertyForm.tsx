import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Star, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { imageUrl, OPERATIONS, PROPERTY_TYPES, STATUSES, type Property } from "@/lib/properties";

type FormState = Record<string, unknown>;

const emptyState = {
  title: "",
  description: "",
  operation: "venta",
  property_type: "casa",
  status: "disponible",
  sale_price_usd: "",
  sale_price_ars: "",
  rent_price_usd: "",
  rent_price_ars: "",
  expenses_ars: "",
  expenses_usd: "",
  address: "",
  neighborhood: "",
  city: "Posadas",
  province: "Misiones",
  bedrooms: "",
  bathrooms: "",
  area_m2: "",
  lot_m2: "",
  garage: false,
  garage_spaces: "",
  mortgage_eligible: false,
  featured: false,
  is_published: true,
};

const num = (v: unknown) => (v === "" || v === null ? null : Number(v));

const field =
  "mt-2 w-full border border-border bg-card px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-accent";
const labelCls = "eyebrow text-[0.55rem] text-muted-foreground";

export function PropertyForm({ property }: { property?: Property }) {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(
    property
      ? {
          ...emptyState,
          ...Object.fromEntries(
            Object.keys(emptyState).map((k) => [
              k,
              (property as unknown as Record<string, unknown>)[k] ?? emptyState[k as keyof typeof emptyState],
            ]),
          ),
        }
      : { ...emptyState },
  );
  const [images, setImages] = useState<string[]>(property?.images ?? []);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (key: string, value: unknown) => setForm((prev) => ({ ...prev, [key]: value }));
  const text = (key: string) => ({
    value: String(form[key] ?? ""),
    onChange: (e: { target: { value: string } }) => set(key, e.target.value),
  });

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("property-images").upload(path, file, {
          cacheControl: "31536000",
          upsert: false,
        });
        if (error) throw error;
        uploaded.push(path);
      }
      setImages((prev) => [...prev, ...uploaded]);
      toast.success("Imágenes cargadas");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudieron subir las imágenes");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        title: String(form.title).trim(),
        description: String(form.description ?? "").trim(),
        operation: String(form.operation),
        property_type: String(form.property_type),
        status: String(form.status),
        sale_price_usd: num(form.sale_price_usd),
        sale_price_ars: num(form.sale_price_ars),
        rent_price_usd: num(form.rent_price_usd),
        rent_price_ars: num(form.rent_price_ars),
        expenses_ars: num(form.expenses_ars),
        expenses_usd: num(form.expenses_usd),
        address: String(form.address ?? "").trim() || null,
        neighborhood: String(form.neighborhood ?? "").trim() || null,
        city: String(form.city ?? "Posadas"),
        province: String(form.province ?? "Misiones"),
        bedrooms: num(form.bedrooms),
        bathrooms: num(form.bathrooms),
        area_m2: num(form.area_m2),
        lot_m2: num(form.lot_m2),
        garage: Boolean(form.garage),
        garage_spaces: Boolean(form.garage) ? num(form.garage_spaces) : null,
        mortgage_eligible: Boolean(form.mortgage_eligible),
        featured: Boolean(form.featured),
        is_published: Boolean(form.is_published),
        images,
      };
      if (!payload.title) throw new Error("El título es obligatorio");

      if (property) {
        const { error } = await supabase.from("properties").update(payload).eq("id", property.id);
        if (error) throw error;
        toast.success("Propiedad actualizada");
      } else {
        const { error } = await supabase.from("properties").insert(payload);
        if (error) throw error;
        toast.success("Propiedad publicada");
      }
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div className="space-y-6">
        <div>
          <label className={labelCls} htmlFor="title">Título</label>
          <input id="title" required maxLength={140} {...text("title")} className={field} />
        </div>
        <div>
          <label className={labelCls} htmlFor="description">Descripción</label>
          <textarea id="description" rows={8} maxLength={4000} {...text("description")} className={`${field} resize-none`} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { key: "operation", label: "Operación", options: OPERATIONS },
            { key: "property_type", label: "Tipo", options: PROPERTY_TYPES },
            { key: "status", label: "Estado", options: STATUSES },
          ].map((sel) => (
            <div key={sel.key}>
              <label className={labelCls} htmlFor={sel.key}>{sel.label}</label>
              <select id={sel.key} {...text(sel.key)} className={`${field} appearance-none`}>
                {sel.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { key: "sale_price_usd", label: "Precio venta (USD)" },
            { key: "sale_price_ars", label: "Precio venta (ARS)" },
            { key: "rent_price_usd", label: "Precio alquiler (USD)" },
            { key: "rent_price_ars", label: "Precio alquiler (ARS)" },
            { key: "expenses_ars", label: "Expensas (ARS)" },
            { key: "expenses_usd", label: "Expensas (USD)" },
          ].map((f) => (
            <div key={f.key}>
              <label className={labelCls} htmlFor={f.key}>{f.label}</label>
              <input id={f.key} type="number" min={0} {...text(f.key)} className={field} />
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { key: "address", label: "Dirección" },
            { key: "neighborhood", label: "Barrio / Zona" },
            { key: "city", label: "Ciudad" },
            { key: "province", label: "Provincia" },
          ].map((f) => (
            <div key={f.key}>
              <label className={labelCls} htmlFor={f.key}>{f.label}</label>
              <input id={f.key} maxLength={120} {...text(f.key)} className={field} />
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { key: "bedrooms", label: "Dormitorios" },
            { key: "bathrooms", label: "Baños" },
            { key: "area_m2", label: "m² cubiertos" },
            { key: "lot_m2", label: "m² terreno" },
          ].map((f) => (
            <div key={f.key}>
              <label className={labelCls} htmlFor={f.key}>{f.label}</label>
              <input id={f.key} type="number" min={0} {...text(f.key)} className={field} />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-6 pt-2">
          {[
            { key: "garage", label: "Cochera" },
            { key: "mortgage_eligible", label: "Apto crédito hipotecario" },
            { key: "featured", label: "Destacada" },
            { key: "is_published", label: "Publicada en el sitio" },
          ].map((c) => (
            <label key={c.key} className="flex items-center gap-2 text-sm text-navy">
              <input
                type="checkbox"
                checked={Boolean(form[c.key])}
                onChange={(e) => set(c.key, e.target.checked)}
                className="h-4 w-4 accent-[var(--navy)]"
              />
              {c.label}
            </label>
          ))}
        </div>

        {Boolean(form.garage) && (
          <div className="sm:max-w-xs">
            <label className={labelCls} htmlFor="garage_spaces">Cochera para (autos)</label>
            <input
              id="garage_spaces"
              type="number"
              min={1}
              max={50}
              {...text("garage_spaces")}
              className={field}
            />
          </div>
        )}
      </div>

      <aside className="space-y-6 lg:sticky lg:top-28 lg:h-fit">
        <div className="border border-border bg-card p-6">
          <h2 className="font-display text-2xl text-navy">Imágenes</h2>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => upload(e.target.files)}
            className="mt-4 w-full text-xs text-muted-foreground file:mr-3 file:border file:border-border file:bg-ivory file:px-4 file:py-2 file:text-xs file:text-navy"
          />
          {uploading && <p className="mt-3 text-xs text-muted-foreground">Subiendo…</p>}
          {images.length > 0 && (
            <>
              <p className="mt-4 text-xs text-muted-foreground">
                La imagen marcada como principal es la que aparece en la tarjeta de la propiedad.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {images.map((img, index) => (
                  <div key={img} className="relative aspect-square overflow-hidden rounded-xl">
                    <img src={imageUrl(img)} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      aria-label="Quitar imagen"
                      onClick={() => setImages((prev) => prev.filter((i) => i !== img))}
                      className="absolute right-1 top-1 rounded-full bg-navy/85 p-1 text-navy-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {index === 0 ? (
                      <span className="absolute inset-x-1 bottom-1 flex items-center justify-center gap-1 rounded-full bg-navy px-2 py-1 text-[0.6rem] text-navy-foreground">
                        <Star className="h-3 w-3 fill-current" /> Principal
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setImages((prev) => [img, ...prev.filter((i) => i !== img)])
                        }
                        className="absolute inset-x-1 bottom-1 flex items-center justify-center gap-1 rounded-full bg-card/90 px-2 py-1 text-[0.6rem] text-navy transition-colors hover:bg-card"
                      >
                        <Star className="h-3 w-3" /> Principal
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-navy px-6 py-4 text-sm tracking-wide text-navy-foreground transition-colors hover:bg-navy-deep disabled:opacity-60"
        >
          {busy ? "Guardando…" : property ? "Guardar cambios" : "Publicar propiedad"}
        </button>
      </aside>
    </form>
  );
}
