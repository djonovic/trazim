-- Tražim core schema: taxonomy (regions, cities, services), businesses,
-- reviews, reports, analytics, sponsorships, inquiries.

create extension if not exists pg_trgm with schema extensions;
create extension if not exists unaccent with schema extensions;

-- unaccent() is STABLE, so it can't be used in an index directly.
create or replace function public.immutable_unaccent(text)
returns text
language sql
immutable
parallel safe
strict
set search_path = ''
as $$
  select extensions.unaccent('extensions.unaccent'::regdictionary, $1)
$$;

-- Normalises text for search: lowercase, no diacritics, đ → dj.
create or replace function public.search_normalize(text)
returns text
language sql
immutable
parallel safe
strict
set search_path = ''
as $$
  select lower(public.immutable_unaccent(replace(replace($1, 'đ', 'dj'), 'Đ', 'Dj')))
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.user_role as enum ('user', 'business', 'admin');
create type public.business_status as enum ('pending', 'active', 'rejected', 'suspended');
create type public.response_time_bucket as enum ('minutes', 'hour', 'hours', 'day');
create type public.price_unit as enum ('hour', 'm2', 'piece', 'job', 'session', 'day', 'month');
create type public.price_kind as enum ('fixed', 'from', 'range', 'on_request', 'free');
create type public.review_status as enum ('published', 'hidden', 'removed');
create type public.report_target as enum ('business', 'review');
create type public.report_reason as enum ('inappropriate', 'abusive', 'false_info', 'spam', 'other');
create type public.report_status as enum ('open', 'resolved', 'dismissed');
create type public.contact_kind as enum ('phone', 'viber', 'whatsapp', 'email', 'website', 'instagram');
create type public.sponsorship_scope as enum ('home', 'service', 'city', 'service_city');
create type public.sponsorship_status as enum ('active', 'paused', 'expired', 'cancelled');
create type public.inquiry_status as enum ('pending', 'approved', 'rejected', 'closed', 'expired');

-- ---------------------------------------------------------------------------
-- Profiles and roles
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where id = (select auth.uid()) and role = 'admin'
  )
$$;

-- Users can't promote themselves; only admins (or the service role) change roles.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
     and (select auth.uid()) is not null
     and not public.is_admin() then
    raise exception 'Only admins can change roles';
  end if;
  return new;
end;
$$;

create trigger profiles_protect_role before update on public.profiles
  for each row execute function public.protect_profile_role();

-- ---------------------------------------------------------------------------
-- Taxonomy: regions, cities, service groups, services
-- ---------------------------------------------------------------------------

create table public.regions (
  id smallint generated always as identity primary key,
  slug text not null unique,
  name_me text not null,
  name_en text not null,
  name_ru text not null,
  sort_order smallint not null default 0
);

create table public.cities (
  id integer generated always as identity primary key,
  slug text not null unique,
  name_me text not null,
  name_en text not null,
  name_ru text not null,
  -- Full phrase with preposition: "u Podgorici", "na Cetinju".
  name_locative_me text not null,
  region_id smallint not null references public.regions (id),
  -- Settlements (Bečići, Igalo…) point to their municipality.
  parent_city_id integer references public.cities (id),
  lat double precision,
  lng double precision,
  population integer,
  created_at timestamptz not null default now()
);

create index cities_region_id_idx on public.cities (region_id);
create index cities_parent_city_id_idx on public.cities (parent_city_id);

create table public.service_groups (
  id smallint generated always as identity primary key,
  slug text not null unique,
  name_me text not null,
  name_en text not null,
  name_ru text not null,
  icon text,
  sort_order smallint not null default 0
);

