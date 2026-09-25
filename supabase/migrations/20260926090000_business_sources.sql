-- Where an imported business's details come from (its own website, official
-- social page or map listing). Not in the public column grants: used to
-- re-check data and to handle removal requests. Null for owner-created profiles.
alter table public.businesses add column source_urls text[];
