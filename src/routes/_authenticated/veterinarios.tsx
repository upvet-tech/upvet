import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/upvet/module-page";
export const Route = createFileRoute("/_authenticated/veterinarios")({
  head: () => ({
    meta: [
      { title: "Veterinários | UPVET" },
      {
        name: "description",
        content:
          "Veterinários da sua clínica veterinária no UPVET. Gestão veterinária completa, moderna e inteligente.",
      },
      { property: "og:title", content: "Veterinários | UPVET" },
      {
        property: "og:description",
        content:
          "Veterinários da sua clínica veterinária no UPVET. Gestão veterinária completa, moderna e inteligente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <ModulePage path="/veterinarios" />;
}
