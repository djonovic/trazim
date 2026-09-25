-- Public bucket for business photos. Objects live under "{business_id}/{file}".

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'business-photos',
  'business-photos',
  true,
  10485760, -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic']
)
on conflict (id) do nothing;

create or replace function public.storage_business_id(object_name text)
returns uuid
language plpgsql
stable
set search_path = ''
as $$
begin
  return (storage.foldername(object_name))[1]::uuid;
exception
  when invalid_text_representation then return null;
end;
$$;

create policy "Business photos: owner uploads" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'business-photos'
    and (public.owns_business(public.storage_business_id(name)) or public.is_admin())
  );

create policy "Business photos: owner updates" on storage.objects for update to authenticated
  using (
    bucket_id = 'business-photos'
    and (public.owns_business(public.storage_business_id(name)) or public.is_admin())
  );

create policy "Business photos: owner deletes" on storage.objects for delete to authenticated
  using (
    bucket_id = 'business-photos'
    and (public.owns_business(public.storage_business_id(name)) or public.is_admin())
  );
