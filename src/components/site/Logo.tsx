import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/logo.png.asset.json";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3">
      <img
        src={logoAsset.url}
        alt="Curto & De Oliveira Negocios Inmobiliarios"
        className={`w-auto max-w-[280px] object-contain ${
          tone === "light" ? "h-16" : "h-14 rounded-lg sm:h-16"
        }`}
        width={640}
        height={230}
      />
    </Link>
  );
}
