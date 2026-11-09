import type { ReactNode } from "react";
import { ActionButton } from "./ClientActions";
import { Sidebar } from "./Sidebar";

export function AppShell({ children, footerNote }: { children: ReactNode; footerNote?: ReactNode }) {
  return <main className="nx-app"><Sidebar /><div className="nx-content" id="conteudo">{children}<footer className="nx-page-footer"><span>NutriDex</span><span>Mais tempo para cuidar. Mais clareza para decidir.</span>{footerNote}</footer></div></main>;
}
export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: string }) {
  return <section className="nx-page-heading"><div className="nx-page-heading-inner"><div><p className="nx-eyebrow">{eyebrow}</p><h1>{title}</h1><p className="nx-description">{description}</p></div>{action ? <ActionButton label={action} /> : null}</div></section>;
}
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`nx-card ${className}`}>{children}</section>;
}
export function CardTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return <div className="nx-card-heading"><h2>{title}</h2>{subtitle ? <p>{subtitle}</p> : null}</div>;
}
