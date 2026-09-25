-- Public review feed: published reviews of active businesses with a short
-- author name ("Marko P."). Runs as the view owner so anon can read the name
-- without access to the profiles table.

create or replace view public.public_reviews as
select
  r.id,
  r.business_id,
  r.rating,
  r.body,
  r.created_at,
  r.edited_at,
  r.reply_body,
  r.replied_at,
  case
    when p.full_name is null or btrim(p.full_name) = '' then null
    when position(' ' in btrim(p.full_name)) = 0 then btrim(p.full_name)
    else split_part(btrim(p.full_name), ' ', 1) || ' ' ||
         left(split_part(btrim(p.full_name), ' ', array_length(regexp_split_to_array(btrim(p.full_name), '\s+'), 1)), 1) || '.'
  end as author_name,
  b.slug as business_slug,
  b.name as business_name,
  b.city_id as business_city_id
from public.reviews r
join public.businesses b on b.id = r.business_id
left join public.profiles p on p.id = r.user_id
where r.status = 'published' and b.status = 'active';

grant select on public.public_reviews to anon, authenticated;

-- The main city is always part of the service area, so listings only need
-- to look at business_cities.
create or replace function public.sync_business_main_city()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.business_cities (business_id, city_id)
  values (new.id, new.city_id)
  on conflict do nothing;
  return new;
end;
$$;

create trigger businesses_sync_main_city after insert or update of city_id on public.businesses
  for each row execute function public.sync_business_main_city();

-- ---------------------------------------------------------------------------
-- Contact details are revealed on click (and counted), not shipped in pages
-- or readable through the API, to keep phone numbers away from scrapers.
-- ---------------------------------------------------------------------------

revoke select on public.businesses from anon, authenticated;
grant select (
  id, owner_id, slug, name, description, website, instagram, address, city_id,
  lat, lng, status, moderated_at, verified_at, offers_online, emergency_24h,
  languages, response_time_bucket, views_count, rating_avg, rating_count,
  created_at, updated_at
) on public.businesses to anon, authenticated;

-- Which contact channels a business has, without the values.
create or replace view public.business_contact_channels as
select
  id as business_id,
  phone is not null as has_phone,
  viber is not null as has_viber,
  whatsapp is not null as has_whatsapp,
  email is not null as has_email
from public.businesses
where status = 'active';

grant select on public.business_contact_channels to anon, authenticated;

-- Returns one contact value and counts the click. Server-only (service role),
-- so the app can rate-limit before calling it.
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
    when 'viber' then coalesce(viber, phone)
    when 'whatsapp' then coalesce(whatsapp, phone)
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
