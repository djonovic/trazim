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
