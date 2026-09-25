-- Admin-chosen order of sponsored businesses within one placement (home, a
-- service, a town, a service + town). Lower first; new sponsorships have no
-- position and come after the ordered ones, oldest first.

alter table public.sponsorships add column position integer;

-- Sets the order of one placement in one go. All ids must share the same
-- placement, so a stray id can't reorder another page. Admins only.
create or replace function public.reorder_sponsorships(p_ids uuid[])
returns void
language plpgsql
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'not_allowed';
  end if;
  if (
    select count(distinct (scope, service_id, city_id))
    from public.sponsorships
    where id = any (p_ids)
  ) > 1 then
    raise exception 'mixed_placements';
  end if;
  update public.sponsorships s
  set position = o.ord
  from unnest(p_ids) with ordinality as o (id, ord)
  where s.id = o.id;
end;
$$;

revoke execute on function public.reorder_sponsorships(uuid[]) from public, anon;
grant execute on function public.reorder_sponsorships(uuid[]) to authenticated;
