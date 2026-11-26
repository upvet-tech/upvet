import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/upvet/module-page";
export const Route = createFileRoute("/_authenticated/laboratorios")({
  head: () => ({
    meta: [
      { title: "Laboratórios — UPVET CONNECT | UPVET" },
      {
        name: "description",
        content:
          "Laboratórios — UPVET CONNECT da sua clínica veterinária no UPVET. Gestão veterinária completa, moderna e inteligente.",
      },
      { property: "og:title", content: "Laboratórios — UPVET CONNECT | UPVET" },
      {
        property: "og:description",
        content:
          "Laboratórios — UPVET CONNECT da sua clínica veterinária no UPVET. Gestão veterinária completa, moderna e inteligente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <ModulePage path="/laboratorios" />;
}
