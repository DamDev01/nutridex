export type IconName =
  | "dashboard"
  | "calendar"
  | "userPlus"
  | "users"
  | "clipboard"
  | "ruler"
  | "activity"
  | "utensils"
  | "library"
  | "fileHeart"
  | "camera"
  | "note"
  | "calculator"
  | "history"
  | "wallet"
  | "chart"
  | "settings";

type NavItem = {
  href: string;
  label: string;
  icon: IconName;
};

export const navItems: NavItem[] = [
  { href: "/painel", label: "Dashboard", icon: "dashboard" },
  { href: "/agenda", label: "Agenda", icon: "calendar" },
  { href: "/pacientes/novo", label: "Novo paciente", icon: "userPlus" },
  { href: "/pacientes", label: "Pacientes", icon: "users" },
  { href: "/anamnese", label: "Anamnese", icon: "clipboard" },
  { href: "/antropometria", label: "Antropometria", icon: "ruler" },
  { href: "/medidas", label: "Medidas", icon: "activity" },
  { href: "/plano-alimentar", label: "Plano alimentar", icon: "utensils" },
  { href: "/alimentos", label: "Alimentos", icon: "library" },
  { href: "/exames", label: "Exames", icon: "fileHeart" },
  { href: "/fotografias", label: "Fotografias", icon: "camera" },
  { href: "/notas", label: "Notas", icon: "note" },
  { href: "/calculadoras", label: "Calculadoras", icon: "calculator" },
  { href: "/historico", label: "Histórico", icon: "history" },
  { href: "/financeiro", label: "Financeiro", icon: "wallet" },
  { href: "/relatorios", label: "Relatórios", icon: "chart" },
  { href: "/configuracoes", label: "Configurações", icon: "settings" },
  { href: "/assinatura", label: "Minha assinatura", icon: "wallet" },
];

const paths: Record<IconName, string> = {
  dashboard: "M4 13h7V4H4v9Zm0 7h7v-5H4v5Zm9 0h7v-9h-7v9Zm0-16v5h7V4h-7Z",
  calendar: "M7 2v3M17 2v3M4 8h16M5 4h14a1 1 0 0 1 1 1v15H4V5a1 1 0 0 1 1-1Z",
  userPlus: "M15 19a6 6 0 0 0-12 0M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm10-1v6M16 13h6",
  users: "M16 19a6 6 0 0 0-12 0M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm10 8a5 5 0 0 0-4-4.9M16 3.5a3.5 3.5 0 0 1 0 7",
  clipboard: "M9 4h6l1 2h3v16H5V6h3l1-2Zm0 7h6M9 15h6M9 19h4",
  ruler: "M4 17 17 4l3 3L7 20l-3-3Zm4-2 2 2M11 12l2 2M14 9l2 2",
  activity: "M3 12h4l2-7 4 14 2-7h6",
  utensils: "M6 2v8M9 2v8M6 10h3v12M15 2v20M15 2c4 2 4 8 0 10",
  library: "M4 19V5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2Zm4-12h7M8 11h7M8 15h5",
  fileHeart: "M6 2h9l5 5v15H6V2Zm9 0v6h5M12 18s-4-2.4-4-5a2.2 2.2 0 0 1 4-1.2A2.2 2.2 0 0 1 16 13c0 2.6-4 5-4 5Z",
  camera: "M4 7h4l2-3h4l2 3h4v13H4V7Zm8 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  note: "M5 3h14v18H5V3Zm4 5h6M9 12h6M9 16h4",
  calculator: "M7 2h10v20H7V2Zm2 4h6v3H9V6Zm0 7h2M13 13h2M9 17h2M13 17h2",
  history: "M4 12a8 8 0 1 0 2.3-5.7L4 8M4 4v4h4M12 7v5l3 2",
  wallet: "M4 7h16v13H4V7Zm0 0 3-4h10l3 4M16 14h4",
  chart: "M4 20h16M7 17V9M12 17V4M17 17v-6",
  settings: "M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Zm0-13 1.2 2.2 2.5.5.4 2.5 2 1.5-1.1 2.3 1.1 2.3-2 1.5-.4 2.5-2.5.5L12 21.5l-1.2-2.2-2.5-.5-.4-2.5-2-1.5 1.1-2.3-1.1-2.3 2-1.5.4-2.5 2.5-.5L12 2.5Z",
};

export function Icon({ name }: { name: IconName }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  );
}

