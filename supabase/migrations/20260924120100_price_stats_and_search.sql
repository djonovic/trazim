-- Price statistics for /cijene and /statistika, plus diacritic-insensitive search.

-- One comparable number per price list item: the midpoint for ranges.
create or replace view public.price_points
with (security_invoker = true)
as
select
  p.id,
  p.business_id,
  p.service_id,
  p.preset_id,
  p.unit,
  b.city_id,
  case p.kind when 'range' then (p.price_from + p.price_to) / 2 else p.price_from end as price,
  p.price_from as price_low,
  coalesce(p.price_to, p.price_from) as price_high
from public.price_list_items p
join public.businesses b on b.id = p.business_id
where b.status = 'active'
  and p.service_id is not null
  and p.kind in ('fixed', 'from', 'range');

-- Service × city × unit (city_key = 0 is the whole country).
create materialized view public.price_stats as
select
  service_id,
  coalesce(city_id, 0) as city_key,
  nullif(coalesce(city_id, 0), 0) as city_id,
  unit,
  round(avg(price), 2) as price_avg,
  round(percentile_cont(0.5) within group (order by price)::numeric, 2) as price_median,
  min(price_low) as price_min,
  max(price_high) as price_max,
  count(*)::integer as items_count,
  count(distinct business_id)::integer as businesses_count
from public.price_points
group by grouping sets ((service_id, city_id, unit), (service_id, unit));

create unique index price_stats_key_idx on public.price_stats (service_id, city_key, unit);

-- Per preset item ("Montaža rasvjete") × city, for the price table on /cijene pages.
create materialized view public.price_item_stats as
select
  preset_id,
  service_id,
  coalesce(city_id, 0) as city_key,
  nullif(coalesce(city_id, 0), 0) as city_id,
  unit,
  round(avg(price), 2) as price_avg,
  min(price_low) as price_min,
  max(price_high) as price_max,
  count(*)::integer as items_count
from public.price_points
where preset_id is not null
group by grouping sets ((preset_id, service_id, city_id, unit), (preset_id, service_id, unit));

create unique index price_item_stats_key_idx on public.price_item_stats (preset_id, city_key, unit);

grant select on public.price_stats, public.price_item_stats to anon, authenticated;

create or replace function public.refresh_price_stats()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  refresh materialized view concurrently public.price_stats;
  refresh materialized view concurrently public.price_item_stats;
end;
$$;

revoke execute on function public.refresh_price_stats() from public, anon, authenticated;

create extension if not exists pg_cron;

select cron.schedule(
  'refresh-price-stats',
  '15 3 * * *', -- 03:15 UTC every night
  $$select public.refresh_price_stats()$$
);

-- ---------------------------------------------------------------------------
-- Search: "elektricar" finds "Električar", "santehnik" finds "Сантехник".
-- ---------------------------------------------------------------------------

create index cities_search_trgm_idx on public.cities
  using gin (public.search_normalize(name_me || ' ' || name_en || ' ' || name_ru || ' ' || slug) extensions.gin_trgm_ops);

create or replace function public.search_services(q text, max_results integer default 8)
returns setof public.services
language sql
stable
set search_path = ''
as $$
  with term as (select public.search_normalize(trim(q)) as t)
  select s.*
  from public.services s, term
  where length(term.t) > 0
    and (s.search_text like '%' || term.t || '%' or extensions.word_similarity(term.t, s.search_text) > 0.35)
  order by
    (public.search_normalize(s.name_me) like term.t || '%') desc,
    extensions.word_similarity(term.t, s.search_text) desc,
    s.sort_order
  limit least(max_results, 20)
$$;

create or replace function public.search_cities(q text, max_results integer default 8)
returns setof public.cities
language sql
stable
set search_path = ''
as $$
  with term as (select public.search_normalize(trim(q)) as t)
  select c.*
  from public.cities c, term
  where length(term.t) > 0
    and public.search_normalize(c.name_me || ' ' || c.name_en || ' ' || c.name_ru || ' ' || c.slug)
        like '%' || term.t || '%'
  order by
    (public.search_normalize(c.name_me) like term.t || '%') desc,
    c.parent_city_id is not null,
    c.population desc nulls last
  limit least(max_results, 20)
$$;
