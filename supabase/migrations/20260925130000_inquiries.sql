-- "Pošalji upit": a customer describes a job once and every active business
-- offering that service in that town (or one chosen business) sees it in its
-- panel. No commission. The phone number is revealed per business on click
-- (and counted), not readable through the API.

alter table public.inquiries
  add column phone text check (char_length(phone) between 6 and 20),
  add column preferred_time text check (preferred_time in ('asap', 'this_week', 'this_month', 'flexible')),
  -- Set when the customer writes to one business from its profile.
  add column business_id uuid references public.businesses (id) on delete cascade;

create index inquiries_business_id_idx on public.inquiries (business_id) where business_id is not null;

-- Published right away (moderation is after the fact: admins can reject), so
-- businesses see requests while they're fresh. Rate limited below.
drop policy "Inquiries: author creates" on public.inquiries;
create policy "Inquiries: author creates" on public.inquiries for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'approved' and closed_at is null);

drop policy "Inquiries: author closes, admin moderates" on public.inquiries;
create policy "Inquiries: author closes, admin moderates" on public.inquiries for update
  using (user_id = (select auth.uid()) or public.is_admin())
  with check (public.is_admin() or (user_id = (select auth.uid()) and status in ('approved', 'closed')));

-- Does this business (owned by the current user) match the inquiry?
-- Same service, and the business works in the town (a municipality includes
-- its settlements and the other way round), or the inquiry was sent to it.
create or replace function public.inquiry_matches_business(p_inquiry_id uuid, p_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.inquiries i
    join public.businesses b on b.id = p_business_id
    where i.id = p_inquiry_id
      and b.owner_id = (select auth.uid())
      and b.status = 'active'
      and i.status = 'approved'
      and i.created_at > now() - interval '30 days'
      and (
        i.business_id = b.id
        or (
          i.business_id is null
          and exists (select 1 from public.business_services bs where bs.business_id = b.id and bs.service_id = i.service_id)
          and exists (
            select 1
            from public.business_cities bc
            join public.cities c on c.id = i.city_id
            where bc.business_id = b.id
              and (bc.city_id = c.id or bc.city_id = c.parent_city_id
                   or bc.city_id in (select id from public.cities where parent_city_id = c.id))
          )
        )
      )
  )
$$;

create or replace function public.can_see_inquiry(p_inquiry_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.businesses b
    where b.owner_id = (select auth.uid())
      and public.inquiry_matches_business(p_inquiry_id, b.id)
  )
$$;

create policy "Inquiries: matching businesses read" on public.inquiries for select
  to authenticated
  using (public.can_see_inquiry(id));

-- The phone stays out of reach of the API; businesses get it through
-- reveal_inquiry_contact(), the author doesn't need it back.
revoke select on public.inquiries from anon, authenticated;
grant select (
  id, user_id, service_id, city_id, body, answers, urgent, status, created_at,
  closed_at, preferred_time, business_id
) on public.inquiries to authenticated;

-- Which businesses opened the contact (the author sees the count).
create table public.inquiry_reveals (
  inquiry_id uuid not null references public.inquiries (id) on delete cascade,
  business_id uuid not null references public.businesses (id) on delete cascade,
  revealed_at timestamptz not null default now(),
  primary key (inquiry_id, business_id)
);

alter table public.inquiry_reveals enable row level security;

create policy "Inquiry reveals: author, business owner and admin read" on public.inquiry_reveals for select
  using (
    public.owns_business(business_id)
    or exists (select 1 from public.inquiries i where i.id = inquiry_id and i.user_id = (select auth.uid()))
    or public.is_admin()
  );

create or replace function public.reveal_inquiry_contact(p_inquiry_id uuid, p_business_id uuid)
returns table (phone text, name text)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.inquiry_matches_business(p_inquiry_id, p_business_id) then
    raise exception 'not_allowed';
  end if;
  insert into public.inquiry_reveals (inquiry_id, business_id)
  values (p_inquiry_id, p_business_id)
  on conflict do nothing;
  return query
    select i.phone, p.full_name
    from public.inquiries i
    left join public.profiles p on p.id = i.user_id
    where i.id = p_inquiry_id;
end;
$$;

revoke execute on function public.reveal_inquiry_contact(uuid, uuid) from public, anon;
grant execute on function public.reveal_inquiry_contact(uuid, uuid) to authenticated;

-- Spam guard: 5 inquiries per user per day (admins and the service role aren't limited).
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
  if (
    select count(*) from public.inquiries
    where user_id = new.user_id and created_at > now() - interval '1 day'
  ) >= 5 then
    raise exception 'rate_limited';
  end if;
  return new;
end;
$$;

create trigger inquiries_limit_writes before insert on public.inquiries
  for each row execute function public.limit_inquiries();
