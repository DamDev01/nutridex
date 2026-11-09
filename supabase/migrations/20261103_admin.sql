begin;
create table if not exists private.nutridex_admins (user_id uuid primary key references auth.users(id));
alter table private.nutridex_admins enable row level security;
revoke all on private.nutridex_admins from public,anon,authenticated;
insert into private.nutridex_admins(user_id) select u.id from auth.users u where lower(u.email)='damfenixhair@gmail.com' and u.email_confirmed_at is not null and exists(select 1 from auth.identities i where i.user_id=u.id and i.provider='google') on conflict do nothing;
create table if not exists private.nutridex_user_access (
 email text primary key, blocked boolean not null default false, archived boolean not null default false,
 trial_until timestamptz, updated_at timestamptz not null default now()
);
create table if not exists private.nutridex_admin_log (id bigint generated always as identity primary key, actor uuid not null, action text not null, email text not null, at timestamptz not null default now());
alter table private.nutridex_user_access enable row level security;
alter table private.nutridex_admin_log enable row level security;
revoke all on private.nutridex_user_access,private.nutridex_admin_log from public,anon,authenticated;
create or replace function private.nutridex_is_admin() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from private.nutridex_admins a join auth.users u on u.id=a.user_id where a.user_id=auth.uid() and u.deleted_at is null and (u.banned_until is null or u.banned_until<now()) and exists(select 1 from auth.identities i where i.user_id=u.id and i.provider='google'));
$$;
revoke all on function private.nutridex_is_admin() from public,anon;
grant execute on function private.nutridex_is_admin() to authenticated;
create or replace function public.nutridex_is_admin() returns boolean language sql stable security invoker set search_path='' as $$ select private.nutridex_is_admin(); $$;
revoke all on function public.nutridex_is_admin() from public,anon;
grant execute on function public.nutridex_is_admin() to authenticated;
create or replace function private.nutridex_has_access() returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and not exists(select 1 from private.nutridex_user_access x join auth.users u on lower(u.email)=x.email where u.id=auth.uid() and (x.blocked or x.archived)) and (
 private.nutridex_is_admin() or exists(select 1 from private.nutridex_user_access x join auth.users u on lower(u.email)=x.email where u.id=auth.uid() and x.trial_until>now() and u.email_confirmed_at is not null)
 or exists(select 1 from public.billing_accounts a join public.billing_subscriptions s using(stripe_customer_id) where a.owner_id=auth.uid() and not a.blocked and s.status='active' and s.paid_until>now()));
$$;
create or replace function private.nutridex_admin_users() returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not private.nutridex_is_admin() then raise insufficient_privilege using message='Acesso administrativo necessário'; end if;
 return (select coalesce(jsonb_agg(jsonb_build_object('email',v.email,'registered',v.registered,'created_at',v.created_at,'blocked',v.blocked,'archived',v.archived,'trial_until',v.trial_until,'paid_until',v.paid_until,'is_admin',v.is_admin) order by v.created_at desc nulls last),'[]') from (
 select coalesce(lower(u.email),x.email) email,u.id is not null registered,u.created_at,coalesce(x.blocked,false) or coalesce(a.blocked,false) blocked,coalesce(x.archived,false) archived,x.trial_until,
 (select max(s.paid_until) from public.billing_subscriptions s where s.stripe_customer_id=a.stripe_customer_id and s.status='active') paid_until,
 exists(select 1 from private.nutridex_admins ad where ad.user_id=u.id) is_admin
 from auth.users u full join private.nutridex_user_access x on x.email=lower(u.email) left join public.billing_accounts a on a.owner_id=u.id where u.deleted_at is null) v);
end;
$$;
create or replace function public.nutridex_admin_users() returns jsonb language sql stable security invoker set search_path='' as $$ select private.nutridex_admin_users(); $$;
create or replace function private.nutridex_admin_change(p_email text,p_action text,p_days integer default 7) returns void language plpgsql security definer set search_path='' as $$
declare e text=lower(trim(p_email));
begin
 if not private.nutridex_is_admin() then raise insufficient_privilege using message='Acesso administrativo necessário'; end if;
 if e !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' or length(e)>254 then raise exception 'E-mail inválido'; end if;
 if exists(select 1 from private.nutridex_admins a join auth.users u on u.id=a.user_id where lower(u.email)=e) then raise exception 'A conta administradora está protegida'; end if;
 if p_action not in ('block','unblock','trial','revoke_trial','archive','restore') then raise exception 'Operação inválida'; end if;
 if p_action='trial' and (p_days is null or p_days<1 or p_days>90) then raise exception 'O teste deve ter de 1 a 90 dias'; end if;
 insert into private.nutridex_user_access(email) values(e) on conflict do nothing;
 update private.nutridex_user_access set blocked=case when p_action='block' then true when p_action='unblock' then false else blocked end,
 archived=case when p_action='archive' then true when p_action='restore' then false else archived end,
 trial_until=case when p_action='trial' then now()+make_interval(days=>p_days) when p_action='revoke_trial' then null else trial_until end,updated_at=now() where email=e;
 insert into private.nutridex_admin_log(actor,action,email) values(auth.uid(),p_action,e);
end;
$$;
create or replace function public.nutridex_admin_change(p_email text,p_action text,p_days integer default 7) returns void language sql security invoker set search_path='' as $$ select private.nutridex_admin_change(p_email,p_action,p_days); $$;
revoke all on function private.nutridex_admin_users(),public.nutridex_admin_users(),private.nutridex_admin_change(text,text,integer),public.nutridex_admin_change(text,text,integer) from public,anon;
grant execute on function private.nutridex_admin_users(),public.nutridex_admin_users(),private.nutridex_admin_change(text,text,integer),public.nutridex_admin_change(text,text,integer) to authenticated;
notify pgrst,'reload schema';
commit;

-- Keep checkout consistent with administrative blocks and trial access.
create or replace function private.nutridex_billing_status() returns jsonb
language sql stable security definer set search_path='' as $$
 select jsonb_build_object('active',private.nutridex_has_access(),
 'blocked',coalesce((select x.blocked or x.archived from private.nutridex_user_access x join auth.users u on lower(u.email)=x.email where u.id=auth.uid()),false) or coalesce((select a.blocked from public.billing_accounts a where a.owner_id=auth.uid()),false),
 'status',case when private.nutridex_is_admin() then 'admin' when exists(select 1 from private.nutridex_user_access x join auth.users u on lower(u.email)=x.email where u.id=auth.uid() and x.trial_until>now()) then 'trial' else coalesce((select s.status from public.billing_subscriptions s join public.billing_accounts a using(stripe_customer_id) where a.owner_id=auth.uid() order by s.paid_until desc nulls last limit 1),'unpaid') end,
 'paid_until',(select max(s.paid_until) from public.billing_subscriptions s join public.billing_accounts a using(stripe_customer_id) where a.owner_id=auth.uid() and s.status='active'),
 'trial_until',(select x.trial_until from private.nutridex_user_access x join auth.users u on lower(u.email)=x.email where u.id=auth.uid())) where auth.uid() is not null;
$$;
notify pgrst,'reload schema';
