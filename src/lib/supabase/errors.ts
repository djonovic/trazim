type PostgrestLikeError = {
  message: string;
  code?: string;
  details?: string | null;
  hint?: string | null;
};

/**
 * Supabase returns plain objects, which Next.js shows as "{code: …}".
 * Wrap them in a real Error with a readable message and the query context.
 */
export function dbError(error: PostgrestLikeError, context: string) {
  const parts = [`${context}: ${error.message}`];
  if (error.code) parts.push(`(${error.code})`);
  if (error.hint) parts.push(`Hint: ${error.hint}`);
  return new Error(parts.join(" "), { cause: error });
}

const PAGE = 1000;

/**
 * Supabase returns at most 1000 rows per request, silently. Pages through a
 * query with .range() until a short page; `query` must have a stable order.
 */
export async function fetchAll<T>(
  query: (
    from: number,
    to: number,
  ) => PromiseLike<{ data: T[] | null; error: PostgrestLikeError | null }>,
  context: string,
) {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await query(from, from + PAGE - 1);
    if (error) throw dbError(error, context);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) return rows;
  }
}
