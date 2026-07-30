import { Link } from "@tanstack/react-router";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const primary = tone === "light" ? "text-navy-foreground" : "text-navy";
  const secondary = tone === "light" ? "text-navy-foreground/60" : "text-muted-foreground";
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3">
      <span
        className="grid h-11 w-11 shrink-0 place-items-center border border-gold/60 font-display text-lg leading-none text-gold"
        aria-hidden="true"
      >
        C<span className="text-[0.7em]">&</span>D
      </span>
      <span className="min-w-0 leading-tight">
        <span className={`block truncate font-display text-lg tracking-wide ${primary}`}>
          Curto &amp; De Oliveira
        </span>
        <span className={`block eyebrow text-[0.6rem] ${secondary}`}>Negocios Inmobiliarios</span>
      </span>
    </Link>
  );
}
