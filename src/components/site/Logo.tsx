import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/logo.png.asset.json";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link
      to="/"
      className={`flex min-w-0 items-center gap-3 ${
        tone === "light" ? "rounded-2xl bg-white/95 p-2" : ""
      }`}
    >
      <img
        src={logoAsset.url}
        alt="Curto & De Oliveira Negocios Inmobiliarios"
        className="h-11 w-auto max-w-[230px] rounded-lg object-contain sm:h-12"
        width={640}
        height={230}
      />
    </Link>
  );
}
