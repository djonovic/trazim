-- Banners on more pages: the home page (also shown on /usluge and /gradovi),
-- a service (its listings in every town and the service page) or a town
-- (its town page, and listings there when the service has no banner).
-- Still one advertiser per placement at a time.

alter table public.banners
  add column scope text not null default 'service' check (scope in ('home', 'service', 'city')),
  add column city_id integer references public.cities (id) on delete cascade,
  alter column service_id drop not null;

alter table public.banners
  add constraint banners_scope_fields check (
    case scope
      when 'home' then service_id is null and city_id is null
      when 'service' then service_id is not null and city_id is null
      when 'city' then city_id is not null and service_id is null
    end
  );

create index banners_city_lookup_idx on public.banners (city_id) where status = 'active';
create index banners_home_lookup_idx on public.banners (scope) where status = 'active' and scope = 'home';
