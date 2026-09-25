-- Business search by name/description for the search bar. search_text isn't
-- in the public column grants, so this returns only ids of active businesses.

create or replace function public.search_business_ids(q text, max_results integer default 200)
returns table (id uuid)
language sql
stable
security definer
set search_path = ''
as $$
  with term as (select public.search_normalize(trim(q)) as t)
  select b.id
  from public.businesses b, term
  where b.status = 'active'
    and length(term.t) > 1
    and (b.search_text like '%' || term.t || '%'
         or extensions.word_similarity(term.t, b.search_text) > 0.4)
  order by extensions.word_similarity(term.t, b.search_text) desc
  limit least(max_results, 300)
$$;

grant execute on function public.search_business_ids(text, integer) to anon, authenticated;
