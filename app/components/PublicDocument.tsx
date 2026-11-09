import type { ReactNode } from 'react';


export function PublicDocument({ title, children }: { title: string; children: ReactNode }) {
  return <main className="mx-auto max-w-3xl px-6 py-12 text-[var(--text)]">
    <a href="/" className="font-bold text-[var(--primary)]">NutriDex</a>
    <h1 className="my-6 text-3xl font-bold">{title}</h1>
    <div className="space-y-6 text-sm leading-7">{children}</div>
    <footer className="mt-12 space-y-3 border-t border-[var(--border)] pt-6 text-xs leading-6">
      <nav className="flex flex-wrap gap-4" aria-label="Informações da plataforma"><a href="/planos">Plano</a><a href="/termos">Termos de uso</a><a href="/privacidade">Privacidade</a><a href="/suporte">Suporte</a></nav>

    </footer>
  </main>;
}

