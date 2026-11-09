import { getGoogleSession, AuthError } from './googleAuth';
export async function requireAdmin() {
 const session = await getGoogleSession();
 const {data,error} = await session.client.rpc('nutridex_is_admin');
 if(error) throw new AuthError('Não foi possível verificar a administração.',503);
 if(data !== true) throw new AuthError('Acesso restrito à administração.',403);
 return session;
}
