import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso administrador | Curto & De Oliveira" },
      {
        name: "description",
        content: "Panel de administración de propiedades de Curto & De Oliveira Negocios Inmobiliarios.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Acceso administrador | Curto & De Oliveira" },
      { property: "og:description", content: "Ingreso privado al panel de gestión de propiedades." },
    ],
  }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/admin", replace: true });
  }, [session, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Bienvenido");
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo iniciar sesión");
    } finally {
      setBusy(false);
    }
  };

  const fieldClass =
    "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-accent";

  return (
    <section className="mx-auto flex min-h-[78vh] max-w-md flex-col justify-center px-5 py-20">
      <div className="rounded-3xl border border-border bg-card p-9 shadow-[var(--shadow-soft)]">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary">
          <ShieldCheck className="h-6 w-6 text-accent" />
        </span>
        <h1 className="mt-5 font-display text-3xl text-navy">Acceso administrador</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Área privada para la gestión de propiedades del sitio.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="eyebrow text-[0.55rem] text-muted-foreground">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="password" className="eyebrow text-[0.55rem] text-muted-foreground">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldClass}
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-navy px-6 py-4 text-sm font-medium tracking-wide text-navy-foreground transition-colors hover:bg-navy-deep disabled:opacity-60"
          >
            {busy ? "Procesando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </section>
  );
}

