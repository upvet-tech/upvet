import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/upvet/module-page";
export const Route = createFileRoute("/pacientes")({
  head: () => ({
    meta: [
      { title: "Pacientes | UPVET" },
      {
        name: "description",
        content:
          "Pacientes da sua clínica veterinária no UPVET. Gestão veterinária completa, moderna e inteligente.",
      },
      { property: "og:title", content: "Pacientes | UPVET" },
      {
        property: "og:description",
        content:
          "Pacientes da sua clínica veterinária no UPVET. Gestão veterinária completa, moderna e inteligente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <ModulePage path="/pacientes" />;
}
