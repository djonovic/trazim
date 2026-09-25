-- Price guides as a citable source: quartiles (typical range) and the time
-- the numbers were computed ("ažurirano"), refreshed nightly as before.

drop materialized view public.price_stats;

create materialized view public.price_stats as
select
  service_id,
  coalesce(city_id, 0) as city_key,
  nullif(coalesce(city_id, 0), 0) as city_id,
  unit,
  round(avg(price), 2) as price_avg,
  round(percentile_cont(0.5) within group (order by price)::numeric, 2) as price_median,
  round(percentile_cont(0.25) within group (order by price)::numeric, 2) as price_p25,
  round(percentile_cont(0.75) within group (order by price)::numeric, 2) as price_p75,
  min(price_low) as price_min,
  max(price_high) as price_max,
  count(*)::integer as items_count,
  count(distinct business_id)::integer as businesses_count,
  now() as computed_at
from public.price_points
group by grouping sets ((service_id, city_id, unit), (service_id, unit));

create unique index price_stats_key_idx on public.price_stats (service_id, city_key, unit);

grant select on public.price_stats to anon, authenticated;
