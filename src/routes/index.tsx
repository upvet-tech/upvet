import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/upvet/dashboard";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | UPVET" },
      {
        name: "description",
        content:
          "Acompanhe a agenda, os pacientes e a operação da sua clínica veterinária com o UPVET.",
      },
      { property: "og:title", content: "Dashboard | UPVET" },
      { property: "og:description", content: "Sua rotina veterinária organizada em um só lugar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});
