import { AppShell, Card, PageHeader } from "../components/AppShell";
import { RecordActions } from "../components/RecordActions";
import { finances, formatCurrency, formatDate, getPayments } from "../lib/dataServer";

export const dynamic = "force-dynamic";

export default async function FinanceiroPage() {
  const payments = await getPayments();
  const paidTotal = payments.reduce((total, item) => total + Number(item.amount ?? 0), 0);
  const cards = payments.length ? [
    { label: "Receita registrada", value: formatCurrency(paidTotal), note: "Pagamentos no banco" },
    { label: "Pagamentos", value: String(payments.length), note: "Registros salvos" },
    { label: "Ticket médio", value: formatCurrency(paidTotal / Math.max(payments.length, 1)), note: "Média dos pagamentos" },
  ] : finances;

  return (
    <AppShell>
      <PageHeader eyebrow="Financeiro" title="Gestão financeira" description="Resumo de receitas, pagamentos e pendências da clínica." action="Registrar pagamento" />
      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-6 sm:px-8 xl:grid-cols-3">
        {cards.map((item) => <Card key={item.label} className="p-5"><p className="text-sm font-bold text-[var(--muted)]">{item.label}</p><p className="mt-3 text-3xl font-bold text-[var(--heading)]">{item.value}</p><p className="mt-2 text-sm text-[var(--gold-strong)]">{item.note}</p></Card>)}
        <Card className="p-5 xl:col-span-3">
          <h2 className="font-bold">Pagamentos registrados</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {payments.map((payment) => <div key={payment.id} className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-4"><strong>{payment.patient_name}</strong><p className="mt-2 text-2xl font-bold text-[var(--heading)]">{formatCurrency(payment.amount)}</p><p className="text-sm text-[var(--muted)]">{payment.method ?? "Método não informado"} - {formatDate(payment.paid_at)}</p><p className="mt-1 text-xs font-bold text-[var(--gold-strong)]">{payment.status ?? "Pago"}</p><RecordActions endpoint={`/api/payments/${payment.id}`} title="Pagamento" hidden={{ patient_id: payment.patient_id, patient: payment.patient_name, Paciente: payment.patient_name }} fields={[{ label: "Paciente", name: "Paciente", value: payment.patient_name }, { label: "Valor", name: "Valor", type: "number", value: payment.amount }, { label: "Forma de pagamento", name: "Forma de pagamento", value: payment.method, options: ["Pix", "Cartão de crédito", "Cartão de débito", "Dinheiro", "Boleto"] }, { label: "Status", name: "Status", value: payment.status, options: ["Pago", "Pendente", "Atrasado", "Cancelado"] }]} /></div>)}
            {!payments.length ? <div className="rounded-md bg-[var(--warning-soft)] p-4">Nenhum pagamento cadastrado no banco ainda.</div> : null}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}

