import {
  LayoutDashboard,
  CalendarDays,
  PawPrint,
  Users,
  Stethoscope,
  HeartPulse,
  ClipboardPlus,
  BedDouble,
  Package,
  Wallet,
  MessageCircle,
  FlaskConical,
  ShoppingBag,
  ChartNoAxesCombined,
  Settings,
} from "lucide-react";
export const modules = [
  { path: "/", title: "Dashboard", icon: LayoutDashboard },
  { path: "/agenda", title: "Agenda", icon: CalendarDays },
  { path: "/pacientes", title: "Pacientes", icon: PawPrint },
  { path: "/tutores", title: "Tutores", icon: Users },
  { path: "/veterinarios", title: "Veterinários", icon: Stethoscope },
  { path: "/atendimento", title: "Atendimento", icon: HeartPulse },
  { path: "/prontuarios", title: "Prontuários", icon: ClipboardPlus },
  { path: "/internacao", title: "Internação", icon: BedDouble },
  { path: "/estoque", title: "Estoque", icon: Package },
  { path: "/financeiro", title: "Financeiro", icon: Wallet },
  { path: "/whatsapp", title: "WhatsApp", icon: MessageCircle },
  { path: "/laboratorios", title: "Laboratórios", icon: FlaskConical },
  { path: "/marketplace", title: "Marketplace", icon: ShoppingBag },
  { path: "/relatorios", title: "Relatórios e indicadores", icon: ChartNoAxesCombined },
  { path: "/configuracoes", title: "Configurações", icon: Settings },
] as const;
export type ModulePath = (typeof modules)[number]["path"];
export type Appointment = {
  id: number;
  time: string;
  patient: string;
  breed: string;
  tutor: string;
  service: string;
  vet: string;
  status: "Confirmado" | "Aguardando" | "Em atendimento" | "Concluído";
};
export const initialAppointments: Appointment[] = [
  {
    id: 1,
    time: "09:00",
    patient: "Thor",
    breed: "Golden Retriever · 4 anos",
    tutor: "Mariana Oliveira",
    service: "Consulta de rotina",
    vet: "Dra. Ana Paula",
    status: "Concluído",
  },
  {
    id: 2,
    time: "09:30",
    patient: "Luna",
    breed: "Persa · 2 anos",
    tutor: "Carlos Eduardo",
    service: "Retorno",
    vet: "Dr. Rafael Costa",
    status: "Em atendimento",
  },
  {
    id: 3,
    time: "10:00",
    patient: "Mel",
    breed: "Shih-tzu · 3 anos",
    tutor: "Juliana Santos",
    service: "Vacinação",
    vet: "Dra. Ana Paula",
    status: "Confirmado",
  },
  {
    id: 4,
    time: "10:30",
    patient: "Simba",
    breed: "SRD · 1 ano",
    tutor: "Pedro Almeida",
    service: "Consulta de rotina",
    vet: "Dr. Rafael Costa",
    status: "Aguardando",
  },
  {
    id: 5,
    time: "11:00",
    patient: "Bento",
    breed: "Bulldog Francês · 5 anos",
    tutor: "Fernanda Lima",
    service: "Avaliação dermatológica",
    vet: "Dra. Camila Rocha",
    status: "Confirmado",
  },
];
export const operationalMetrics = [
  {
    key: "scheduled",
    label: "Consultas agendadas",
    value: "24",
    detail: "+4 em relação a ontem",
    tone: "blue",
    icon: CalendarDays,
  },
  {
    key: "completed",
    label: "Atendimentos realizados",
    value: "12",
    detail: "50% da agenda concluída",
    tone: "green",
    icon: HeartPulse,
  },
  {
    key: "patients",
    label: "Pacientes cadastrados",
    value: "1.248",
    detail: "+18 novos este mês",
    tone: "cyan",
    icon: PawPrint,
  },
  {
    key: "pending",
    label: "Aguardando confirmação",
    value: "05",
    detail: "Confirmações pendentes",
    tone: "amber",
    icon: CalendarDays,
  },
] as const;
