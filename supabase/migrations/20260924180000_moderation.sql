-- Reviews, reports and admin moderation: write limits, report rules,
-- a moderation note the owner can see, and an audit log of admin actions.

-- ---------------------------------------------------------------------------
-- Write limits (against spam accounts; the app shows a friendly message)
-- ---------------------------------------------------------------------------

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

create trigger reviews_limit_writes before insert on public.reviews
  for each row execute function public.limit_user_writes();
create trigger reports_limit_writes before insert on public.reports
  for each row execute function public.limit_user_writes();

-- ---------------------------------------------------------------------------
-- Reports
-- ---------------------------------------------------------------------------

alter table public.reports
  add column resolution_note text check (char_length(resolution_note) <= 1000);

-- Reporters can't pre-fill moderation fields.
drop policy "Reports: user creates" on public.reports;
create policy "Reports: user creates" on public.reports for insert to authenticated
  with check (
    reporter_id = (select auth.uid())
    and status = 'open'
    and resolved_by is null
    and resolved_at is null
    and resolution_note is null
  );

-- A review report also points at its business, so admins see all reports
-- about a business in one place.
create or replace function public.fill_report_business()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.review_id is not null then
    select business_id into new.business_id from public.reviews where id = new.review_id;
  end if;
  return new;
end;
$$;

create trigger reports_fill_business before insert on public.reports
  for each row execute function public.fill_report_business();

-- One open report per person and target; reporting again is a no-op.
create unique index reports_one_open_per_reporter
  on public.reports (reporter_id, target, coalesce(review_id, business_id))
  where status = 'open';

-- ---------------------------------------------------------------------------
-- Moderation note on businesses (why a profile was rejected or suspended).
-- Not in the public column grants; the owner reads it in the panel.
-- ---------------------------------------------------------------------------

alter table public.businesses
  add column moderation_note text check (char_length(moderation_note) <= 1000);

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
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Admin audit log
-- ---------------------------------------------------------------------------

create table public.admin_actions (
  id bigint generated always as identity primary key,
  admin_id uuid references public.profiles (id) on delete set null,
  action text not null,
  business_id uuid references public.businesses (id) on delete set null,
  review_id uuid references public.reviews (id) on delete set null,
  report_id uuid references public.reports (id) on delete set null,
  sponsorship_id uuid references public.sponsorships (id) on delete set null,
  note text check (char_length(note) <= 1000),
  created_at timestamptz not null default now()
);

create index admin_actions_created_at_idx on public.admin_actions (created_at desc);
create index admin_actions_business_id_idx on public.admin_actions (business_id, created_at desc);

alter table public.admin_actions enable row level security;

create policy "Admin log: admin reads" on public.admin_actions for select
  using (public.is_admin());
create policy "Admin log: admin writes" on public.admin_actions for insert to authenticated
  with check (public.is_admin() and admin_id = (select auth.uid()));
