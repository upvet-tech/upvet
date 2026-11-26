import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/upvet/module-page";
export const Route = createFileRoute("/tutores")({
  head: () => ({
    meta: [
      { title: "Tutores | UPVET" },
      {
        name: "description",
        content:
          "Tutores da sua clínica veterinária no UPVET. Gestão veterinária completa, moderna e inteligente.",
      },
      { property: "og:title", content: "Tutores | UPVET" },
      {
        property: "og:description",
        content:
          "Tutores da sua clínica veterinária no UPVET. Gestão veterinária completa, moderna e inteligente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <ModulePage path="/tutores" />;
}
