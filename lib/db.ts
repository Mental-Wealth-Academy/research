/**
 * Database — Stub for standalone research deployment
 * Full implementation (Supabase/PostgreSQL) lives in the platform repo.
 */

export async function sqlQuery<T = Record<string, unknown>>(
  query: string,
  params?: Record<string, unknown>
): Promise<T[]> {
  console.warn('Database not configured in standalone mode');
  return [];
}
