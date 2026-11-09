# Acesso Google

Autenticação exclusiva com Google pelo Supabase, sessão em cookies HttpOnly e consultas usando o JWT individual e regras RLS.

Variáveis: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, NUTRIDEX_SITE_ORIGIN. Para vinculação inicial dos registros anteriores: NUTRIDEX_INITIAL_OWNER_EMAIL e SUPABASE_SECRET_KEY, usados apenas no retorno autenticado do proprietário com e-mail verificado.

Não disponibilizar o site sem a proteção de rotas e a autorização por usuário. O retorno é /auth/google-callback.