create table public.services (
  id integer generated always as identity primary key,
  group_id smallint not null references public.service_groups (id),
  slug_me text not null unique,
  slug_en text not null unique,
  slug_ru text not null unique,
  name_me text not null,
  name_en text not null,
  name_ru text not null,
  -- Genitive plural for "{N} električara u Podgorici"; null → "profila".
  plural_gen_me text,
  description_me text,
  description_en text,
  description_ru text,
  -- [{ "q": "...", "a": "..." }]
  faq_me jsonb not null default '[]',
  faq_en jsonb not null default '[]',
  faq_ru jsonb not null default '[]',
  -- ["tip", ...] for "Kako izabrati"
  tips_me jsonb not null default '[]',
  tips_en jsonb not null default '[]',
  tips_ru jsonb not null default '[]',
  -- schema.org LocalBusiness subtype (Electrician, Plumber…); null → LocalBusiness.
  schema_type text,
  price_unit_default public.price_unit,
  offers_online boolean not null default false,
  sort_order smallint not null default 0,
  search_text text generated always as (
    public.search_normalize(
      name_me || ' ' || name_en || ' ' || name_ru || ' ' || slug_me || ' ' || slug_en || ' ' || slug_ru
    )
  ) stored,
  created_at timestamptz not null default now()
);

create index services_group_id_idx on public.services (group_id);
create index services_search_trgm_idx on public.services using gin (search_text extensions.gin_trgm_ops);

-- Presets for business price lists ("Montaža rasvjete", "Probni čas joge").
create table public.service_price_items (
  id integer generated always as identity primary key,
  service_id integer not null references public.services (id) on delete cascade,
  name_me text not null,
  name_en text not null,
  name_ru text not null,
  unit public.price_unit not null,
  sort_order smallint not null default 0
);

create index service_price_items_service_id_idx on public.service_price_items (service_id);

-- ---------------------------------------------------------------------------
-- Businesses
-- ---------------------------------------------------------------------------

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles (id) on delete set null,
  slug text not null unique,
  name text not null,
  description text,
  phone text,
  viber text,
  whatsapp text,
  email text,
  website text,
  instagram text,
  address text,
  -- Main city; the full service area is in business_cities.
  city_id integer not null references public.cities (id),
  lat double precision,
  lng double precision,
  -- New profiles are 'active' right away; moderated_at null shows "Na provjeri".
  status public.business_status not null default 'active',
  moderated_at timestamptz,
  -- "Provjeren" badge: admin checked PIB/CRPS and the phone number.
  verified_at timestamptz,
  offers_online boolean not null default false,
  emergency_24h boolean not null default false,
  languages text[] not null default '{sr-Latn-ME}',
  response_time_bucket public.response_time_bucket,
  views_count integer not null default 0,
  rating_avg numeric(2, 1) not null default 0,
  rating_count integer not null default 0,
  search_text text generated always as (
    public.search_normalize(name || ' ' || coalesce(description, ''))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint businesses_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

create index businesses_owner_id_idx on public.businesses (owner_id);
create index businesses_city_id_idx on public.businesses (city_id);
create index businesses_status_idx on public.businesses (status);
create index businesses_search_trgm_idx on public.businesses using gin (search_text extensions.gin_trgm_ops);

create trigger businesses_updated_at before update on public.businesses
  for each row execute function public.set_updated_at();

create table public.business_services (
  business_id uuid not null references public.businesses (id) on delete cascade,
  service_id integer not null references public.services (id) on delete cascade,
  is_primary boolean not null default false,
  primary key (business_id, service_id)
);

create index business_services_service_id_idx on public.business_services (service_id);

-- At most 3 primary services per business.
create or replace function public.check_primary_services()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.is_primary and (
    select count(*) from public.business_services
    where business_id = new.business_id and is_primary and service_id <> new.service_id
  ) >= 3 then
    raise exception 'A business can have at most 3 primary services';
  end if;
  return new;
end;
$$;

create trigger business_services_primary_limit before insert or update on public.business_services
  for each row execute function public.check_primary_services();

-- Service area (zona rada): every city the business covers.
create table public.business_cities (
  business_id uuid not null references public.businesses (id) on delete cascade,
  city_id integer not null references public.cities (id) on delete cascade,
  primary key (business_id, city_id)
);

create index business_cities_city_id_idx on public.business_cities (city_id);

create table public.business_hours (
  business_id uuid not null references public.businesses (id) on delete cascade,
  -- ISO weekday: 1 = Monday … 7 = Sunday
  weekday smallint not null check (weekday between 1 and 7),
  opens_at time not null,
  closes_at time not null,
  primary key (business_id, weekday, opens_at)
);

create table public.business_photos (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  storage_path text not null,
  width integer,
  height integer,
  is_cover boolean not null default false,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now()
);

create index business_photos_business_id_idx on public.business_photos (business_id, sort_order);
create unique index business_photos_one_cover_idx on public.business_photos (business_id) where is_cover;

create table public.price_list_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  service_id integer references public.services (id) on delete set null,
  -- Set when the item was picked from service_price_items; feeds per-item price stats.
  preset_id integer references public.service_price_items (id) on delete set null,
  name text not null,
  kind public.price_kind not null default 'fixed',
  price_from numeric(10, 2),
  price_to numeric(10, 2),
  unit public.price_unit not null default 'job',
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  constraint price_list_items_prices check (
    case kind
      when 'fixed' then price_from is not null and price_to is null
      when 'from' then price_from is not null and price_to is null
      when 'range' then price_from is not null and price_to is not null and price_to >= price_from
      else price_from is null and price_to is null
    end
  )
);

