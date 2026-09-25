// Hand-written content for every service (description, FAQ, tips in
// me/en/ru), merged from the batches in ./content. Applied by
// scripts/generate-seed.ts (seed.sql) and scripts/sync-service-content.ts
// (existing database).
import { content as a } from "./content/batch-a.ts";
import { content as b } from "./content/batch-b.ts";
import { content as c } from "./content/batch-c.ts";
import { content as d } from "./content/batch-d.ts";
import { content as e } from "./content/batch-e.ts";
import { content as f } from "./content/batch-f.ts";
import { content as g } from "./content/batch-g.ts";
import { content as h } from "./content/batch-h.ts";
import { content as i } from "./content/batch-i.ts";
import { content as j } from "./content/batch-j.ts";
import { content as k } from "./content/batch-k.ts";
import type { ServiceContent } from "./content/types.ts";

export const serviceContent: Record<string, ServiceContent> = {
  ...a,
  ...b,
  ...c,
  ...d,
  ...e,
  ...f,
  ...g,
  ...h,
  ...i,
  ...j,
  ...k,
};
