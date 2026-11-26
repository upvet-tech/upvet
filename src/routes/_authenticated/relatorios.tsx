import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/upvet/module-page";
export const Route = createFileRoute("/_authenticated/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios e indicadores | UPVET" },
      {
        name: "description",
        content:
          "Relatórios e indicadores da sua clínica veterinária no UPVET. Gestão veterinária completa, moderna e inteligente.",
      },
      { property: "og:title", content: "Relatórios e indicadores | UPVET" },
      {
        property: "og:description",
        content:
          "Relatórios e indicadores da sua clínica veterinária no UPVET. Gestão veterinária completa, moderna e inteligente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <ModulePage path="/relatorios" />;
}
