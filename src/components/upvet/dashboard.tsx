import officialLogo from "@/assets/upvet-banner-logo-transparent.png.asset.json";
import lightWave from "@/assets/upvet-banner-wave-soft.png.asset.json";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  CalendarDays,
  ChartNoAxesCombined,
  RefreshCw,
  ChevronDown,
  Syringe,
  ExternalLink,
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
import { operationalMetrics, receptionShortcuts, type Appointment } from "@/lib/upvet/data";
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
  const filtered = appointments.filter((a) =>
    `${a.patient} ${a.tutor} ${a.service}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="reference-dashboard">
      <section className="institutional-band" aria-label="UPVET Gestão veterinária">
        <img
          className="institutional-logo"
          src={officialLogo.url}
          alt="UPVET TECH SYSTEMS — esfera azul com anel orbital dourado"
        />
        <div className="institutional-divider" />
        <div className="institutional-slogan">
          Gestão veterinária <span>completa,</span>
          <br />
          moderna e <span>inteligente.</span>
        </div>
        <img className="institutional-wave" src={lightWave.url} alt="" />
      </section>
      <div className="reference-indicators-heading">
        <h2>
          <ChartNoAxesCombined />
          Indicadores Operacionais
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            showNotice(
              "Indicadores atualizados",
              "Os indicadores demonstrativos estão atualizados para a agenda de 26 de novembro de 2026.",
            )
          }
        >
          Última atualização: agora
          <RefreshCw />
        </Button>
      </div>
      <section className="reference-metrics" aria-label="Indicadores operacionais">
        {operationalMetrics.map((m) => (
          <article key={m.key} className={`reference-metric tone-${m.tone}`}>
            <div className="reference-metric-icon">
              <m.icon />
            </div>
            <div>
              <h3>{m.label}</h3>
              <strong>{m.value}</strong>
            </div>
          </article>
        ))}
      </section>
      <div className="reference-columns">
        <div className="reference-left">
          <section className="reference-panel reference-agenda">
            <div className="reference-panel-heading">
              <h2>
                <CalendarDays />
                Agenda do Dia
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/agenda">
                  Qui, 26 de nov
                  <CalendarDays />
                  <ChevronDown />
                </Link>
              </Button>
            </div>
            <div className="reference-agenda-list">
              {filtered.slice(0, 5).map((a, i) => {
                const Icon =
                  a.service === "Vacinação"
                    ? Syringe
                    : a.service === "Retorno"
                      ? Stethoscope
                      : a.service.includes("dermatológica")
                        ? FlaskConical
                        : PawPrint;
                return (
                  <Button
                    key={a.id}
                    variant="ghost"
                    className={`reference-appointment appointment-${i % 3}`}
                    onClick={() =>
                      showNotice(
                        `Atendimento de ${a.patient}`,
                        `${a.breed} · Tutor: ${a.tutor}. ${a.service} às ${a.time} com ${a.vet}. Status: ${a.status}.`,
                      )
                    }
                  >
                    <time>{a.time}</time>
                    <span className="appointment-stripe" />
                    <Icon />
                    <span className="appointment-content">
                      <strong>
                        {a.service.replace(" de rotina", "")} – {a.patient}
                      </strong>
                      <small>Tutor: {a.tutor}</small>
                    </span>
                    <ChevronRight className="appointment-arrow" />
                  </Button>
                );
              })}
              {filtered.length === 0 && (
                <div className="empty-state">Nenhum atendimento encontrado.</div>
              )}
            </div>
          </section>
          <section className="reference-panel reference-activities">
            <div className="reference-panel-heading">
              <h2>
                <Clock3 />
                Atividades Recentes
              </h2>
            </div>
            <div className="reference-activity-grid">
              {[
                { label: "Consultas realizadas", value: "12", icon: PawPrint, tone: "blue" },
                { label: "Vacinas aplicadas", value: "4", icon: Syringe, tone: "green" },
                { label: "Exames solicitados", value: "6", icon: FlaskConical, tone: "lilac" },
              ].map((a) => (
                <div className={`reference-activity tone-${a.tone}`} key={a.label}>
                  <a.icon />
                  <div>
                    <span>{a.label}</span>
                    <strong>{a.value}</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="reference-right">
          <section className="reference-panel reference-shortcuts">
            <div className="reference-panel-heading">
              <h2>
                <Zap />
                Atalhos
              </h2>
            </div>
            <div className="reference-shortcut-grid">
              {receptionShortcuts.map((a, i) =>
                i === 0 ? (
                  <Button
                    variant="outline"
                    key={a.path}
                    className="reference-shortcut"
                    onClick={openAppointment}
                  >
                    <a.icon />
                    <span>{a.label}</span>
                  </Button>
                ) : (
                  <Button variant="outline" key={a.path} className="reference-shortcut" asChild>
                    <Link to={a.path}>
                      <a.icon />
                      <span>{a.label}</span>
                      {a.path === "/atendimento" && <small>3 aguardando</small>}
                    </Link>
                  </Button>
                ),
              )}
            </div>
          </section>
          <section className="reference-panel reference-ai">
            <div className="integration-brand">
              <Sparkles />
              <h2>UPVET AI</h2>
              <span className="beta-tag">Beta</span>
            </div>
            <p>Seu assistente inteligente na rotina clínica.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                showNotice(
                  "UPVET AI · Beta",
                  "Prévia demonstrativa do assistente UPVET AI. Nenhuma inteligência artificial está conectada nesta etapa.",
                )
              }
            >
              Abrir
              <ExternalLink />
            </Button>
          </section>
          <section className="reference-panel reference-whatsapp">
            <div className="integration-brand">
              <MessageCircle />
              <h2>WhatsApp Integrado</h2>
            </div>
            <span className="message-counter">12 novas mensagens</span>
            <Button variant="outline" size="sm" asChild>
              <Link to="/whatsapp">
                Abrir atendimento
                <ExternalLink />
              </Link>
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
