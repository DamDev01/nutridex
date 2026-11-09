import { AppShell, Card, CardTitle } from "../components/AppShell";
import { Icon, type IconName } from "../components/Navigation";
import { formatTime, getAppointments, getPatients } from "../lib/dataServer";
export const dynamic = "force-dynamic";
const initials = (name: string) => name.split(" ").filter(Boolean).slice(0,2).map(part => part[0]).join("");
export default async function DashboardPage() {
  const [patients, appointmentsData] = await Promise.all([getPatients(), getAppointments()]);
  const today = new Date();
  const dateKey = (date: Date) => new Intl.DateTimeFormat("en-CA", {timeZone:"America/Sao_Paulo"}).format(date);
  const appointments = appointmentsData.filter(item => dateKey(new Date(item.scheduled_at)) === dateKey(today)).sort((a,b) => a.scheduled_at.localeCompare(b.scheduled_at));
  const monthKey = (date: Date) => new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit"}).format(date);
  const monthAppointments = appointmentsData.filter(item => monthKey(new Date(item.scheduled_at)) === monthKey(today));
  const inactive = patients.filter(patient => !patient.next_appointment_at || new Date(patient.next_appointment_at) < today).length;
  const average = Math.round(patients.reduce((sum,p) => sum+Number(p.adherence ?? 0),0)/Math.max(patients.length,1));
  const stats: {label:string;value:string;note:string;icon:IconName;color:string}[] = [
    {label:"Pacientes na carteira",value:String(patients.length),note:"Pessoas sob seus cuidados",icon:"users",color:"mint"},
    {label:"Consultas no mês",value:String(monthAppointments.length),note:"Atendimentos agendados",icon:"calendar",color:"blue"},
    {label:"Aderência média",value:average+"%",note:"Acompanhamento dos pacientes",icon:"activity",color:"violet"},
    {label:"Consultas realizadas",value:String(monthAppointments.filter(item => String(item.status).toLowerCase()==="realizada").length),note:"Atendimentos concluídos no mês",icon:"clipboard",color:"sand"},
  ];
  const shortcuts: {href:string;title:string;detail:string;icon:IconName}[] = [
    {href:"/plano-alimentar",title:"Plano alimentar",detail:"Planeje refeições com precisão",icon:"utensils"},
    {href:"/antropometria",title:"Avaliação corporal",detail:"Registre medidas e acompanhe a evolução",icon:"ruler"},
    {href:"/calculadoras",title:"Calculadoras clínicas",detail:"Os cálculos certos, em poucos passos",icon:"calculator"},
  ];
  return <AppShell><div className="nx-dashboard">
    <div className="nx-dashboard-heading"><div><p className="nx-eyebrow">SEU CONSULTÓRIO, EM PERSPECTIVA</p><h1>Cuidar começa com clareza.</h1><p>Veja o que importa hoje e siga com o seu próximo atendimento.</p></div><div className="nx-heading-actions"><span className="nx-date">{new Intl.DateTimeFormat("pt-BR",{timeZone:"America/Sao_Paulo",day:"numeric",month:"long"}).format(today)}</span><a href="/pacientes/novo" className="nx-button"><Icon name="userPlus"/>Novo paciente</a></div></div>
    <section className="nx-stats" aria-label="Indicadores do consultório">{stats.map(stat => <Card key={stat.label} className="nx-stat"><div className="nx-stat-top"><span>{stat.label}</span><span className={`nx-stat-icon ${stat.color}`}><Icon name={stat.icon}/></span></div><strong>{stat.value}</strong><p>{stat.note}</p></Card>)}</section>
    <div className="nx-dashboard-grid"><Card className="nx-schedule"><div className="nx-section-heading"><div><h2>Sua agenda de hoje</h2><p>{appointments.length ? appointments.length+" atendimento(s) programado(s)" : "Um espaço organizado para cada atendimento"}</p></div><a href="/agenda">Ver agenda <span aria-hidden="true">↗</span></a></div>
      {appointments.length ? <div className="nx-appointment-list">{appointments.map(item => <a key={item.id} href="/agenda" className="nx-appointment"><time>{formatTime(item.scheduled_at)}</time><span className="nx-avatar">{initials(item.patient_name)}</span><span><strong>{item.patient_name}</strong><small>{item.type ?? "Consulta"} · {item.goal ?? "Acompanhamento"}</small></span><span className="nx-status">{item.status ?? "Agendada"}</span></a>)}</div> : <div className="nx-empty"><span className="nx-empty-icon"><Icon name="calendar"/></span><h3>O dia está livre por aqui</h3><p>Suas consultas de hoje aparecerão neste espaço.<br/>Organize os próximos encontros na agenda.</p><a className="nx-button nx-button-secondary" href="/agenda">Organizar minha agenda <span aria-hidden="true">→</span></a></div>}
    </Card><Card className="nx-followup"><div className="nx-section-heading"><div><h2>Acompanhamento</h2><p>Pequenos sinais, melhores decisões</p></div><span className="nx-pill">PACIENTES</span></div><div className="nx-followup-body"><div className="nx-adherence-ring" style={{"--adherence":average+"%"} as React.CSSProperties}><span><strong>{average}<small>%</small></strong><em>Aderência média</em></span></div><div className="nx-followup-note"><span className="nx-note-dot"/><p><strong>{inactive} paciente(s)</strong> sem retorno futuro.<br/><a href="/pacientes">Revisar acompanhamento →</a></p></div></div></Card></div>
    <div className="nx-dashboard-grid nx-dashboard-bottom"><Card><div className="nx-section-heading"><div><h2>Seus pacientes</h2><p>O cuidado continua entre as consultas</p></div><a href="/pacientes">Ver todos ↗</a></div><div className="nx-patient-rows">{patients.slice(0,4).map((patient,index) => <a href={`/pacientes/${patient.id}`} key={patient.id} className="nx-patient-row"><span className={`nx-avatar nx-avatar-${index%3}`}>{initials(patient.name)}</span><span className="nx-patient-name"><strong>{patient.name}</strong><small>{patient.goal ?? "Acompanhamento nutricional"}</small></span><span className="nx-mini-adherence"><span>{patient.adherence ?? 0}% <small>aderência</small></span><i><b style={{width:Math.max(0,Math.min(100,patient.adherence ?? 0))+"%"}}/></i></span><span className="nx-row-arrow" aria-hidden="true">↗</span></a>)}{!patients.length ? <p className="nx-list-empty">Comece cadastrando seu primeiro paciente.</p> : null}</div></Card>
    <div className="nx-shortcuts"><div><p className="nx-eyebrow">NA SUA ROTINA</p><h2>Seu próximo passo,<br/>a um clique.</h2></div>{shortcuts.map(item => <a href={item.href} key={item.href} className="nx-shortcut"><span className="nx-shortcut-icon"><Icon name={item.icon}/></span><span><strong>{item.title}</strong><small>{item.detail}</small></span><span aria-hidden="true">↗</span></a>)}</div></div>
  </div></AppShell>;
}
