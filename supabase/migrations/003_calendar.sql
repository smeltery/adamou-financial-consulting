create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  title text not null check (length(trim(title)) between 1 and 200),
  starts_at timestamptz not null check (isfinite(starts_at)),
  ends_at timestamptz not null check (isfinite(ends_at) and ends_at > starts_at),
  status text not null default 'tentative' check (status in ('tentative','confirmed','completed','cancelled')),
  location text not null default '' check (length(location) <= 500),
  updated_at timestamptz not null default clock_timestamp()
);
create index meetings_starts_at on public.meetings(starts_at);
create index meetings_client_id on public.meetings(client_id);
create function public.touch_meeting() returns trigger language plpgsql set search_path = '' as $$
begin
  NEW.updated_at = clock_timestamp();
  return NEW;
end;
$$;
create trigger meeting_dates before update on public.meetings for each row execute function public.touch_meeting();
alter table public.meetings enable row level security;
revoke all on public.meetings from anon, authenticated;
grant select, insert, update, delete on public.meetings to authenticated;
create policy owner_meetings on public.meetings to authenticated
  using ((select public.is_owner())) with check ((select public.is_owner()));
