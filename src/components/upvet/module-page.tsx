import { useState } from "react";
import {
  CalendarDays,
  Plus,
  Search,
  ArrowRight,
  Building2,
  ShieldCheck,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { modules, type ModulePath } from "@/lib/upvet/data";
import { useDemo } from "./app-shell";
import { AppointmentTable } from "./dashboard";
const demoRows: Record<string, { columns: string[]; rows: string[][]; subtitle: string }> = {
  "/pacientes": {
    subtitle: "Cuidado e histórico de cada paciente.",
    columns: ["Paciente", "Espécie / Raça", "Tutor", "Último atendimento", "Situação"],
    rows: [
      ["Thor", "Canino · Golden Retriever", "Mariana Oliveira", "26/11/2026", "Ativo"],
      ["Luna", "Felino · Persa", "Carlos Eduardo", "26/11/2026", "Ativo"],
      ["Mel", "Canino · Shih-tzu", "Juliana Santos", "18/11/2026", "Ativo"],
      ["Simba", "Felino · SRD", "Pedro Almeida", "20/11/2026", "Ativo"],
      ["Bento", "Canino · Bulldog Francês", "Fernanda Lima", "12/11/2026", "Ativo"],
    ],
  },
  "/tutores": {
    subtitle: "Quem confia o cuidado dos seus pets à sua equipe.",
    columns: ["Tutor", "Pacientes", "Contato", "Cadastro", "Situação"],
    rows: [
      ["Mariana Oliveira", "Thor", "Contato cadastrado", "10/02/2026", "Ativo"],
      ["Carlos Eduardo", "Luna", "Contato cadastrado", "23/03/2026", "Ativo"],
      ["Juliana Santos", "Mel", "Contato cadastrado", "15/06/2026", "Ativo"],
      ["Pedro Almeida", "Simba", "Contato cadastrado", "08/10/2026", "Ativo"],
    ],
  },
  "/veterinarios": {
    subtitle: "Os profissionais que fazem a diferença.",
    columns: ["Profissional", "Especialidade", "Unidade", "Agenda de hoje", "Situação"],
    rows: [
      ["Dra. Ana Paula", "Clínica geral", "Unidade Centro", "10 consultas", "Disponível"],
      ["Dr. Rafael Costa", "Clínica geral", "Unidade Centro", "8 consultas", "Em atendimento"],
      ["Dra. Camila Rocha", "Dermatologia", "Unidade Centro", "6 consultas", "Disponível"],
    ],
  },
  "/prontuarios": {
    subtitle: "Históricos clínicos organizados, cuidado contínuo.",
    columns: ["Paciente", "Registro", "Veterinário", "Data", "Situação"],
    rows: [
      ["Thor", "Consulta de rotina", "Dra. Ana Paula", "26/11/2026", "Concluído"],
      ["Luna", "Retorno clínico", "Dr. Rafael Costa", "26/11/2026", "Em andamento"],
      ["Mel", "Protocolo de vacinação", "Dra. Ana Paula", "18/11/2026", "Concluído"],
    ],
  },
  "/internacao": {
    subtitle: "Acompanhamento próximo em cada etapa da recuperação.",
    columns: ["Paciente", "Leito", "Responsável", "Admissão", "Situação"],
    rows: [
      ["Amora", "Leito 01", "Dra. Ana Paula", "25/11/2026", "Em observação"],
      ["Max", "Leito 03", "Dr. Rafael Costa", "24/11/2026", "Em recuperação"],
      ["Nina", "Leito 04", "Dra. Camila Rocha", "26/11/2026", "Em observação"],
    ],
  },
  "/estoque": {
    subtitle: "Medicamentos, vacinas e insumos sempre sob controle.",
    columns: ["Item", "Categoria", "Quantidade", "Validade", "Situação"],
    rows: [
      ["Vacina V10", "Vacinas", "3 unidades", "03/2027", "Estoque baixo"],
      ["Vacina antirrábica", "Vacinas", "28 unidades", "06/2027", "Disponível"],
      ["Seringa 3 ml", "Insumos", "150 unidades", "09/2028", "Disponível"],
      ["Soro fisiológico 500 ml", "Medicamentos", "24 unidades", "08/2027", "Disponível"],
    ],
  },
  "/financeiro": {
    subtitle: "Área financeira separada da operação da recepção.",
    columns: ["Área", "Unidade", "Acesso", "Situação"],
    rows: [
      ["Contas a receber", "Unidade Centro", "Perfil financeiro", "Previsto"],
      ["Contas a pagar", "Unidade Centro", "Perfil financeiro", "Previsto"],
      ["Fluxo de caixa", "Todas as unidades", "Perfil gestor", "Previsto"],
    ],
  },
  "/whatsapp": {
    subtitle: "Conversas que aproximam tutores e equipe.",
    columns: ["Tutor", "Paciente", "Última mensagem", "Horário", "Situação"],
    rows: [
      ["Mariana Oliveira", "Thor", "Obrigada pelo atendimento!", "09:18", "Recebida"],
      ["Juliana Santos", "Mel", "Confirmo a consulta de hoje.", "09:12", "Não lida"],
      ["Pedro Almeida", "Simba", "Já estamos a caminho.", "09:05", "Não lida"],
    ],
  },
  "/laboratorios": {
    subtitle: "UPVET CONNECT · Exames e resultados, em um só lugar.",
    columns: ["Paciente", "Exame", "Laboratório", "Solicitação", "Situação"],
    rows: [
      ["Thor", "Hemograma completo", "Laboratório VetLab", "25/11/2026", "Resultado disponível"],
      ["Luna", "Perfil renal", "Laboratório VetLab", "24/11/2026", "Resultado disponível"],
      ["Bento", "Citologia dermatológica", "Laboratório PetAnálise", "26/11/2026", "Em análise"],
    ],
  },
  "/marketplace": {
    subtitle: "Produtos e fornecedores para o dia a dia da clínica.",
    columns: ["Produto", "Categoria", "Fornecedor", "Disponibilidade"],
    rows: [
      ["Vacina V10", "Vacinas", "Distribuidora Vet", "Catálogo demonstrativo"],
      ["Kit de coleta laboratorial", "Insumos", "VetLab", "Catálogo demonstrativo"],
      ["Ração terapêutica renal", "Nutrição", "Pet Nutrição", "Catálogo demonstrativo"],
    ],
  },
  "/relatorios": {
    subtitle: "Uma visão clara da operação e dos cuidados.",
    columns: ["Indicador", "Período", "Resultado", "Atualização"],
    rows: [
      ["Consultas agendadas", "Hoje", "24", "26/11/2026"],
      ["Atendimentos realizados", "Hoje", "12", "26/11/2026"],
      ["Pacientes cadastrados", "Total", "1.248", "26/11/2026"],
      ["Novos pacientes", "Novembro", "18", "26/11/2026"],
    ],
  },
};
export function ModulePage({ path }: { path: ModulePath }) {
  const module = modules.find((m) => m.path === path);
  const { appointments, search, openAppointment, showNotice } = useDemo();
  const [localSearch, setLocalSearch] = useState("");
  const [status, setStatus] = useState("Todos");
  if (!module) return null;
  const data = demoRows[path];
  const query = (localSearch || search).toLowerCase();
  const rows = data?.rows.filter((r) => r.join(" ").toLowerCase().includes(query)) ?? [];
  const schedule = path === "/agenda" || path === "/atendimento";
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            {module.title}
            {path === "/laboratorios" && (
              <span className="text-primary text-sm ml-3">UPVET CONNECT</span>
            )}
          </h1>
          <p>
            {schedule
              ? "Cada atendimento, no tempo certo."
              : (data?.subtitle ?? "Sua clínica, suas unidades e sua equipe.")}
          </p>
        </div>
        <div className="heading-actions">
          {schedule && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-2">
              <CalendarDays size={15} />
              26 de novembro de 2026
            </span>
          )}
          {schedule && (
            <Button onClick={openAppointment} className="text-[11px]">
              <Plus />
              Novo agendamento
            </Button>
          )}
        </div>
      </div>
      {path === "/configuracoes" ? (
        <SettingsView />
      ) : (
        <section className="panel">
          <div className="module-toolbar">
            <h2 className="panel-title">
              <module.icon size={17} className="text-primary" />
              {schedule
                ? path === "/agenda"
                  ? "Agenda do dia"
                  : "Atendimentos de hoje"
                : module.title}
              <span className="count-pill">{schedule ? appointments.length : rows.length}</span>
            </h2>
            <label className="flex items-center gap-2 border border-input rounded-md px-3 h-9 max-w-60 min-w-0">
              <Search size={14} className="text-muted-foreground shrink-0" />
              <input
                className="bg-transparent outline-none text-[11px] w-full min-w-0"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Pesquisar..."
                aria-label={`Pesquisar ${module.title.toLowerCase()}`}
              />
            </label>
          </div>
          {schedule ? (
            <>
              <div className="schedule-tabs">
                {["Todos", "Confirmado", "Aguardando", "Em atendimento", "Concluído"].map((t) => (
                  <Button
                    variant="ghost"
                    key={t}
                    className={`schedule-tab ${status === t ? "selected" : ""}`}
                    onClick={() => setStatus(t)}
                  >
                    {t}
                  </Button>
                ))}
              </div>
              <AppointmentTable
                appointments={appointments.filter(
                  (a) =>
                    `${a.patient} ${a.tutor} ${a.vet}`.toLowerCase().includes(query) &&
                    (status === "Todos" || a.status === status),
                )}
              />
            </>
          ) : (
            <div className="table-scroll">
              <table className="schedule-table">
                <thead>
                  <tr>
                    {data?.columns.map((c) => (
                      <th key={c}>{c}</th>
                    ))}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j}>
                          {j === row.length - 1 ? (
                            <span
                              className={`status ${cell === "Estoque baixo" ? "tone-amber" : cell === "Ativo" || cell === "Resultado disponível" ? "tone-green" : "tone-blue"}`}
                            >
                              {cell}
                            </span>
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                      <td>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Ver ${row[0] ?? "registro"}`}
                          title="Ver detalhes"
                          onClick={() =>
                            showNotice(
                              row[0] ?? "Detalhes",
                              row.map((v, j) => `${data?.columns[j] ?? ""}: ${v}`).join(" · "),
                            )
                          }
                        >
                          <ChevronRight />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length === 0 && <div className="empty-state">Nenhum registro encontrado.</div>}
            </div>
          )}
          <div className="panel-footer">
            <span>Dados demonstrativos · Unidade Centro</span>
            <span>{schedule ? appointments.length : rows.length} registros</span>
          </div>
        </section>
      )}
    </>
  );
}
function SettingsView() {
  const { showNotice } = useDemo();
  return (
    <section className="panel">
      <div className="panel-heading">
        <h2 className="panel-title">
          <Building2 size={17} />
          Organização e acesso
        </h2>
      </div>
      {[
        {
          icon: Building2,
          name: "Clínica Veterinária Vida",
          detail: "Unidade Centro · Unidade Jardins",
        },
        {
          icon: ShieldCheck,
          name: "Perfis profissionais",
          detail: "Recepção · Veterinário · Gestor · Financeiro",
        },
        {
          icon: Globe,
          name: "Idioma e região",
          detail: "Português (Brasil) · Horário de Brasília",
        },
      ].map((r) => (
        <div key={r.name} className="mx-5 py-5 border-t border-border flex gap-4 items-center">
          <div className="metric-icon tone-blue">
            <r.icon size={18} />
          </div>
          <div className="flex-1">
            <strong className="text-xs">{r.name}</strong>
            <p className="text-[10px] text-muted-foreground mt-1.5">{r.detail}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              showNotice(
                r.name,
                `${r.detail}. Configurações e permissões reais serão implementadas em uma etapa futura.`,
              )
            }
          >
            Ver detalhes
          </Button>
        </div>
      ))}
    </section>
  );
}
