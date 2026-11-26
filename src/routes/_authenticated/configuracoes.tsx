import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/upvet/module-page";
export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações | UPVET" },
      {
        name: "description",
        content:
          "Configurações da sua clínica veterinária no UPVET. Gestão veterinária completa, moderna e inteligente.",
      },
      { property: "og:title", content: "Configurações | UPVET" },
      {
        property: "og:description",
        content:
          "Configurações da sua clínica veterinária no UPVET. Gestão veterinária completa, moderna e inteligente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <ModulePage path="/configuracoes" />;
}
