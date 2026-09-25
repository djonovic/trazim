-- Post-launch hardening: the limits the app enforces are now also enforced by
-- the database, so they hold for direct API calls too. Admins and the service
-- role (auth.uid() is null) are never limited.

-- ---------------------------------------------------------------------------
-- Businesses: owners can't pre-fill counters or moderation fields on insert,
-- and one account can't create an unlimited number of profiles.
-- ---------------------------------------------------------------------------

create or replace function public.guard_business_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null or public.is_admin() then
    return new;
  end if;
  new.status = 'active';
  new.moderated_at = null;
  new.moderation_note = null;
  new.verified_at = null;
  new.views_count = 0;
  new.rating_avg = 0;
  new.rating_count = 0;
  new.response_time_bucket = null;
  new.source_urls = null;
  new.created_at = now();

  if exists (
    select 1 from public.businesses
    where owner_id = new.owner_id and status in ('rejected', 'suspended')
  ) then
    raise exception 'owner_blocked';
  end if;
  if (select count(*) from public.businesses where owner_id = new.owner_id) >= 5 then
    raise exception 'too_many_businesses';
  end if;
  return new;
end;
$$;

create trigger businesses_guard_insert before insert on public.businesses
  for each row execute function public.guard_business_insert();

-- Imported rows keep their sources; owners can't set them.
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
  new.moderation_note = old.moderation_note;
  new.verified_at = old.verified_at;
  new.owner_id = old.owner_id;
  new.views_count = old.views_count;
  new.rating_avg = old.rating_avg;
  new.rating_count = old.rating_count;
  new.response_time_bucket = old.response_time_bucket;
  new.source_urls = old.source_urls;
  new.created_at = old.created_at;
  return new;
end;
$$;

-- Services (3 main + 20 other), service area (40 towns + the main one) and
-- photos (10), the same limits as the panel.
create or replace function public.limit_business_children()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null or public.is_admin() then
    return new;
  end if;
  if tg_table_name = 'business_services' then
    if (select count(*) from public.business_services where business_id = new.business_id) >= 23
       or (new.is_primary and (
         select count(*) from public.business_services
         where business_id = new.business_id and is_primary
       ) >= 3) then
      raise exception 'too_many_services';
    end if;
  elsif tg_table_name = 'business_cities' then
    if (select count(*) from public.business_cities where business_id = new.business_id) >= 41 then
      raise exception 'too_many_cities';
    end if;
  elsif tg_table_name = 'business_photos' then
    if (select count(*) from public.business_photos where business_id = new.business_id) >= 10 then
      raise exception 'too_many_photos';
    end if;
  end if;
  return new;
end;
$$;

create trigger business_services_limit before insert on public.business_services
  for each row execute function public.limit_business_children();
create trigger business_cities_limit before insert on public.business_cities
  for each row execute function public.limit_business_children();
create trigger business_photos_limit before insert on public.business_photos
  for each row execute function public.limit_business_children();

-- Photo rows can only point at files in their own folder. NOT VALID: existing
-- rows aren't re-checked, new and updated ones are.
alter table public.business_photos
  add constraint business_photos_path_format
  check (storage_path ~ ('^' || business_id::text || '/[A-Za-z0-9_-]+\.(webp|png|jpe?g)$'))
  not valid;
alter table public.review_photos
  add constraint review_photos_path_format
  check (storage_path ~ ('^' || review_id::text || '/[A-Za-z0-9_-]+\.(webp|png|jpe?g)$'))
  not valid;

-- Viber / WhatsApp: null now means the business doesn't use the app (the
-- panel stores the main number when it's the same one), so no fallback.
create or replace function public.reveal_business_contact(p_business_id uuid, p_kind public.contact_kind)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  value text;
begin
  select case p_kind
    when 'phone' then phone
    when 'viber' then viber
    when 'whatsapp' then whatsapp
    when 'email' then email
    when 'website' then website
    when 'instagram' then instagram
  end
  into value
  from public.businesses
  where id = p_business_id and status = 'active';

  if value is not null then
    perform public.track_business_contact(p_business_id, p_kind);
  end if;
  return value;
end;
$$;

revoke execute on function public.reveal_business_contact(uuid, public.contact_kind) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Inquiries
-- ---------------------------------------------------------------------------

