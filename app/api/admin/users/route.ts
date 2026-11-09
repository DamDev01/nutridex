import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../lib/admin';
import { AuthError } from '../../../lib/googleAuth';
export async function POST(request:Request) {
 try {
  const {client}=await requireAdmin();
  const body=await request.json();
  if(typeof body.email!=='string'||!['block','unblock','trial','revoke_trial','archive','restore'].includes(body.action)||!Number.isInteger(body.days??7)||(body.days??7)<1||(body.days??7)>90) return NextResponse.json({error:'Confira os dados informados.'},{status:400});
  const {error}=await client.rpc('nutridex_admin_change',{p_email:body.email,p_action:body.action,p_days:body.days??7});
  if(error) return NextResponse.json({error:'Não foi possível alterar o acesso. A conta administradora é protegida.'},{status:400});
  return NextResponse.json({ok:true});
 } catch(error) {return NextResponse.json({error:error instanceof AuthError?error.message:'Não foi possível concluir a operação.'},{status:error instanceof AuthError?error.status:500});}
}
