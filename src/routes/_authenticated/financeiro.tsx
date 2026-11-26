import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/upvet/module-page";
import { useSuspenseQuery } from "@tanstack/react-query";
import { financeAccessQuery } from "@/lib/upvet/access-query";
export const Route = createFileRoute("/_authenticated/financeiro")({
  loader: ({ context }) => context.queryClient.ensureQueryData(financeAccessQuery()),
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
  const { data } = useSuspenseQuery(financeAccessQuery());
  if (!data.canAccess) return (
    <div className="page-heading">
      <div><h1>Financeiro</h1><p role="status">Acesso restrito aos perfis autorizados da sua clínica.</p></div>
    </div>
  );
  return <ModulePage path="/financeiro" />;
}