create index price_list_items_business_id_idx on public.price_list_items (business_id, sort_order);
create index price_list_items_service_id_idx on public.price_list_items (service_id);
create index price_list_items_preset_id_idx on public.price_list_items (preset_id);

-- ---------------------------------------------------------------------------
-- Reviews and reports
-- ---------------------------------------------------------------------------

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  body text check (char_length(body) <= 2000),
  status public.review_status not null default 'published',
  edited_at timestamptz,
  reply_body text check (char_length(reply_body) <= 2000),
  replied_at timestamptz,
  created_at timestamptz not null default now(),
  unique (business_id, user_id)
);

create index reviews_business_id_idx on public.reviews (business_id, created_at desc);
create index reviews_created_at_idx on public.reviews (created_at desc) where status = 'published';

create or replace function public.check_review_not_owner()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if exists (
    select 1 from public.businesses where id = new.business_id and owner_id = new.user_id
  ) then
    raise exception 'Owners cannot review their own business';
  end if;
  return new;
end;
$$;

create trigger reviews_not_owner before insert on public.reviews
  for each row execute function public.check_review_not_owner();

-- Keeps review edits and owner replies apart: the author edits rating/body,
-- the owner edits only the reply.
create or replace function public.guard_review_update()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
begin
  if uid is null or public.is_admin() then
    return new;
  end if;

  if uid = old.user_id then
    if new.reply_body is distinct from old.reply_body or new.status is distinct from old.status then
      raise exception 'Authors can only edit rating and text';
    end if;
    if new.rating is distinct from old.rating or new.body is distinct from old.body then
      new.edited_at = now();
    end if;
  else
    -- Business owner replying.
    if new.rating is distinct from old.rating or new.body is distinct from old.body
       or new.status is distinct from old.status then
      raise exception 'Owners can only reply to reviews';
    end if;
    if new.reply_body is distinct from old.reply_body then
      new.replied_at = now();
    end if;
  end if;

  new.business_id = old.business_id;
  new.user_id = old.user_id;
  return new;
end;
$$;

create trigger reviews_guard_update before update on public.reviews
  for each row execute function public.guard_review_update();

create or replace function public.refresh_business_rating()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target uuid := coalesce(new.business_id, old.business_id);
begin
  update public.businesses b
  set rating_avg = coalesce(s.avg, 0),
      rating_count = coalesce(s.cnt, 0)
  from (
    select round(avg(rating)::numeric, 1) as avg, count(*)::integer as cnt
    from public.reviews
    where business_id = target and status = 'published'
  ) s
  where b.id = target;
  return null;
