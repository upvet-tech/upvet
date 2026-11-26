import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/upvet/module-page";
export const Route = createFileRoute("/financeiro")({
  head: () => ({
    meta: [
      { title: "Financeiro | UPVET" },
      {
        name: "description",
        content:
          "Financeiro da sua clínica veterinária no UPVET. Gestão veterinária completa, moderna e inteligente.",
      },
      { property: "og:title", content: "Financeiro | UPVET" },
      {
        property: "og:description",
        content:
          "Financeiro da sua clínica veterinária no UPVET. Gestão veterinária completa, moderna e inteligente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <ModulePage path="/financeiro" />;
}
