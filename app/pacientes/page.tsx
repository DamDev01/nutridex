import { AppShell, PageHeader } from "../components/AppShell";
import { getPatients, formatDate } from "../lib/dataServer";
export const dynamic = "force-dynamic";
export default async function PacientesPage({searchParams}:{searchParams:Promise<{page?:string;q?:string;goal?:string}>}) {
  const patients=await getPatients();
  const params=await searchParams;
  const query=(params.q ?? "").trim();
  const goal=params.goal ?? "";
  const normalize=(value:string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  const filtered=patients.filter(p => (!query || normalize(p.name+" "+(p.goal ?? "")).includes(normalize(query))) && (!goal || p.goal===goal));
  const pageSize=12;
  const totalPages=Math.max(1,Math.ceil(filtered.length/pageSize));
  const requested=Number(params.page ?? 1);
  const page=Math.min(totalPages,Number.isFinite(requested)&&requested>0?Math.floor(requested):1);
  const visible=filtered.slice((page-1)*pageSize,page*pageSize);
  const goals=[...new Set(patients.map(p=>p.goal).filter((v):v is string=>Boolean(v)))];
  return <AppShell><PageHeader eyebrow="RELACIONAMENTOS QUE TRANSFORMAM" title="Seus pacientes" description="Cada pessoa, uma história. Acompanhe objetivos, evolução e os próximos encontros." action="+ Adicionar paciente"/>
    <section className="nx-directory"><div className="nx-directory-toolbar"><p className="nx-directory-count"><strong>{filtered.length}</strong> paciente(s) {query||goal ? "encontrado(s)" : "na sua carteira"}</p><form className="nx-directory-filters" method="get"><input type="search" name="q" defaultValue={query} placeholder="Buscar por nome ou objetivo..." aria-label="Buscar pacientes"/><select name="goal" defaultValue={goal} aria-label="Filtrar por objetivo"><option value="">Todos os objetivos</option>{goals.map(item=><option key={item}>{item}</option>)}</select><button className="nx-button" type="submit">Filtrar</button>{query||goal ? <a href="/pacientes" className="text-xs text-[var(--muted)]">Limpar</a> : null}</form></div>
    <div className="nx-directory-grid">{visible.map((patient,index)=><a className="nx-card nx-directory-card" href={`/pacientes/${patient.id}`} key={patient.id}><div className="nx-patient-card-top"><span className={`nx-avatar nx-avatar-${index%3}`}>{patient.name.split(" ").slice(0,2).map(n=>n[0]).join("")}</span><div><h2>{patient.name}</h2><p>{patient.age ?? "—"} anos <span aria-hidden="true">·</span> {patient.weight ? patient.weight+" kg" : "Peso não informado"}</p></div></div><span className="nx-patient-card-goal">{patient.goal ?? "Acompanhamento nutricional"}</span><div className="nx-patient-card-adherence"><span>Aderência ao plano</span><strong>{patient.adherence ?? 0}%</strong></div><div className="nx-patient-card-bar"><span style={{width:Math.max(0,Math.min(100,patient.adherence ?? 0))+"%"}}/></div><div className="nx-patient-card-footer"><span>Retorno: {formatDate(patient.next_appointment_at)}</span><strong>Ver prontuário ↗</strong></div></a>)}</div>
    {!visible.length ? <div className="nx-card nx-empty"><h2>Nenhum paciente encontrado</h2><p>Experimente outro nome ou ajuste o filtro por objetivo.</p><a href="/pacientes" className="nx-button nx-button-secondary">Ver todos os pacientes</a></div> : null}
    {totalPages>1 ? <nav className="nx-pagination" aria-label="Paginação">{Array.from({length:totalPages},(_,i)=>i+1).map(n=><a key={n} aria-current={n===page?"page":undefined} href={`/pacientes?${new URLSearchParams({page:String(n),q:query,goal}).toString()}`}>{n}</a>)}</nav> : null}</section></AppShell>;
}
