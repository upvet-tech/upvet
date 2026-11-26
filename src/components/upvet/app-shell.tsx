import logoAsset from "@/assets/upvet-sidebar-logo.png.asset.json";
import sphereAsset from "@/assets/upvet-sphere.png.asset.json";
import { createContext, useContext, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Menu,
  Search,
  ChevronDown,
  Bell,
  CircleHelp,
  Building2,
  Plus,
  Sparkles,
  Check,
  X,
  LogOut,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { modules, initialAppointments, type Appointment } from "@/lib/upvet/data";
const DemoContext = createContext<{
  appointments: Appointment[];
  search: string;
  openAppointment: () => void;
  showNotice: (title: string, text: string) => void;
} | null>(null);
export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("Demo provider required");
  return context;
}
export function Brand() {
  return (
    <>
      <img className="official-sidebar-logo" src={logoAsset.url} alt="UPVET TECH SYSTEMS" />
      <img className="official-sidebar-sphere" src={sphereAsset.url} alt="UPVET" />
    </>
  );
}
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [appointments, setAppointments] = useState(initialAppointments);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [notice, setNotice] = useState<{ title: string; text: string } | null>(null);
  const [unit, setUnit] = useState("Unidade Centro");
  const current = modules.find((m) => m.path === pathname);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: { redirect: "/" }, replace: true });
  }
  function toggleMenu() {
    if (window.matchMedia("(max-width:760px)").matches) setMobileOpen(!mobileOpen);
    else setCollapsed(!collapsed);
  }
  function submitAppointment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const patient = String(form.get("patient")).trim();
    const tutor = String(form.get("tutor")).trim();
    if (!patient || !tutor) return;
    setAppointments((a) =>
      [
        ...a,
        {
          id: Date.now(),
          patient,
          tutor,
          time: String(form.get("time")),
          service: String(form.get("service")),
          vet: String(form.get("vet")),
          breed: "Novo agendamento",
          status: "Aguardando" as const,
        },
      ].sort((a, b) => a.time.localeCompare(b.time)),
    );
    setAppointmentOpen(false);
    setNotice({
      title: "Agendamento criado",
      text: `${patient} está na agenda de hoje às ${String(form.get("time"))}. Este agendamento é demonstrativo e permanece durante esta sessão.`,
    });
  }
  return (
    <DemoContext.Provider
      value={{
        appointments,
        search,
        openAppointment: () => setAppointmentOpen(true),
        showNotice: (title, text) => setNotice({ title, text }),
      }}
    >
      <div
        className={`app-shell ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""} ${pathname === "/" ? "reference-home" : ""}`}
      >
        {mobileOpen && (
          <Button
            className="mobile-overlay"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
          />
        )}
        <aside className="sidebar">
          <Link to="/" className="brand" aria-label="UPVET início">
            <Brand />
          </Link>
          <nav aria-label="Menu principal">
            {modules.map((m, i) => (
              <div key={m.path}>
                <Link
                  to={m.path}
                  onClick={() => {
                    setMobileOpen(false);
                    setSearch("");
                  }}
                  title={m.path === "/" ? "Início" : m.title}
                  className={`nav-link ${pathname === m.path ? "active" : ""}`}
                  aria-current={pathname === m.path ? "page" : undefined}
                >
                  <m.icon />
                  <span className="nav-text">
                    {m.path === "/" ? "Início" : m.title}
                    {m.path === "/laboratorios" && (
                      <span className="connect-tag">UPVET CONNECT</span>
                    )}
                  </span>
                  {m.path === "/whatsapp" && (
                    <span className="nav-text ml-auto text-[9px] text-cyan">3</span>
                  )}
                </Link>
              </div>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <strong className="flex items-center gap-2">
              <span className="text-cyan">✦</span> Gestão que conecta.
            </strong>
            UPVET © 2026 <span className="float-right">v1.0</span>
          </div>
        </aside>
        <div className="app-main">
          <header className="topbar">
            {pathname === "/" && (
              <div className="reference-greeting">
                <h1>Olá, equipe UPVET! 👋</h1>
                <p>Aqui está o resumo da operação da sua clínica veterinária.</p>
              </div>
            )}
            <div className="flex items-center gap-5">
              <Button
                variant="ghost"
                size="icon"
                className="header-button"
                onClick={toggleMenu}
                aria-label="Alternar menu"
                title="Alternar menu"
              >
                <Menu size={19} />
              </Button>
              <label className="header-search">
                <Search size={16} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar paciente, tutor ou atendimento..."
                  aria-label="Buscar paciente, tutor ou atendimento"
                />
              </label>
            </div>
            <div className="header-right">
              <div className="header-unit flex items-center gap-2">
                <Building2 size={16} className="text-cyan" />
                <select
                  className="bg-navy text-[11px] outline-none max-w-40"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  aria-label="Unidade"
                >
                  <option>Unidade Centro</option>
                  <option>Unidade Jardins</option>
                </select>
              </div>
              <div className="h-6 border-l border-navy-foreground/15" />
              <Button
                variant="ghost"
                size="icon"
                className="header-button"
                title="Ajuda"
                aria-label="Ajuda"
                onClick={() =>
                  setNotice({
                    title: "Central de ajuda UPVET",
                    text: "Esta é a primeira versão demonstrativa do UPVET. Os módulos podem ser explorados pelo menu; agendamentos criados são mantidos apenas nesta sessão.",
                  })
                }
              >
                <CircleHelp />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="header-button"
                title="Sair"
                aria-label="Sair"
                onClick={signOut}
              >
                <LogOut />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="header-button relative"
                title="Notificações"
                aria-label="Notificações"
                onClick={() =>
                  setNotice({
                    title: "Notificações",
                    text: "5 consultas aguardam confirmação. O estoque de vacina V10 está baixo. Há 2 resultados laboratoriais disponíveis.",
                  })
                }
              >
                <Bell />
                <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-cyan" />
              </Button>
              <div className="flex items-center gap-9">
                <div className="flex items-center gap-9">
                  <div className="flex items-center gap-2.5">
                    <div className="profile-avatar">JS</div>
                    <div className="profile-copy">
                      <strong className="text-[11px] block">Juliana Santos</strong>
                      <span className="text-[9px] text-navy-foreground/55">Recepção</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main className="page-content">
            <div className="breadcrumb">
              <Building2 size={12} />
              <span>Clínica Veterinária Vida</span>
              <span className="mx-1">/</span>
              <span className="text-foreground font-semibold">{current?.title ?? "UPVET"}</span>
              <span className="ml-auto demo-indicator">Ambiente de demonstração</span>
            </div>
            {children}
            <footer className="page-footer">
              <span>© 2026 UPVET. Gestão veterinária completa, moderna e inteligente.</span>
              <span className="flex items-center gap-1">
                <span className="text-success">
                  <Check size={11} />
                </span>
                Todos os sistemas operacionais <span className="mx-2">·</span> v1.0.0
              </span>
            </footer>
          </main>
        </div>
        <Dialog open={appointmentOpen} onOpenChange={setAppointmentOpen}>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Novo agendamento</DialogTitle>
              <DialogDescription>Agenda de 26 de novembro de 2026 · {unit}</DialogDescription>
            </DialogHeader>
            <form onSubmit={submitAppointment} className="mt-3">
              <div className="form-grid">
                <label className="form-field">
                  Paciente
                  <input name="patient" required placeholder="Nome do paciente" maxLength={60} />
                </label>
                <label className="form-field">
                  Tutor
                  <input name="tutor" required placeholder="Nome do tutor" maxLength={80} />
                </label>
                <label className="form-field">
                  Horário
                  <input type="time" name="time" required defaultValue="14:00" />
                </label>
                <label className="form-field">
                  Serviço
                  <select name="service">
                    <option>Consulta de rotina</option>
                    <option>Retorno</option>
                    <option>Vacinação</option>
                    <option>Avaliação dermatológica</option>
                  </select>
                </label>
                <label className="form-field col-span-full">
                  Veterinário
                  <select name="vet">
                    <option>Dra. Ana Paula</option>
                    <option>Dr. Rafael Costa</option>
                    <option>Dra. Camila Rocha</option>
                  </select>
                </label>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setAppointmentOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <Plus />
                  Agendar consulta
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog
          open={notice !== null}
          onOpenChange={(open) => {
            if (!open) setNotice(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{notice?.title}</DialogTitle>
              <DialogDescription className="pt-3 leading-7">{notice?.text}</DialogDescription>
            </DialogHeader>
            <Button className="mt-3 justify-self-end" onClick={() => setNotice(null)}>
              Entendido
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </DemoContext.Provider>
  );
}
