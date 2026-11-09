"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./ClientActions";
import { Icon, navItems } from "./Navigation";

const groups = [
  { title: "CONSULTÓRIO", paths: ["/painel", "/agenda", "/pacientes"] },
  { title: "ATENDIMENTO", paths: ["/anamnese", "/antropometria", "/medidas", "/plano-alimentar", "/alimentos", "/exames", "/fotografias", "/notas"] },
  { title: "FERRAMENTAS E GESTÃO", paths: ["/calculadoras", "/historico", "/financeiro", "/relatorios", "/configuracoes", "/assinatura"] },
];
function SearchIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>; }
export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const current = [...navItems].sort((a,b) => b.href.length-a.href.length).find(item => item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));
  const normalized = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const results = navItems.filter(item => item.label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(normalized));
  function openSearch() { setQuery(""); dialog.current?.showModal(); searchInput.current?.focus(); }
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); dialog.current?.showModal(); searchInput.current?.focus(); }
      if (event.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  useEffect(() => {
    if (!mobileOpen) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = before; };
  }, [mobileOpen]);
  return <>
    <a href="#conteudo" className="nx-skip">Ir para o conteúdo</a>
    {mobileOpen ? <button className="nx-drawer-backdrop" onClick={() => setMobileOpen(false)} aria-label="Fechar menu" /> : null}
    <aside className={`nx-sidebar ${mobileOpen ? "is-open" : ""}`} aria-label="Menu principal">
      <a href="/painel" className="nx-brand" aria-label="NutriDex, início"><span className="nx-brand-symbol"><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M8 23C6 13 12 6 25 7c1 13-6 19-16 16Z" stroke="currentColor" strokeWidth="2.2"/><path d="m8 25 12-12M12 21v-7M12 21h7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg></span><span><strong>nutri<span>dex</span></strong><small>GESTÃO NUTRICIONAL</small></span></a>
      <button type="button" className="nx-drawer-close" onClick={() => setMobileOpen(false)} aria-label="Fechar menu lateral">×</button>
      <a href="/pacientes/novo" className="nx-new-patient"><Icon name="userPlus" /> Novo paciente <span aria-hidden="true">+</span></a>
      <nav className="nx-sidebar-nav" aria-label="Navegação principal">{groups.map(group => <div className="nx-nav-group" key={group.title}><p>{group.title}</p>{group.paths.map(href => {
        const item = navItems.find(nav => nav.href === href)!;
        const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
        return <a key={href} href={href} aria-current={active ? "page" : undefined} className={active ? "is-active" : ""}><Icon name={item.icon}/><span>{item.label === "Dashboard" ? "Visão geral" : item.label}</span>{active ? <i aria-hidden="true" /> : null}</a>;
      })}</div>)}</nav>
      <a href="/configuracoes" className="nx-workspace"><span className="nx-avatar">ND</span><span><strong>Meu consultório</strong><small>Preferências e configurações</small></span><span aria-hidden="true">›</span></a>
    <form action="/auth/logout" method="post" className="nx-logout"><button type="submit">Sair da conta Google <span aria-hidden="true">↗</span></button></form>
    </aside>
    <header className="nx-topbar">
      <div className="nx-breadcrumb"><button className="nx-menu-toggle" type="button" aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button><span>Consultório</span><span aria-hidden="true">/</span><strong>{current?.label === "Dashboard" ? "Visão geral" : current?.label ?? "NutriDex"}</strong></div>
      <div className="nx-topbar-actions"><button type="button" className="nx-search-trigger" onClick={openSearch} aria-label="Buscar página ou ferramenta"><SearchIcon/><span>Buscar ferramenta...</span><kbd>Ctrl K</kbd></button><ThemeToggle/><a className="nx-avatar nx-profile" href="/configuracoes" aria-label="Configurações do consultório">ND</a></div>
    </header>
    <dialog ref={dialog} className="nx-search-dialog" onClick={event => { if(event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="nx-search-input"><SearchIcon/><input ref={searchInput} value={query} onChange={event => setQuery(event.target.value)} placeholder="Qual página você procura?" aria-label="Buscar página ou ferramenta"/><button type="button" onClick={() => dialog.current?.close()} aria-label="Fechar busca">Esc</button></div>
      <p className="nx-search-caption">{query ? "RESULTADOS DA BUSCA" : "PÁGINAS E FERRAMENTAS"}</p>
      <nav aria-label="Resultados da busca">{results.length ? results.map(item => <a key={item.href} href={item.href}><Icon name={item.icon}/><span>{item.label}</span><span aria-hidden="true">↗</span></a>) : <p className="nx-search-empty">Nenhuma página encontrada. Tente outro termo.</p>}</nav>
    </dialog>
  </>;
}
