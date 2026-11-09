-- NutriDex Billing. Execute after schema.sql and rls.sql.
-- Clients can only read their own status. Stripe writes use the server secret.
begin;
create schema if not exists private;
revoke all on schema private from public, anon;
create table if not exists public.billing_accounts (
 owner_id uuid primary key references auth.users(id),
 stripe_customer_id text not null unique,
 blocked boolean not null default false,
 hold_reason text,
 hold_event text,
 created_at timestamptz not null default now()
);
create table if not exists public.billing_subscriptions (
 stripe_subscription_id text primary key,
 stripe_customer_id text not null,
 status text not null,
 paid_until timestamptz,
 cancel_at_period_end boolean not null default false,
 observed_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists billing_subscriptions_customer_idx on public.billing_subscriptions(stripe_customer_id);
create table if not exists private.billing_checkout_attempts (
 owner_id uuid primary key references auth.users(id),
 attempt uuid not null default gen_random_uuid(),
 created_at timestamptz not null default now()
);
alter table public.billing_accounts enable row level security;
alter table public.billing_subscriptions enable row level security;
alter table private.billing_checkout_attempts enable row level security;
revoke all on public.billing_accounts, public.billing_subscriptions from public, anon, authenticated;
revoke all on private.billing_checkout_attempts from public, anon, authenticated;
grant all on public.billing_accounts, public.billing_subscriptions, private.billing_checkout_attempts to service_role;

-- Authorization lookup is private, fixed to the current authenticated identity.
create or replace function private.nutridex_has_access() returns boolean
language sql stable security definer set search_path = '' as $$
 select auth.uid() is not null and exists (
  select 1 from public.billing_accounts a join public.billing_subscriptions s using (stripe_customer_id)
  where a.owner_id = auth.uid() and not a.blocked and s.status = 'active' and s.paid_until > now()
 );
$$;
revoke all on function private.nutridex_has_access() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.nutridex_has_access() to authenticated;
create or replace function private.nutridex_billing_status() returns jsonb
language sql stable security definer set search_path = '' as $$
 select jsonb_build_object('active', private.nutridex_has_access(),
  'blocked', coalesce((select a.blocked from public.billing_accounts a where a.owner_id=auth.uid()),false),
  'status', coalesce((select s.status from public.billing_subscriptions s join public.billing_accounts a using(stripe_customer_id) where a.owner_id=auth.uid() order by s.paid_until desc nulls last limit 1),'unpaid'),
  'paid_until', (select max(s.paid_until) from public.billing_subscriptions s join public.billing_accounts a using(stripe_customer_id) where a.owner_id=auth.uid() and s.status='active'))
 where auth.uid() is not null;
$$;
revoke all on function private.nutridex_billing_status() from public, anon;
grant execute on function private.nutridex_billing_status() to authenticated;
create or replace function public.nutridex_billing_status() returns jsonb
language sql stable security invoker set search_path = '' as $$ select private.nutridex_billing_status(); $$;
revoke all on function public.nutridex_billing_status() from public, anon;
grant execute on function public.nutridex_billing_status() to authenticated;

create or replace function private.nutridex_begin_checkout() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare result jsonb; attempt_id uuid;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 result := public.nutridex_billing_status();
 if (result->>'active')::boolean or (result->>'blocked')::boolean then return result; end if;
 insert into private.billing_checkout_attempts(owner_id) values(auth.uid())
 on conflict(owner_id) do update set
 attempt=case when private.billing_checkout_attempts.created_at < now()-interval '24 hours' then gen_random_uuid() else private.billing_checkout_attempts.attempt end,
 created_at=case when private.billing_checkout_attempts.created_at < now()-interval '24 hours' then now() else private.billing_checkout_attempts.created_at end
 returning attempt into attempt_id;
 return result || jsonb_build_object('attempt',attempt_id);
end;
$$;
revoke all on function private.nutridex_begin_checkout() from public, anon;
grant execute on function private.nutridex_begin_checkout() to authenticated;
create or replace function public.nutridex_begin_checkout() returns jsonb
language sql security invoker set search_path = '' as $$ select private.nutridex_begin_checkout(); $$;
revoke all on function public.nutridex_begin_checkout() from public, anon;
grant execute on function public.nutridex_begin_checkout() to authenticated;

-- This RPC is intentionally service_role only; application users cannot grant access.
create or replace function public.nutridex_sync_subscription(p_customer text, p_subscription text, p_status text, p_paid_until timestamptz, p_cancel_at_period_end boolean, p_observed_at timestamptz)
returns void language sql security invoker set search_path = '' as $$
 insert into public.billing_subscriptions(stripe_subscription_id,stripe_customer_id,status,paid_until,cancel_at_period_end,observed_at)
 values(p_subscription,p_customer,p_status,p_paid_until,p_cancel_at_period_end,p_observed_at)
 on conflict(stripe_subscription_id) do update set status=excluded.status,paid_until=excluded.paid_until,
 cancel_at_period_end=excluded.cancel_at_period_end, observed_at=excluded.observed_at, updated_at=now()
 where excluded.observed_at >= public.billing_subscriptions.observed_at;
$$;
revoke all on function public.nutridex_sync_subscription(text,text,text,timestamptz,boolean,timestamptz) from public, anon, authenticated;
grant execute on function public.nutridex_sync_subscription(text,text,text,timestamptz,boolean,timestamptz) to service_role;
create or replace function public.nutridex_hold_billing(p_customer text,p_event text,p_reason text)
returns void language sql security invoker set search_path = '' as $$
 update public.billing_accounts set blocked=true,hold_reason=p_reason,hold_event=p_event where stripe_customer_id=p_customer;
$$;
revoke all on function public.nutridex_hold_billing(text,text,text) from public, anon, authenticated;
grant execute on function public.nutridex_hold_billing(text,text,text) to service_role;

-- Restrictive policies combine with existing ownership checks (AND, never OR).
do $$
declare t text;
begin
 foreach t in array array['patients','appointments','clinical_notes','exams','photos','payments','anthropometry_records','body_measures','meal_plans','meal_plan_items','anamneses','clinic_settings','foods','audit_logs'] loop
  execute format('drop policy if exists nutridex_paid_access on public.%I',t);
  execute format('create policy nutridex_paid_access on public.%I as restrictive for all to authenticated using ((select private.nutridex_has_access())) with check ((select private.nutridex_has_access()))',t);
 end loop;
end;
$$;
drop policy if exists nutridex_paid_photos on storage.objects;
create policy nutridex_paid_photos on storage.objects as restrictive for all to authenticated
using(bucket_id <> 'patient-photos' or (select private.nutridex_has_access()))
with check(bucket_id <> 'patient-photos' or (select private.nutridex_has_access()));
notify pgrst, 'reload schema';
commit;
