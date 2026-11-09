-- NutriDex Supabase schema
-- Execute este arquivo no SQL Editor do Supabase.

create extension if not exists pgcrypto;

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  age integer,
  birth_date date,
  goal text,
  calories integer,
  adherence integer default 0,
  weight numeric,
  height numeric,
  notes text,
  next_appointment_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete set null,
  patient_name text not null,
  scheduled_at timestamptz not null,
  type text,
  goal text,
  status text not null default 'Pendente',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.foods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  calories numeric,
  carbs numeric,
  protein numeric,
  fat numeric,
  serving text default '100g',
  created_at timestamptz not null default now()
);

create table if not exists public.clinical_notes (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete set null,
  patient_name text,
  title text not null,
  note text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete set null,
  patient_name text,
  name text not null,
  exam_date date,
  status text,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete set null,
  patient_name text,
  angle text,
  note text,
  file_name text,
  file_url text,
  consent_recorded_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.photos add column if not exists consent_recorded_at timestamptz;

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete set null,
  patient_name text not null,
  amount numeric not null default 0,
  method text,
  status text not null default 'Pago',
  paid_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.anthropometry_records (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete set null,
  patient_name text,
  weight numeric,
  height numeric,
  body_fat numeric,
  lean_mass numeric,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.body_measures (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete set null,
  patient_name text,
  waist numeric,
  hip numeric,
  arm numeric,
  thigh numeric,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete set null,
  patient_name text,
  title text not null default 'Plano alimentar',
  status text not null default 'Ativo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.meal_plan_items (
  id uuid primary key default gen_random_uuid(),
  meal_plan_id uuid references public.meal_plans(id) on delete cascade,
  meal_name text not null,
  food_name text not null,
  amount text,
  calories numeric,
  protein numeric,
  carbs numeric,
  fat numeric,
  created_at timestamptz not null default now()
);

create table if not exists public.anamneses (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  patient_name text,
  chief_complaint text,
  food_history text,
  pathologies text,
  medications text,
  sleep_notes text,
  physical_activity text,
  consent_recorded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clinic_settings (
  id uuid primary key default gen_random_uuid(),
  clinic_name text,
  contact_email text,
  contact_phone text,
  business_hours text,
  default_units text not null default 'metric',
  notifications_enabled boolean not null default true,
  data_retention_months integer not null default 60,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists appointments_patient_id_idx on public.appointments(patient_id);
create index if not exists clinical_notes_patient_id_idx on public.clinical_notes(patient_id);
create index if not exists exams_patient_id_idx on public.exams(patient_id);
create index if not exists photos_patient_id_idx on public.photos(patient_id);
create index if not exists payments_patient_id_idx on public.payments(patient_id);
create index if not exists anamneses_patient_id_idx on public.anamneses(patient_id);
create index if not exists audit_logs_created_at_idx on public.audit_logs(created_at desc);
create index if not exists appointments_patient_id_idx on public.appointments(patient_id);
create index if not exists clinical_notes_patient_id_idx on public.clinical_notes(patient_id);
create index if not exists exams_patient_id_idx on public.exams(patient_id);
create index if not exists photos_patient_id_idx on public.photos(patient_id);
create index if not exists payments_patient_id_idx on public.payments(patient_id);
create index if not exists anamneses_patient_id_idx on public.anamneses(patient_id);
create index if not exists audit_logs_created_at_idx on public.audit_logs(created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = pg_catalog;

drop trigger if exists patients_set_updated_at on public.patients;
create trigger patients_set_updated_at before update on public.patients for each row execute function public.set_updated_at();

drop trigger if exists meal_plans_set_updated_at on public.meal_plans;
create trigger meal_plans_set_updated_at before update on public.meal_plans for each row execute function public.set_updated_at();

drop trigger if exists anamneses_set_updated_at on public.anamneses;
create trigger anamneses_set_updated_at before update on public.anamneses for each row execute function public.set_updated_at();

drop trigger if exists clinic_settings_set_updated_at on public.clinic_settings;
create trigger clinic_settings_set_updated_at before update on public.clinic_settings for each row execute function public.set_updated_at();

alter table public.patients enable row level security;
alter table public.appointments enable row level security;
alter table public.foods enable row level security;
alter table public.clinical_notes enable row level security;
alter table public.exams enable row level security;
alter table public.photos enable row level security;
alter table public.payments enable row level security;
alter table public.anthropometry_records enable row level security;
alter table public.body_measures enable row level security;
alter table public.meal_plans enable row level security;
alter table public.meal_plan_items enable row level security;
alter table public.anamneses enable row level security;
alter table public.clinic_settings enable row level security;
alter table public.audit_logs enable row level security;

insert into public.patients (name, age, goal, calories, adherence, weight, next_appointment_at)
select seed.* from (values
  ('Maria Silva', 34, 'Emagrecimento', 1800, 91, 74.2, now() + interval '1 day'),
  ('João Santos', 29, 'Hipertrofia', 2800, 84, 82.4, now() + interval '2 days'),
  ('Bianca Torres', 41, 'Reeducação', 1950, 76, 68.7, now() + interval '3 days')
) as seed(name, age, goal, calories, adherence, weight, next_appointment_at)
where not exists (select 1 from public.patients p where p.name = seed.name);
/*
values
  ('Maria Silva', 34, 'Emagrecimento', 1800, 91, 74.2, now() + interval '1 day'),
  ('João Santos', 29, 'Hipertrofia', 2800, 84, 82.4, now() + interval '2 days'),
  ('Bianca Torres', 41, 'Reeducação', 1950, 76, 68.7, now() + interval '3 days')
on conflict do nothing;
*/

insert into public.foods (name, category, calories, carbs, protein, fat, serving)
select seed.* from (values
  ('Maçã', 'Frutas', 52, 14, 0.3, 0.2, '100g'),
  ('Banana', 'Frutas', 89, 23, 1.1, 0.3, '100g'),
  ('Peito de frango', 'Proteínas', 165, 0, 31, 3.6, '100g'),
  ('Arroz integral', 'Carboidratos', 124, 26, 2.6, 1, '100g'),
  ('Abacate', 'Gorduras', 160, 9, 2, 15, '100g'),
  ('Iogurte natural', 'Laticínios', 61, 4.7, 3.5, 3.3, '100g')
) as seed(name, category, calories, carbs, protein, fat, serving)
where not exists (select 1 from public.foods f where f.name = seed.name);
/*
values
  ('Maçã', 'Frutas', 52, 14, 0.3, 0.2, '100g'),
  ('Banana', 'Frutas', 89, 23, 1.1, 0.3, '100g'),
  ('Peito de frango', 'Proteínas', 165, 0, 31, 3.6, '100g'),
  ('Arroz integral', 'Carboidratos', 124, 26, 2.6, 1, '100g'),
  ('Abacate', 'Gorduras', 160, 9, 2, 15, '100g'),
  ('Iogurte natural', 'Laticínios', 61, 4.7, 3.5, 3.3, '100g')
on conflict do nothing;
*/
