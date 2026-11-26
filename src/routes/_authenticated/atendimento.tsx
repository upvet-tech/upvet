import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/upvet/module-page";
export const Route = createFileRoute("/_authenticated/atendimento")({
  head: () => ({
    meta: [
      { title: "Atendimento | UPVET" },
      {
        name: "description",
        content:
          "Atendimento da sua clínica veterinária no UPVET. Gestão veterinária completa, moderna e inteligente.",
      },
      { property: "og:title", content: "Atendimento | UPVET" },
      {
        property: "og:description",
        content:
          "Atendimento da sua clínica veterinária no UPVET. Gestão veterinária completa, moderna e inteligente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <ModulePage path="/atendimento" />;
}
