-- NutriDex RLS hardening
-- Execute no SQL Editor do Supabase depois do schema principal.
-- A aplicação server-side usa service role, que ignora RLS. Estas políticas protegem acesso direto com anon/authenticated keys.

alter table public.patients add column if not exists owner_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table public.appointments add column if not exists owner_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table public.clinical_notes add column if not exists owner_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table public.exams add column if not exists owner_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table public.anthropometry_records add column if not exists owner_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table public.body_measures add column if not exists owner_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table public.payments add column if not exists owner_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table public.foods add column if not exists owner_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table public.photos add column if not exists owner_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table public.meal_plans add column if not exists owner_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table public.meal_plan_items add column if not exists owner_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table public.anamneses add column if not exists owner_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table public.clinic_settings add column if not exists owner_id uuid references auth.users(id) on delete cascade default auth.uid();

alter table public.patients enable row level security;
alter table public.appointments enable row level security;
alter table public.clinical_notes enable row level security;
alter table public.exams enable row level security;
alter table public.anthropometry_records enable row level security;
alter table public.body_measures enable row level security;
alter table public.payments enable row level security;
alter table public.foods enable row level security;
alter table public.photos enable row level security;
alter table public.meal_plans enable row level security;
alter table public.meal_plan_items enable row level security;
alter table public.anamneses enable row level security;
alter table public.clinic_settings enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists patients_owner_select on public.patients;
drop policy if exists patients_owner_insert on public.patients;
drop policy if exists patients_owner_update on public.patients;
drop policy if exists patients_owner_delete on public.patients;
create policy patients_owner_select on public.patients for select to authenticated using (owner_id = auth.uid());
create policy patients_owner_insert on public.patients for insert to authenticated with check (coalesce(owner_id, auth.uid()) = auth.uid());
create policy patients_owner_update on public.patients for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy patients_owner_delete on public.patients for delete to authenticated using (owner_id = auth.uid());

drop policy if exists appointments_owner_select on public.appointments;
drop policy if exists appointments_owner_insert on public.appointments;
drop policy if exists appointments_owner_update on public.appointments;
drop policy if exists appointments_owner_delete on public.appointments;
create policy appointments_owner_select on public.appointments for select to authenticated using (owner_id = auth.uid());
create policy appointments_owner_insert on public.appointments for insert to authenticated with check (coalesce(owner_id, auth.uid()) = auth.uid());
create policy appointments_owner_update on public.appointments for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy appointments_owner_delete on public.appointments for delete to authenticated using (owner_id = auth.uid());

drop policy if exists clinical_notes_owner_select on public.clinical_notes;
drop policy if exists clinical_notes_owner_insert on public.clinical_notes;
drop policy if exists clinical_notes_owner_update on public.clinical_notes;
drop policy if exists clinical_notes_owner_delete on public.clinical_notes;
create policy clinical_notes_owner_select on public.clinical_notes for select to authenticated using (owner_id = auth.uid());
create policy clinical_notes_owner_insert on public.clinical_notes for insert to authenticated with check (coalesce(owner_id, auth.uid()) = auth.uid());
create policy clinical_notes_owner_update on public.clinical_notes for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy clinical_notes_owner_delete on public.clinical_notes for delete to authenticated using (owner_id = auth.uid());

drop policy if exists exams_owner_select on public.exams;
drop policy if exists exams_owner_insert on public.exams;
drop policy if exists exams_owner_update on public.exams;
drop policy if exists exams_owner_delete on public.exams;
create policy exams_owner_select on public.exams for select to authenticated using (owner_id = auth.uid());
create policy exams_owner_insert on public.exams for insert to authenticated with check (coalesce(owner_id, auth.uid()) = auth.uid());
create policy exams_owner_update on public.exams for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy exams_owner_delete on public.exams for delete to authenticated using (owner_id = auth.uid());

drop policy if exists anthropometry_owner_select on public.anthropometry_records;
drop policy if exists anthropometry_owner_insert on public.anthropometry_records;
drop policy if exists anthropometry_owner_update on public.anthropometry_records;
drop policy if exists anthropometry_owner_delete on public.anthropometry_records;
create policy anthropometry_owner_select on public.anthropometry_records for select to authenticated using (owner_id = auth.uid());
create policy anthropometry_owner_insert on public.anthropometry_records for insert to authenticated with check (coalesce(owner_id, auth.uid()) = auth.uid());
create policy anthropometry_owner_update on public.anthropometry_records for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy anthropometry_owner_delete on public.anthropometry_records for delete to authenticated using (owner_id = auth.uid());

drop policy if exists body_measures_owner_select on public.body_measures;
drop policy if exists body_measures_owner_insert on public.body_measures;
drop policy if exists body_measures_owner_update on public.body_measures;
drop policy if exists body_measures_owner_delete on public.body_measures;
create policy body_measures_owner_select on public.body_measures for select to authenticated using (owner_id = auth.uid());
create policy body_measures_owner_insert on public.body_measures for insert to authenticated with check (coalesce(owner_id, auth.uid()) = auth.uid());
create policy body_measures_owner_update on public.body_measures for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy body_measures_owner_delete on public.body_measures for delete to authenticated using (owner_id = auth.uid());

drop policy if exists payments_owner_select on public.payments;
drop policy if exists payments_owner_insert on public.payments;
drop policy if exists payments_owner_update on public.payments;
drop policy if exists payments_owner_delete on public.payments;
create policy payments_owner_select on public.payments for select to authenticated using (owner_id = auth.uid());
create policy payments_owner_insert on public.payments for insert to authenticated with check (coalesce(owner_id, auth.uid()) = auth.uid());
create policy payments_owner_update on public.payments for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy payments_owner_delete on public.payments for delete to authenticated using (owner_id = auth.uid());

drop policy if exists foods_owner_select on public.foods;
drop policy if exists foods_owner_insert on public.foods;
drop policy if exists foods_owner_update on public.foods;
drop policy if exists foods_owner_delete on public.foods;
create policy foods_owner_select on public.foods for select to authenticated using (owner_id = auth.uid());
create policy foods_owner_insert on public.foods for insert to authenticated with check (coalesce(owner_id, auth.uid()) = auth.uid());
create policy foods_owner_update on public.foods for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy foods_owner_delete on public.foods for delete to authenticated using (owner_id = auth.uid());

drop policy if exists photos_owner_all on public.photos;
create policy photos_owner_all on public.photos for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists meal_plans_owner_all on public.meal_plans;
create policy meal_plans_owner_all on public.meal_plans for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists meal_plan_items_owner_all on public.meal_plan_items;
create policy meal_plan_items_owner_all on public.meal_plan_items for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists anamneses_owner_all on public.anamneses;
create policy anamneses_owner_all on public.anamneses for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists clinic_settings_owner_all on public.clinic_settings;
create policy clinic_settings_owner_all on public.clinic_settings for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists audit_logs_owner_select on public.audit_logs;
create policy audit_logs_owner_select on public.audit_logs for select to authenticated using (actor_id = auth.uid());