-- The author can only close an open inquiry; everything else stays as sent
-- (a rejected inquiry can't be re-approved, dates can't be moved).
create or replace function public.guard_inquiry_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select auth.uid()) is null or public.is_admin() then
    return new;
  end if;
  if old.status <> 'approved' or new.status not in ('approved', 'closed') then
    raise exception 'not_allowed';
  end if;
  new.user_id = old.user_id;
  new.service_id = old.service_id;
  new.city_id = old.city_id;
  new.body = old.body;
  new.answers = old.answers;
  new.urgent = old.urgent;
  new.phone = old.phone;
  new.preferred_time = old.preferred_time;
  new.business_id = old.business_id;
  new.created_at = old.created_at;
  new.closed_at = case when new.status = 'closed' then coalesce(old.closed_at, now()) else old.closed_at end;
  return new;
end;
$$;

create trigger inquiries_guard_update before update on public.inquiries
  for each row execute function public.guard_inquiry_update();

-- The daily limit counts by created_at, so it can't be set by the client.
create or replace function public.limit_inquiries()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null or public.is_admin() then
    return new;
  end if;
  new.created_at = now();
  if (
    select count(*) from public.inquiries
    where user_id = new.user_id and created_at > now() - interval '1 day'
  ) >= 5 then
    raise exception 'rate_limited';
  end if;
  return new;
end;
$$;

