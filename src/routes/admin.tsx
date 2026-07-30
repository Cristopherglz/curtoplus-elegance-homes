import { useEffect, useState } from "react";
import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { LogOut, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Panel de administración | Curto & De Oliveira" },
      { name: "description", content: "Gestión de propiedades publicadas en el sitio." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Panel de administración | Curto & De Oliveira" },
      { property: "og:description", content: "Gestión interna de propiedades." },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { session, loading } = useSession();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate({ to: "/auth", replace: true });
      return;
    }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => {
        setIsAdmin(Boolean(data));
        setChecking(false);
      });
  }, [session, loading, navigate]);

  if (loading || checking) {
    return <div className="mx-auto max-w-7xl px-5 py-32 text-sm text-muted-foreground">Verificando acceso…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-5 py-32 text-center">
        <h1 className="font-display text-4xl text-navy">Acceso restringido</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Tu cuenta no tiene permisos de administración.
        </p>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/auth", replace: true });
          }}
          className="mt-8 border border-navy px-6 py-3 text-sm text-navy"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border pb-6">
        <div className="min-w-0">
          <p className="eyebrow text-accent">Panel</p>
          <h1 className="truncate font-display text-3xl text-navy sm:text-4xl">
            Administración de propiedades
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/admin/nueva"
            className="inline-flex items-center gap-2 bg-navy px-4 py-3 text-xs tracking-wide text-navy-foreground transition-colors hover:bg-navy-deep sm:px-5 sm:text-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nueva propiedad</span>
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/", replace: true });
            }}
            aria-label="Cerrar sesión"
            className="inline-flex items-center gap-2 border border-border px-4 py-3 text-xs text-navy transition-colors hover:bg-ivory"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
