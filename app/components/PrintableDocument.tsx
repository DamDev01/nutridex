import type { ReactNode } from "react";

type PrintableDocumentProps = {
  title: string;
  subtitle: string;
  metadata: Array<{ label: string; value: string }>;
  observations?: string;
  children: ReactNode;
};

export function PrintableDocument({ title, subtitle, metadata, observations, children }: PrintableDocumentProps) {
  const generatedAt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date());

  return (
    <article className="print-document" aria-hidden="true">
      <header className="print-document__header">
        <div className="print-document__brand"><span>N</span><div><strong>NutriDex</strong><small>Nutrição clínica e acompanhamento</small></div></div>
        <div className="print-document__date"><strong>{title}</strong><span>Emitido em {generatedAt}</span></div>
      </header>
      <section className="print-document__intro">
        <h1>{title}</h1><p>{subtitle}</p>
        <dl>{metadata.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
      </section>
      <div className="print-document__body">{children}</div>
      <section className="print-document__notes"><h2>Observações</h2><p>{observations?.trim() || "Sem observações adicionais."}</p></section>
      <footer className="print-document__footer"><div><span className="print-document__signature" /><strong>Nutricionista responsável</strong><small>Assinatura e carimbo</small></div><p>Documento gerado pelo NutriDex</p></footer>
    </article>
  );
}