end;
$$;

create trigger reviews_refresh_rating after insert or update or delete on public.reviews
  for each row execute function public.refresh_business_rating();

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles (id) on delete set null,
  target public.report_target not null,
  business_id uuid references public.businesses (id) on delete cascade,
  review_id uuid references public.reviews (id) on delete cascade,
  reason public.report_reason not null,
  details text check (char_length(details) <= 1000),
  status public.report_status not null default 'open',
  resolved_by uuid references public.profiles (id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  constraint reports_target_matches check (
    (target = 'business' and business_id is not null and review_id is null)
    or (target = 'review' and review_id is not null)
  )
);

create index reports_status_idx on public.reports (status, created_at desc);

-- ---------------------------------------------------------------------------
-- Analytics (aggregated per day; raw events never leave the database)
-- ---------------------------------------------------------------------------

create table public.business_daily_stats (
  business_id uuid not null references public.businesses (id) on delete cascade,
  day date not null,
  views integer not null default 0,
  contact_phone integer not null default 0,
  contact_viber integer not null default 0,
  contact_whatsapp integer not null default 0,
  contact_email integer not null default 0,
  contact_website integer not null default 0,
  contact_instagram integer not null default 0,
  primary key (business_id, day)
);

-- Called from the server (service role) on profile view.
create or replace function public.track_business_view(p_business_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.business_daily_stats (business_id, day, views)
  values (p_business_id, (now() at time zone 'Europe/Podgorica')::date, 1)
  on conflict (business_id, day) do update set views = public.business_daily_stats.views + 1;

  update public.businesses set views_count = views_count + 1 where id = p_business_id;
$$;

-- Called from the server when a contact button is clicked; returns nothing,
-- the caller reveals the number after this succeeds.
create or replace function public.track_business_contact(p_business_id uuid, p_kind public.contact_kind)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  execute format(
    'insert into public.business_daily_stats (business_id, day, %1$I) values ($1, $2, 1)
     on conflict (business_id, day) do update set %1$I = public.business_daily_stats.%1$I + 1',
    'contact_' || p_kind::text
  ) using p_business_id, (now() at time zone 'Europe/Podgorica')::date;
end;
$$;

revoke execute on function public.track_business_view(uuid) from public, anon, authenticated;
revoke execute on function public.track_business_contact(uuid, public.contact_kind) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Sponsorships (filled manually by admins now, by the Stripe webhook later)
-- ---------------------------------------------------------------------------

create table public.sponsorships (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  scope public.sponsorship_scope not null,
  service_id integer references public.services (id) on delete cascade,
  city_id integer references public.cities (id) on delete cascade,
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  status public.sponsorship_status not null default 'active',
  -- Stripe subscription / checkout session id, or a note for manual deals.
  payment_ref text,
  created_at timestamptz not null default now(),
  constraint sponsorships_scope_fields check (
    case scope
      when 'home' then service_id is null and city_id is null
      when 'service' then service_id is not null and city_id is null
      when 'city' then service_id is null and city_id is not null
      when 'service_city' then service_id is not null and city_id is not null
    end
  ),
  constraint sponsorships_period check (ends_at > starts_at)
);

create index sponsorships_lookup_idx on public.sponsorships (scope, service_id, city_id)
  where status = 'active';
create index sponsorships_business_id_idx on public.sponsorships (business_id);

-- ---------------------------------------------------------------------------
-- Inquiries ("Pošalji upit"): schema only, no UI in v1
-- ---------------------------------------------------------------------------

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  service_id integer not null references public.services (id),
  city_id integer not null references public.cities (id),
  body text not null check (char_length(body) between 20 and 4000),
  answers jsonb not null default '{}',
  urgent boolean not null default false,
  status public.inquiry_status not null default 'pending',
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

create index inquiries_user_id_idx on public.inquiries (user_id);
create index inquiries_service_city_idx on public.inquiries (service_id, city_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.regions enable row level security;
alter table public.cities enable row level security;
alter table public.service_groups enable row level security;
alter table public.services enable row level security;
alter table public.service_price_items enable row level security;
alter table public.businesses enable row level security;
alter table public.business_services enable row level security;
alter table public.business_cities enable row level security;
alter table public.business_hours enable row level security;
alter table public.business_photos enable row level security;
alter table public.price_list_items enable row level security;
alter table public.reviews enable row level security;
alter table public.reports enable row level security;
alter table public.business_daily_stats enable row level security;
alter table public.sponsorships enable row level security;
alter table public.inquiries enable row level security;

-- Helper: is the current user the owner of this business?
create or replace function public.owns_business(p_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.businesses where id = p_business_id and owner_id = (select auth.uid())
  )
$$;

-- Helper: is the business publicly visible (active)?
create or replace function public.is_business_public(p_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.businesses where id = p_business_id and status = 'active')
$$;

-- Profiles
create policy "Profiles: read own or admin" on public.profiles for select
  using ((select auth.uid()) = id or public.is_admin());
create policy "Profiles: update own" on public.profiles for update
  using ((select auth.uid()) = id or public.is_admin())
  with check ((select auth.uid()) = id or public.is_admin());

-- Taxonomy: public read, admin write
create policy "Regions: public read" on public.regions for select using (true);
create policy "Regions: admin write" on public.regions for all using (public.is_admin()) with check (public.is_admin());
create policy "Cities: public read" on public.cities for select using (true);
create policy "Cities: admin write" on public.cities for all using (public.is_admin()) with check (public.is_admin());
create policy "Service groups: public read" on public.service_groups for select using (true);
create policy "Service groups: admin write" on public.service_groups for all using (public.is_admin()) with check (public.is_admin());
create policy "Services: public read" on public.services for select using (true);
create policy "Services: admin write" on public.services for all using (public.is_admin()) with check (public.is_admin());
create policy "Price presets: public read" on public.service_price_items for select using (true);
create policy "Price presets: admin write" on public.service_price_items for all using (public.is_admin()) with check (public.is_admin());

-- Businesses: anyone sees active ones; owners see and edit their own.
create policy "Businesses: read active, own or admin" on public.businesses for select
  using (status = 'active' or owner_id = (select auth.uid()) or public.is_admin());
create policy "Businesses: owner creates" on public.businesses for insert to authenticated
  with check (
    owner_id = (select auth.uid())
    and status = 'active'
    and moderated_at is null
    and verified_at is null
  );
create policy "Businesses: owner or admin updates" on public.businesses for update
  using (owner_id = (select auth.uid()) or public.is_admin())
  with check (owner_id = (select auth.uid()) or public.is_admin());
create policy "Businesses: admin deletes" on public.businesses for delete using (public.is_admin());

-- Owners can't change moderation fields or counters on their own business.
create or replace function public.guard_business_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- Nested calls come from our own triggers (rating refresh), not from the owner.
  if pg_trigger_depth() > 1 or (select auth.uid()) is null or public.is_admin() then
    return new;
  end if;
  new.status = old.status;
  new.moderated_at = old.moderated_at;
  new.verified_at = old.verified_at;
  new.owner_id = old.owner_id;
  new.views_count = old.views_count;
  new.rating_avg = old.rating_avg;
  new.rating_count = old.rating_count;
  new.response_time_bucket = old.response_time_bucket;
  return new;
end;
$$;

create trigger businesses_guard_update before update on public.businesses
  for each row execute function public.guard_business_update();

-- Child tables of a business: public read when the business is public,
-- full access for the owner and admins.
create policy "Business services: read" on public.business_services for select
  using (public.is_business_public(business_id) or public.owns_business(business_id) or public.is_admin());
create policy "Business services: owner writes" on public.business_services for all
  using (public.owns_business(business_id) or public.is_admin())
  with check (public.owns_business(business_id) or public.is_admin());

create policy "Business cities: read" on public.business_cities for select
  using (public.is_business_public(business_id) or public.owns_business(business_id) or public.is_admin());
create policy "Business cities: owner writes" on public.business_cities for all
  using (public.owns_business(business_id) or public.is_admin())
  with check (public.owns_business(business_id) or public.is_admin());

create policy "Business hours: read" on public.business_hours for select
  using (public.is_business_public(business_id) or public.owns_business(business_id) or public.is_admin());
create policy "Business hours: owner writes" on public.business_hours for all
  using (public.owns_business(business_id) or public.is_admin())
  with check (public.owns_business(business_id) or public.is_admin());

create policy "Business photos: read" on public.business_photos for select
  using (public.is_business_public(business_id) or public.owns_business(business_id) or public.is_admin());
create policy "Business photos: owner writes" on public.business_photos for all
  using (public.owns_business(business_id) or public.is_admin())
  with check (public.owns_business(business_id) or public.is_admin());

create policy "Price list: read" on public.price_list_items for select
  using (public.is_business_public(business_id) or public.owns_business(business_id) or public.is_admin());
create policy "Price list: owner writes" on public.price_list_items for all
  using (public.owns_business(business_id) or public.is_admin())
  with check (public.owns_business(business_id) or public.is_admin());

-- Reviews: published reviews of public businesses are public.
create policy "Reviews: read" on public.reviews for select
  using (
    (status = 'published' and public.is_business_public(business_id))
    or user_id = (select auth.uid())
    or public.owns_business(business_id)
    or public.is_admin()
  );
create policy "Reviews: user creates" on public.reviews for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'published'
    and reply_body is null
    and public.is_business_public(business_id)
  );
-- Author edits own review; owner replies (column rules in guard_review_update).
create policy "Reviews: author or owner updates" on public.reviews for update to authenticated
  using (user_id = (select auth.uid()) or public.owns_business(business_id) or public.is_admin())
  with check (user_id = (select auth.uid()) or public.owns_business(business_id) or public.is_admin());
create policy "Reviews: author or admin deletes" on public.reviews for delete to authenticated
  using (user_id = (select auth.uid()) or public.is_admin());

-- Reports: anyone logged in can file; only admins read and resolve.
create policy "Reports: user creates" on public.reports for insert to authenticated
  with check (reporter_id = (select auth.uid()) and status = 'open');
create policy "Reports: admin reads" on public.reports for select using (public.is_admin());
create policy "Reports: admin updates" on public.reports for update using (public.is_admin()) with check (public.is_admin());

-- Stats: owner and admin read; writes only through security definer functions.
create policy "Stats: owner reads" on public.business_daily_stats for select
  using (public.owns_business(business_id) or public.is_admin());

-- Sponsorships: active ones are public (to render "Sponzorisano"); admin writes.
create policy "Sponsorships: read" on public.sponsorships for select
  using (
    (status = 'active' and now() between starts_at and ends_at and public.is_business_public(business_id))
    or public.owns_business(business_id)
    or public.is_admin()
  );
create policy "Sponsorships: admin writes" on public.sponsorships for all
  using (public.is_admin()) with check (public.is_admin());

-- Inquiries: the author and admins.
create policy "Inquiries: author reads" on public.inquiries for select
  using (user_id = (select auth.uid()) or public.is_admin());
create policy "Inquiries: author creates" on public.inquiries for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'pending');
-- Authors can only close their inquiry; moderation is for admins.
create policy "Inquiries: author closes, admin moderates" on public.inquiries for update
  using (user_id = (select auth.uid()) or public.is_admin())
  with check (public.is_admin() or (user_id = (select auth.uid()) and status in ('pending', 'closed')));
