import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/logo.png.asset.json";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3">
      <img
        src={logoAsset.url}
        alt="Curto & De Oliveira Negocios Inmobiliarios"
        className={`h-11 w-auto max-w-[220px] object-contain sm:h-12 ${
          tone === "light" ? "brightness-0 invert" : ""
        }`}
        width={640}
        height={230}
      />
    </Link>
  );
}
