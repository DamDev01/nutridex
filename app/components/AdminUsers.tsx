"use client";
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import styles from '../admin/admin.module.css';
type User={email:string;registered:boolean;created_at:string|null;blocked:boolean;archived:boolean;trial_until:string|null;paid_until:string|null;is_admin:boolean};
export function AdminUsers({users}:{users:User[]}){
 const router=useRouter();const [query,setQuery]=useState('');const [email,setEmail]=useState('');const [days,setDays]=useState(7);const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');
 const now=Date.now();const current=(d:string|null)=>!!d&&new Date(d).getTime()>now;
 async function change(email:string,action:string){
  if(action==='archive'&&!window.confirm('Excluir o acesso desta conta? O acesso será suspenso e os dados serão preservados para restauração. Isso não cancela uma assinatura na Stripe.'))return;
  setBusy(true);setMessage('');
  try{const r=await fetch('/api/admin/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,action,days})});const d=await r.json();if(!r.ok)throw new Error(d.error);setMessage('Acesso atualizado.');setEmail('');router.refresh();}catch(e){setMessage(e instanceof Error?e.message:'Falha ao atualizar.');}finally{setBusy(false);}
 }
 const visible=users.filter(u=>u.email.includes(query.toLowerCase()));
 const stats=[['Contas cadastradas',users.filter(u=>u.registered&&!u.archived).length],['Assinaturas ativas',users.filter(u=>current(u.paid_until)&&!u.blocked&&!u.archived).length],['Em teste',users.filter(u=>current(u.trial_until)&&!u.blocked&&!u.archived).length],['Bloqueadas',users.filter(u=>u.blocked&&!u.archived).length]];
 const date = (value: string) => new Date(value).toLocaleDateString('pt-BR', {timeZone:'America/Sao_Paulo'});
 return <div className={styles.dashboard}>
  <section className={styles.stats} aria-label="Resumo de acessos">
   {stats.map(([label,value], index)=><div className={styles.stat} key={label}>
    <span className={styles.statMark} aria-hidden="true">{['◎','↗','◷','⊘'][index]}</span>
    <p>{label}</p><strong>{value}</strong>
   </div>)}
  </section>
  <section className={styles.panel} aria-labelledby="trial-heading">
   <div className={styles.sectionHeading}><span className={styles.eyebrow}>CONVITES</span><h2 id="trial-heading">Liberar acesso de teste</h2><p>A pessoa deve entrar com o mesmo e-mail cadastrado.</p></div>
   <form className={styles.trialForm} onSubmit={e=>{e.preventDefault();void change(email,'trial');}}>
    <label>E-mail da conta Google<input type="email" placeholder="nome@exemplo.com" value={email} onChange={e=>setEmail(e.target.value)} required maxLength={254}/></label>
    <label>Duração em dias<input type="number" min={1} max={90} value={days} onChange={e=>setDays(Number(e.target.value))} required/></label>
    <button className={styles.primary} disabled={busy}>Liberar teste</button>
   </form>
   <p className={styles.feedback} role="status" aria-live="polite">{message}</p>
  </section>
  <section className={styles.panel} aria-labelledby="accounts-heading">
   <div className={styles.accountsHead}>
    <div className={styles.sectionHeading}><span className={styles.eyebrow}>DIRETÓRIO</span><h2 id="accounts-heading">Contas <span className={styles.count}>{visible.length}</span></h2></div>
    <label>Buscar conta<input type="search" placeholder="Buscar por e-mail" value={query} onChange={e=>setQuery(e.target.value)}/></label>
   </div>
   <div className={styles.accounts}>{visible.map(u=>{
    const status=u.is_admin?'Administradora':u.archived?'Arquivada':u.blocked?'Bloqueada':current(u.paid_until)?'Assinante':current(u.trial_until)?'Em teste':'Sem acesso ativo';
    const tone=u.is_admin?'admin':u.archived?'neutral':u.blocked?'danger':current(u.paid_until)?'active':current(u.trial_until)?'trial':'neutral';
    const actions=u.archived?[['restore','Restaurar acesso']]:[[u.blocked?'unblock':'block',u.blocked?'Desbloquear':'Bloquear'],['trial','Liberar/renovar teste'],['revoke_trial','Encerrar teste'],['archive','Excluir acesso']];
    return <article key={u.email} className={styles.account}>
     <div className={styles.identity}><span className={styles.avatar} aria-hidden="true">{u.email.slice(0,1).toUpperCase()}</span><div><h3>{u.email}</h3><p>{u.registered?'Cadastro concluído':'Aguardando primeiro login'}</p></div></div>
     <div className={styles.details}><span className={styles.badge} data-tone={tone}>{status}</span>{u.trial_until&&<p>Teste até {date(u.trial_until)}</p>}{u.paid_until&&<p>Período pago até {date(u.paid_until)}</p>}</div>
     {!u.is_admin&&<details className={styles.actions}><summary aria-label={'Ações para '+u.email}>Ações <span aria-hidden="true">⌄</span></summary><div>{actions.map(([action,label])=><button type="button" data-danger={action==='archive'||action==='block'} key={action} disabled={busy} onClick={event=>{event.currentTarget.closest('details')?.removeAttribute('open');void change(u.email,action);}}>{label}</button>)}</div></details>}
    </article>;
   })}{!visible.length&&<p className={styles.empty}>Nenhuma conta encontrada.</p>}</div>
   <p className={styles.audit}>Bloqueio e exclusão de acesso preservam os dados e não cancelam cobranças na Stripe. As operações ficam registradas para auditoria.</p>
  </section>
 </div>;
}
