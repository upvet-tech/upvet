import type { ReactNode } from "react";
import logoAsset from "@/assets/upvet-official-logo.png.asset.json";

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <img className="auth-logo" src={logoAsset.url} alt="UPVET TECH SYSTEMS" />
        <p className="auth-slogan">
          Gestão veterinária <span>completa</span>, moderna e <span>inteligente</span>.
        </p>
        <h1>{title}</h1>
        <p className="auth-sub">{subtitle}</p>
        {children}
      </section>
    </main>
  );
}
