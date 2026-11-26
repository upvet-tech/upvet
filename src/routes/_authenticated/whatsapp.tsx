import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/upvet/module-page";
export const Route = createFileRoute("/_authenticated/whatsapp")({
  head: () => ({
    meta: [
      { title: "WhatsApp | UPVET" },
      {
        name: "description",
        content:
          "WhatsApp da sua clínica veterinária no UPVET. Gestão veterinária completa, moderna e inteligente.",
      },
      { property: "og:title", content: "WhatsApp | UPVET" },
      {
        property: "og:description",
        content:
          "WhatsApp da sua clínica veterinária no UPVET. Gestão veterinária completa, moderna e inteligente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <ModulePage path="/whatsapp" />;
}
