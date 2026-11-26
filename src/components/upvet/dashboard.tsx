import brandAsset from "@/assets/upvet-brand.png.asset.json";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  CalendarDays,
  Plus,
  ChevronRight,
  ArrowUpRight,
  ArrowRight,
  Clock3,
  ListFilter,
  Sparkles,
  Zap,
  ClipboardList,
  MessageCircle,
  TriangleAlert,
  FlaskConical,
  Package,
  Users,
  PawPrint,
  Stethoscope,
  HeartPulse,
  Ellipsis,
  CircleCheck,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemo } from "./app-shell";
import { operationalMetrics, type Appointment } from "@/lib/upvet/data";
export function Status({ status }: { status: Appointment["status"] }) {
  const tone =
    status === "Confirmado" || status === "Concluído"
      ? "green"
      : status === "Aguardando"
        ? "amber"
        : "blue";
  return <span className={`status tone-${tone}`}>{status}</span>;
}
export function AppointmentTable({ appointments }: { appointments: Appointment[] }) {
  const { showNotice } = useDemo();
  return (
    <div className="table-scroll">
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Horário</th>
            <th>Paciente / Tutor</th>
            <th>Atendimento</th>
            <th>Status</th>
            <th aria-label="Ações" />
          </tr>
        </thead>
        <tbody>
          {appointments.map((a, i) => (
            <tr key={a.id}>
              <td>{a.time}</td>
              <td>
                <div className="patient-cell">
                  <div className={`initial-avatar tone-${i % 2 ? "cyan" : "blue"}`}>
                    {a.patient.slice(0, 1)}
                  </div>
                  <div>
                    <div className="cell-primary">
                      {a.patient}
                      <span className="text-muted-foreground font-normal text-[9px] ml-1.5">
                        {a.breed.split(" · ")[0]}
                      </span>
                    </div>
                    <div className="cell-secondary">{a.tutor}</div>
                  </div>
                </div>
              </td>
              <td>
                <div className="cell-primary text-[10px]">{a.service}</div>
                <div className="cell-secondary">{a.vet}</div>
              </td>
              <td>
                <Status status={a.status} />
              </td>
              <td>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  aria-label={`Ver atendimento de ${a.patient}`}
                  title="Ver atendimento"
                  onClick={() =>
                    showNotice(
                      `Atendimento de ${a.patient}`,
                      `${a.breed} · Tutor: ${a.tutor}. ${a.service} às ${a.time} com ${a.vet}. Status: ${a.status}.`,
                    )
                  }
                >
                  <Ellipsis />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {appointments.length === 0 && (
        <div className="empty-state">Nenhum atendimento encontrado.</div>
      )}
    </div>
  );
}
export function Dashboard() {
  const { appointments, search, openAppointment, showNotice } = useDemo();
  const [tab, setTab] = useState("Todos");
  const [onlyPending, setOnlyPending] = useState(false);
  const filtered = appointments
    .filter((a) =>
      `${a.patient} ${a.tutor} ${a.vet} ${a.service}`.toLowerCase().includes(search.toLowerCase()),
    )
    .filter(
      (a) =>
        tab === "Todos" ||
        (tab === "Próximos" ? a.status !== "Concluído" : a.status === "Concluído"),
    )
    .filter((a) => !onlyPending || a.status === "Aguardando");
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            Bom dia, Juliana <span className="text-[22px]">☀️</span>
          </h1>
          <p>Confira o que acontece na sua clínica hoje.</p>
        </div>
        <div className="heading-actions">
          <div className="flex gap-2 items-center text-[10px] text-muted-foreground">
            <CalendarDays size={15} />
            <span>
              Quinta-feira,{" "}
              <strong className="text-foreground font-semibold">26 de novembro de 2026</strong>
            </span>
          </div>
          <Button onClick={openAppointment} className="text-[10px] h-9">
            <Plus />
            Novo agendamento
          </Button>
        </div>
      </div>
      <section className="brand-band" aria-label="UPVET Gestão veterinária">
        <img src={brandAsset.url} alt="Globo azul UPVET com órbita dourada" />
        <div className="brand-band-content">
          <div className="brand-band-wordmark">
            UP<span>VET</span>
            <small>TECH SYSTEMS</small>
          </div>
          <div className="brand-band-slogan">
            Gestão veterinária <span>completa,</span>
            <br />
            moderna e <span>inteligente.</span>
          </div>
        </div>
      </section>
      <div className="operational-heading">
        <h2>
          <HeartPulse size={16} />
          Indicadores operacionais
        </h2>
        <span>Última atualização: agora</span>
      </div>
      <section className="stats-grid" aria-label="Indicadores operacionais">
        {operationalMetrics.map((m) => (
          <article className="metric" key={m.key}>
            <div className="metric-top">
              <h2>{m.label}</h2>
              <div className={`metric-icon tone-${m.tone}`}>
                <m.icon size={18} />
              </div>
            </div>
            <div className="metric-value">{m.value}</div>
            <div className="metric-detail">
              {m.key === "pending" ? (
                <Clock3 size={11} className="text-warning" />
              ) : (
                <ArrowUpRight size={11} className="text-success" />
              )}
              {m.detail}
            </div>
          </article>
        ))}
      </section>
      <div className="dashboard-grid">
        <div className="dashboard-column">
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2 className="panel-title">
                  <CalendarDays size={16} className="text-primary" />
                  Agenda do dia <span className="count-pill">24 consultas</span>
                </h2>
                <p className="panel-subtitle">Seus atendimentos, organizados em um só lugar.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className={`text-[10px] ${onlyPending ? "bg-accent" : ""}`}
                onClick={() => setOnlyPending(!onlyPending)}
                aria-pressed={onlyPending}
              >
                <ListFilter size={13} />
                {onlyPending ? "Pendentes" : "Filtrar"}
              </Button>
            </div>
            <div className="schedule-tabs">
              {["Todos", "Próximos", "Concluídos"].map((t) => (
                <Button
                  variant="ghost"
                  key={t}
                  className={`schedule-tab ${tab === t ? "selected" : ""}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                  {t === "Todos" && <span className="count-pill">{appointments.length}</span>}
                </Button>
              ))}
            </div>
            <AppointmentTable appointments={filtered} />
            <div className="panel-footer">
              <span>Exibindo {filtered.length} atendimentos</span>
              <Button variant="link" size="sm" asChild className="text-[10px] p-0 h-7">
                <Link to="/agenda">
                  Ver agenda completa
                  <ArrowRight size={12} />
                </Link>
              </Button>
            </div>
          </section>
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2 className="panel-title">
                  <Zap size={16} className="text-primary" />
                  Acesso rápido
                </h2>
                <p className="panel-subtitle">Mais agilidade para a sua rotina.</p>
              </div>
            </div>
            <div className="quick-actions">
              <Button variant="outline" className="quick-action" onClick={openAppointment}>
                <CalendarDays />
                Agendar consulta
              </Button>
              <Button variant="outline" className="quick-action" asChild>
                <Link to="/pacientes">
                  <PawPrint />
                  Novo paciente
                </Link>
              </Button>
              <Button variant="outline" className="quick-action" asChild>
                <Link to="/atendimento">
                  <Stethoscope />
                  Iniciar atendimento
                </Link>
              </Button>
              <Button variant="outline" className="quick-action" asChild>
                <Link to="/whatsapp">
                  <MessageCircle />
                  WhatsApp
                </Link>
              </Button>
            </div>
          </section>
          <section className="panel">
            <div className="panel-heading">
              <h2 className="panel-title">
                <Clock3 size={16} className="text-primary" />
                Próximos atendimentos
              </h2>
              <Button variant="link" size="sm" className="p-0 text-[10px]" asChild>
                <Link to="/agenda">
                  Ver todos
                  <ChevronRight size={12} />
                </Link>
              </Button>
            </div>
            <div className="px-5 pb-5 flex gap-4 flex-wrap">
              {appointments
                .filter((a) => a.status === "Confirmado" || a.status === "Aguardando")
                .slice(0, 3)
                .map((a) => (
                  <div key={a.id} className="flex-1 min-w-36 border-l-2 border-primary pl-3">
                    <div className="text-[10px] text-primary font-bold mb-1.5">
                      {a.time}
                      <span className="text-muted-foreground font-normal ml-2">{a.service}</span>
                    </div>
                    <strong className="text-[11px]">{a.patient}</strong>
                    <p className="text-[9px] text-muted-foreground mt-1">{a.vet}</p>
                  </div>
                ))}
            </div>
          </section>
        </div>
        <div className="dashboard-column side-column">
          <section className="panel">
            <div className="panel-heading">
              <h2 className="panel-title">
                <Users size={16} className="text-primary" />
                Fila de espera <span className="count-pill">3</span>
              </h2>
              <span className="demo-indicator text-[8px] text-muted-foreground">Ao vivo</span>
            </div>
            {[
              {
                name: "Luna",
                tutor: "Carlos Eduardo",
                time: "Há 8 min",
                status: "Em atendimento" as const,
              },
              {
                name: "Mel",
                tutor: "Juliana Santos",
                time: "Há 5 min",
                status: "Confirmado" as const,
              },
              {
                name: "Simba",
                tutor: "Pedro Almeida",
                time: "Há 2 min",
                status: "Aguardando" as const,
              },
            ].map((a, i) => (
              <div className="queue-item" key={a.name}>
                <div
                  className={`initial-avatar tone-${i === 0 ? "blue" : i === 1 ? "cyan" : "amber"}`}
                >
                  {a.name[0]}
                </div>
                <div className="queue-info">
                  <div className="queue-top">
                    <strong className="text-[11px]">{a.name}</strong>
                    <span className="queue-time">
                      <Clock3 size={10} />
                      {a.time}
                    </span>
                  </div>
                  <div className="cell-secondary">{a.tutor}</div>
                </div>
              </div>
            ))}
            <div className="panel-footer justify-center">
              <Button variant="link" size="sm" className="text-[10px] h-6" asChild>
                <Link to="/atendimento">
                  Gerenciar fila
                  <ArrowRight size={12} />
                </Link>
              </Button>
            </div>
          </section>
          <section className="panel">
            <div className="panel-heading">
              <h2 className="panel-title">
                <BellIcon />
                Alertas e notificações
              </h2>
              <span className="count-pill tone-amber">3</span>
            </div>
            <div className="px-4 pb-4 flex flex-col gap-2">
              <Link to="/agenda" className="alert-item tone-amber">
                <Clock3 size={15} className="shrink-0 mt-0.5" />
                <div>
                  <strong>5 consultas aguardam confirmação</strong>
                  <p>Confirme os agendamentos de hoje.</p>
                </div>
              </Link>
              <Link to="/estoque" className="alert-item tone-blue">
                <Package size={15} className="shrink-0 mt-0.5" />
                <div>
                  <strong>Estoque baixo: Vacina V10</strong>
                  <p>Restam apenas 3 unidades em estoque.</p>
                </div>
              </Link>
              <Link to="/laboratorios" className="alert-item tone-green">
                <FlaskConical size={15} className="shrink-0 mt-0.5" />
                <div>
                  <strong>2 resultados disponíveis</strong>
                  <p>Novos exames no UPVET CONNECT.</p>
                </div>
              </Link>
            </div>
          </section>
          <section className="ai-panel">
            <div className="flex justify-between items-center">
              <h2>
                <Sparkles size={21} />
                UPVET <span className="text-cyan">AI</span>
              </h2>
              <span className="ai-chip">EM BREVE</span>
            </div>
            <p>
              Um novo olhar para o cuidado.
              <br />
              Inteligência que acompanha a sua rotina.
            </p>
            <div className="ai-features">
              <span>
                <ClipboardList />
                Apoio inteligente aos prontuários
              </span>
              <span>
                <HeartPulse />
                Insights para o cuidado dos pacientes
              </span>
              <span>
                <ShieldCheck />
                Mais eficiência para a sua equipe
              </span>
            </div>
            <Button
              variant="ai"
              className="w-full text-[10px] h-9"
              onClick={() =>
                showNotice(
                  "UPVET AI · Em breve",
                  "O painel UPVET AI é uma prévia visual. Apoio a prontuários, insights clínicos e recursos inteligentes estão previstos para etapas futuras. Nenhuma inteligência artificial está conectada nesta versão.",
                )
              }
            >
              <Sparkles size={13} />
              Conhecer o UPVET AI
              <ArrowRight size={13} className="ml-auto" />
            </Button>
          </section>
        </div>
      </div>
    </>
  );
}
function BellIcon() {
  return <TriangleAlert size={16} className="text-warning" />;
}
