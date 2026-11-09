# Configuracao Supabase do NutriDex

## 1. Banco de dados

Abra o SQL Editor do Supabase e execute o arquivo:

```sql
supabase/schema.sql
```

Ele cria as tabelas principais:

- patients
- appointments
- foods
- clínical_notes
- exams
- photos
- payments
- anthropometry_records
- body_measures
- meal_plans
- meal_plan_items

As tabelas ficam com RLS ativo. O app grava pelo backend Next usando a `SUPABASE_SERVICE_ROLE_KEY`.

## 2. Variáveis de ambiente

Crie um arquivo `.env.local` baseado em `.env.local.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

Onde encontrar:

- `NEXT_PUBLIC_SUPABASE_URL`: Project Settings > API > Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Project Settings > API > anon public
- `SUPABASE_SERVICE_ROLE_KEY`: Project Settings > API > service_role

Não publique a `service_role` no frontend. Ela fica apenas no `.env.local` e nas variáveis do servidor/deploy.

## 3. Projeto criado

Projeto Supabase criado para o NutriDex:

- Nome: `nutridex`
- Ref: `cxveficpzijwojgrysik`
- URL: `https://cxveficpzijwojgrysik.supabase.co`
- Regiao: `sa-east-1`

O arquivo `.env.local` local ja foi configurado com as chaves deste projeto.

## 4. APIs criadas

- `GET/POST /api/patients`
- `GET/POST /api/appointments`
- `GET/POST /api/foods`
- `GET/POST /api/clínical-notes`
- `GET/POST /api/exams`
- `GET/POST /api/photos`
- `GET/POST /api/payments`
- `GET/POST /api/anthropometry`
- `GET/POST /api/body-measures`

Sem variáveis Supabase configuradas, as APIs retornam modo simulado para a interface continuar testavel.


