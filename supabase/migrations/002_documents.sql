-- Files stay in a private bucket; Storage is the source of truth for the list.
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('client-documents', 'client-documents', false, 20971520,
  array['application/pdf','image/png','image/jpeg','image/webp','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create function public.can_access_document(object_name text) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.is_owner()
    and object_name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}_[^/]+$'
    and exists(select 1 from public.clients where id::text = split_part(object_name, '/', 1));
$$;
revoke all on function public.can_access_document(text) from public;
grant execute on function public.can_access_document(text) to authenticated;

create policy owner_document_read on storage.objects for select to authenticated
using (bucket_id = 'client-documents' and public.can_access_document(name));
create policy owner_document_upload on storage.objects for insert to authenticated
with check (bucket_id = 'client-documents' and public.can_access_document(name));
create policy owner_document_delete on storage.objects for delete to authenticated
using (bucket_id = 'client-documents' and public.can_access_document(name));
-- No update policy: a new upload never overwrites a signed original.

create function public.require_document_cleanup() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if exists(select 1 from storage.objects
    where bucket_id = 'client-documents' and split_part(name, '/', 1) = OLD.id::text) then
    raise exception 'Remove client documents through Storage before deleting the client';
  end if;
  return OLD;
end;
$$;
create trigger client_document_cleanup before delete on public.clients
for each row execute function public.require_document_cleanup();
