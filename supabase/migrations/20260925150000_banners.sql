-- Category banners for suppliers and brands (materials, tools, equipment):
-- one advertiser per service at a time, shown next to that service's results
-- in every town and on the service page. Built from a template (title, text,
-- logo, colour, link), so advertisers don't need a designer. Admins manage
-- them; clicks are counted through /r/banner/{id}.

create table public.banners (
  id uuid primary key default gen_random_uuid(),
  service_id integer not null references public.services (id) on delete cascade,
  advertiser text not null check (char_length(advertiser) between 2 and 80),
  title text not null check (char_length(title) between 2 and 60),
  body text check (char_length(body) <= 140),
  cta text check (char_length(cta) <= 30),
  link_url text not null check (link_url ~ '^https?://'),
  -- Hex colour of the card, e.g. #ea6a1f.
  color text not null default '#1f4b9e' check (color ~ '^#[0-9a-fA-F]{6}$'),
  logo_path text,
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  status public.sponsorship_status not null default 'active',
  payment_ref text,
  clicks integer not null default 0,
  created_at timestamptz not null default now(),
  constraint banners_period check (ends_at > starts_at)
);

create index banners_lookup_idx on public.banners (service_id) where status = 'active';

alter table public.banners enable row level security;

create policy "Banners: public reads running ones" on public.banners for select
  using ((status = 'active' and now() between starts_at and ends_at) or public.is_admin());
create policy "Banners: admin writes" on public.banners for all
  using (public.is_admin()) with check (public.is_admin());

-- Click counter, called by the redirect route with the service role.
create or replace function public.track_banner_click(p_banner_id uuid)
returns text
language sql
security definer
set search_path = ''
as $$
  update public.banners set clicks = clicks + 1
  where id = p_banner_id and status = 'active' and now() between starts_at and ends_at
  returning link_url
$$;

revoke execute on function public.track_banner_click(uuid) from public, anon, authenticated;

-- Logos: public bucket, admins upload.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'banners',
  'banners',
  true,
  2097152, -- 2 MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
on conflict (id) do nothing;

create policy "Banner logos: admin uploads" on storage.objects for insert to authenticated
  with check (bucket_id = 'banners' and public.is_admin());
create policy "Banner logos: admin deletes" on storage.objects for delete to authenticated
  using (bucket_id = 'banners' and public.is_admin());
