-- Provision Matt in Supabase Auth first; this table is writable only by operators.
create table public.workspace_owner (
  singleton boolean primary key default true check (singleton),
  user_id uuid not null unique references auth.users(id)
);
alter table public.workspace_owner enable row level security;
revoke all on public.workspace_owner from anon, authenticated;
create function public.is_owner() returns boolean language sql stable security definer
set search_path = '' as $$
  select exists (select 1 from public.workspace_owner where user_id = auth.uid());
$$;
revoke all on function public.is_owner() from public;
grant execute on function public.is_owner() to authenticated;

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 200),
  email text not null check (length(email) between 3 and 320),
  phone text not null default '',
  status text not null default 'inquiry' check (status in ('inquiry','onboarding','active','offboarding','archived')),
  source text not null default 'manual' check (source in ('manual','website')),
  priority text not null default '',
  notes text not null default '',
  next_contact date,
  goals jsonb not null default '[]' check (jsonb_typeof(goals) = 'array'),
  checklist jsonb not null default '[]' check (jsonb_typeof(checklist) = 'array'),
  offboarding_reason text not null default '',
  started_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index clients_email on public.clients (lower(trim(email)));
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  client_id uuid not null references public.clients(id) on delete cascade,
  details jsonb not null,
  received_at timestamptz not null
);
create table public.client_events (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  summary text not null,
  created_at timestamptz not null default now()
);
create function public.track_client() returns trigger language plpgsql security definer
set search_path = '' as $$
begin
  if TG_OP = 'INSERT' then
    if NEW.status = 'active' then NEW.started_at = coalesce(NEW.started_at, now()); end if;
    if NEW.status = 'archived' then NEW.archived_at = coalesce(NEW.archived_at, now()); end if;
  else
    NEW.updated_at = clock_timestamp();
    if NEW.status = 'active' and NEW.started_at is null then NEW.started_at = now(); end if;
    if NEW.status = 'archived' then NEW.archived_at = coalesce(OLD.archived_at, now());
    else NEW.archived_at = null; end if;
  end if;
  return NEW;
end;
$$;
create trigger client_dates before insert or update on public.clients for each row execute function public.track_client();
create function public.log_client() returns trigger language plpgsql security definer
set search_path = '' as $$
begin
  insert into public.client_events(client_id, summary) values (NEW.id,
    case when TG_OP = 'INSERT' then 'Client created · ' || NEW.source
    when OLD.status <> NEW.status then 'Stage changed · ' || OLD.status || ' → ' || NEW.status
    else 'Client details updated' end);
  return NEW;
end;
$$;
create trigger client_history after insert or update on public.clients for each row execute function public.log_client();

alter table public.clients enable row level security;
alter table public.inquiries enable row level security;
alter table public.client_events enable row level security;
revoke all on public.clients, public.inquiries, public.client_events from anon, authenticated;
grant select, insert, update, delete on public.clients to authenticated;
grant select on public.inquiries, public.client_events to authenticated;
create policy owner_clients on public.clients to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy owner_inquiries on public.inquiries for select to authenticated using ((select public.is_owner()));
create policy owner_events on public.client_events for select to authenticated using ((select public.is_owner()));
grant all on public.clients, public.inquiries, public.client_events to service_role;

-- One transaction: retries and repeat inquiries never overwrite Matt's edits.
create function public.receive_inquiry(event_id text, submitted_at timestamptz, payload jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare client uuid;
begin
  perform pg_advisory_xact_lock(hashtextextended(event_id, 0));
  if exists(select 1 from public.inquiries where external_id = event_id) then return; end if;
  insert into public.clients(name, email, phone, priority, source)
  values(payload->>'name', lower(trim(payload->>'email')), coalesce(payload->>'phone',''), coalesce(payload->>'priority',''), 'website')
  on conflict (lower(trim(email))) do nothing returning id into client;
  if client is null then select id into client from public.clients where lower(trim(email)) = lower(trim(payload->>'email')); end if;
  insert into public.inquiries(external_id, client_id, details, received_at) values(event_id, client, payload, submitted_at);
  insert into public.client_events(client_id, summary) values(client, 'Website inquiry received');
end;
$$;
revoke all on function public.receive_inquiry(text,timestamptz,jsonb) from public, anon, authenticated;
grant execute on function public.receive_inquiry(text,timestamptz,jsonb) to service_role;
