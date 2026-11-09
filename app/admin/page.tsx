import { requireAdmin } from '../lib/admin';
import { AdminUsers } from '../components/AdminUsers';
import { ThemeToggle } from '../components/ClientActions';
import { PublicDocument } from '../components/PublicDocument';
import { AuthError } from '../lib/googleAuth';
import styles from './admin.module.css';
export const dynamic='force-dynamic';
export default async function AdminPage(){
 try {
  const {client}=await requireAdmin();
  const {data,error}=await client.rpc('nutridex_admin_users');
  if(error) throw new Error('Falha na consulta');
  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}><span aria-hidden="true">N</span> NutriDex <small>Administração</small></div>
        <nav aria-label="Área administrativa">
          <ThemeToggle />
          <a href="/painel">Meu consultório</a>
          <form action="/auth/logout" method="post"><button type="submit">Sair</button></form>
        </nav>
      </header>
      <div className={styles.content}>
        <div className={styles.hero}>
          <p>GESTÃO DA PLATAFORMA</p>
          <h1>Contas e acessos</h1>
          <span>Acompanhe assinaturas e gerencie o acesso de teste ao NutriDex.</span>
        </div>
        <AdminUsers users={data??[]}/>
      </div>
    </main>
  );
 }catch(error){return <PublicDocument title="Administração"><p role="alert">{error instanceof AuthError?error.message:'A administração está temporariamente indisponível. Tente novamente.'}</p><a href="/login?next=%2Fadmin">Entrar com a conta administradora</a></PublicDocument>;}
}
