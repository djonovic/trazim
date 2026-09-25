-- Photos on reviews (optional, up to 4). Files live in the public
-- "review-photos" bucket under "{review_id}/{file}"; rows are visible where the
-- review is (published reviews of public businesses, the author, the owner, admins).

create table public.review_photos (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews (id) on delete cascade,
  storage_path text not null unique,
  width integer,
  height integer,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now()
);

create index review_photos_review_id_idx on public.review_photos (review_id, sort_order);

alter table public.review_photos enable row level security;

create or replace function public.is_review_author(p_review_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.reviews where id = p_review_id and user_id = (select auth.uid())
  )
$$;

create or replace function public.is_review_visible(p_review_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.reviews r
    where r.id = p_review_id
      and (
        (r.status = 'published' and public.is_business_public(r.business_id))
        or r.user_id = (select auth.uid())
        or public.owns_business(r.business_id)
        or public.is_admin()
      )
  )
$$;

create policy "Review photos: read with the review" on public.review_photos for select
  using (public.is_review_visible(review_id));
create policy "Review photos: author adds" on public.review_photos for insert to authenticated
  with check (public.is_review_author(review_id));
create policy "Review photos: author or admin deletes" on public.review_photos for delete to authenticated
  using (public.is_review_author(review_id) or public.is_admin());

create or replace function public.limit_review_photos()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select count(*) from public.review_photos where review_id = new.review_id) >= 4 then
    raise exception 'too_many_photos';
  end if;
  return new;
end;
$$;

create trigger review_photos_limit before insert on public.review_photos
  for each row execute function public.limit_review_photos();

-- Storage ------------------------------------------------------------------------
-- storage_business_id() just reads the first folder as a uuid; here it's the review id.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'review-photos',
  'review-photos',
  true,
  10485760, -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic']
)
on conflict (id) do nothing;

create policy "Review photos: author uploads" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'review-photos'
    and public.is_review_author(public.storage_business_id(name))
  );

create policy "Review photos: author or admin deletes files" on storage.objects for delete to authenticated
  using (
    bucket_id = 'review-photos'
    and (public.is_review_author(public.storage_business_id(name)) or public.is_admin())
  );