-- Customer phone numbers: an account can open a limited number per day, fewer
-- until one of its businesses has been checked by an admin.
create or replace function public.reveal_inquiry_contact(p_inquiry_id uuid, p_business_id uuid)
returns table (phone text, name text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  daily_limit integer;
begin
  if not public.inquiry_matches_business(p_inquiry_id, p_business_id) then
    raise exception 'not_allowed';
  end if;

  if not exists (
    select 1 from public.inquiry_reveals
    where inquiry_id = p_inquiry_id and business_id = p_business_id
  ) then
    daily_limit := case
      when exists (
        select 1 from public.businesses
        where owner_id = (select auth.uid()) and moderated_at is not null
      ) then 50
      else 10
    end;
    if (
      select count(*)
      from public.inquiry_reveals r
      join public.businesses b on b.id = r.business_id
      where b.owner_id = (select auth.uid())
        and r.revealed_at > now() - interval '1 day'
    ) >= daily_limit then
      raise exception 'rate_limited';
    end if;
    insert into public.inquiry_reveals (inquiry_id, business_id)
    values (p_inquiry_id, p_business_id)
    on conflict do nothing;
  end if;

  return query
    select i.phone, p.full_name
    from public.inquiries i
    left join public.profiles p on p.id = i.user_id
    where i.id = p_inquiry_id;
end;
$$;

revoke execute on function public.reveal_inquiry_contact(uuid, uuid) from public, anon;
grant execute on function public.reveal_inquiry_contact(uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Reviews and reports
-- ---------------------------------------------------------------------------

-- created_at is set by the server, so the daily limits can't be dodged.
create or replace function public.limit_user_writes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  recent integer;
begin
  -- Service role and admins aren't limited.
  if (select auth.uid()) is null or public.is_admin() then
    return new;
  end if;
  new.created_at = now();

  if tg_table_name = 'reviews' then
    select count(*) into recent from public.reviews
    where user_id = new.user_id and created_at > now() - interval '1 day';
    if recent >= 10 then
      raise exception 'rate_limited';
    end if;
  else
    select count(*) into recent from public.reports
    where reporter_id = new.reporter_id and created_at > now() - interval '1 day';
    if recent >= 20 then
      raise exception 'rate_limited';
    end if;
  end if;
  return new;
end;
$$;

-- A review hidden or removed by an admin stays, so its author can't delete it
-- and post a fresh one (reviews are unique per user and business).
drop policy "Reviews: author or admin deletes" on public.reviews;
create policy "Reviews: author or admin deletes" on public.reviews for delete to authenticated
  using ((user_id = (select auth.uid()) and status = 'published') or public.is_admin());

-- ---------------------------------------------------------------------------
-- Rate limits for the anonymous server actions (contact reveal, view count).
-- Keys hold a keyed hash of the visitor's IP, never the IP itself.
-- ---------------------------------------------------------------------------

create table public.rate_limits (
  key text primary key,
  window_start timestamptz not null default now(),
  hits integer not null default 1
);

alter table public.rate_limits enable row level security;
revoke all on public.rate_limits from anon, authenticated;

-- True when this hit is within the limit. Server-only (service role).
create or replace function public.rate_limit_hit(p_key text, p_max integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  window_length interval := make_interval(secs => p_window_seconds);
  current_hits integer;
begin
  insert into public.rate_limits as r (key, window_start, hits)
  values (p_key, now(), 1)
  on conflict (key) do update set
    window_start = case when r.window_start < now() - window_length then now() else r.window_start end,
    hits = case when r.window_start < now() - window_length then 1 else r.hits + 1 end
  returning hits into current_hits;

  -- Occasional cleanup; windows are at most a day long.
  if random() < 0.01 then
    delete from public.rate_limits where window_start < now() - interval '2 days';
  end if;

  return current_hits <= p_max;
end;
$$;

revoke execute on function public.rate_limit_hit(text, integer, integer) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Panel saves that replace a list run in one transaction, so a failed insert
-- can't leave a business without services, towns, hours or prices.
-- Security invoker: RLS still decides what the caller may change.
-- ---------------------------------------------------------------------------

create or replace function public.set_business_services_and_cities(
  p_business_id uuid,
  p_city_id integer,
  p_services jsonb,
  p_city_ids integer[]
)
returns void
language plpgsql
set search_path = ''
as $$
begin
  if not (public.owns_business(p_business_id) or public.is_admin()) then
    raise exception 'not_allowed';
  end if;
  update public.businesses set city_id = p_city_id where id = p_business_id;
  delete from public.business_services where business_id = p_business_id;
  insert into public.business_services (business_id, service_id, is_primary)
    select p_business_id, s.service_id, s.is_primary
    from jsonb_to_recordset(p_services) as s (service_id integer, is_primary boolean);
  delete from public.business_cities where business_id = p_business_id;
  insert into public.business_cities (business_id, city_id)
    select distinct p_business_id, c from unnest(p_city_ids) as c;
end;
$$;

create or replace function public.set_business_hours(p_business_id uuid, p_hours jsonb)
returns void
language plpgsql
set search_path = ''
as $$
begin
  if not (public.owns_business(p_business_id) or public.is_admin()) then
    raise exception 'not_allowed';
  end if;
  delete from public.business_hours where business_id = p_business_id;
  insert into public.business_hours (business_id, weekday, opens_at, closes_at)
    select p_business_id, h.weekday, h.opens_at, h.closes_at
    from jsonb_to_recordset(p_hours) as h (weekday smallint, opens_at time, closes_at time);
end;
$$;

create or replace function public.set_business_price_list(p_business_id uuid, p_items jsonb)
returns void
language plpgsql
set search_path = ''
as $$
begin
  if not (public.owns_business(p_business_id) or public.is_admin()) then
    raise exception 'not_allowed';
  end if;
  delete from public.price_list_items where business_id = p_business_id;
  insert into public.price_list_items
    (business_id, service_id, name, kind, price_from, price_to, unit, sort_order)
    select p_business_id, i.service_id, i.name, i.kind, i.price_from, i.price_to, i.unit, i.sort_order
    from jsonb_to_recordset(p_items) as i (
      service_id integer, name text, kind public.price_kind, price_from numeric,
      price_to numeric, unit public.price_unit, sort_order smallint
    );
end;
$$;

-- Moves the cover only when the photo belongs to the business.
create or replace function public.set_business_cover(p_business_id uuid, p_photo_id uuid)
returns void
language plpgsql
set search_path = ''
as $$
begin
  if not (public.owns_business(p_business_id) or public.is_admin()) then
    raise exception 'not_allowed';
  end if;
  if not exists (
    select 1 from public.business_photos where id = p_photo_id and business_id = p_business_id
  ) then
    raise exception 'not_found';
  end if;
  update public.business_photos set is_cover = false
    where business_id = p_business_id and is_cover and id <> p_photo_id;
  update public.business_photos set is_cover = true where id = p_photo_id;
end;
$$;

revoke execute on function public.set_business_services_and_cities(uuid, integer, jsonb, integer[]) from public, anon;
revoke execute on function public.set_business_hours(uuid, jsonb) from public, anon;
revoke execute on function public.set_business_price_list(uuid, jsonb) from public, anon;
revoke execute on function public.set_business_cover(uuid, uuid) from public, anon;
grant execute on function public.set_business_services_and_cities(uuid, integer, jsonb, integer[]) to authenticated;
grant execute on function public.set_business_hours(uuid, jsonb) to authenticated;
grant execute on function public.set_business_price_list(uuid, jsonb) to authenticated;
grant execute on function public.set_business_cover(uuid, uuid) to authenticated;
