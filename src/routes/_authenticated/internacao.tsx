import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/upvet/module-page";
export const Route = createFileRoute("/_authenticated/internacao")({
  head: () => ({
    meta: [
      { title: "Internação | UPVET" },
      {
        name: "description",
        content:
          "Internação da sua clínica veterinária no UPVET. Gestão veterinária completa, moderna e inteligente.",
      },
      { property: "og:title", content: "Internação | UPVET" },
      {
        property: "og:description",
        content:
          "Internação da sua clínica veterinária no UPVET. Gestão veterinária completa, moderna e inteligente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <ModulePage path="/internacao" />;
}
