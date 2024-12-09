import { json, error } from '@sveltejs/kit';
import { db } from '$lib/db';
import { watchlist } from '$lib/db/schema';
import { and, eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

export async function DELETE(event: RequestEvent) {
  if (!event.locals.user) {
    throw error(401, 'Unauthorized');
  }

  const { movieId } = event.params;
  if (!movieId) {
    throw error(400, 'Watchlist item ID is required');
  }

  try {
    await db
      .delete(watchlist)
      .where(
        and(
          eq(watchlist.id, movieId),
          eq(watchlist.userId, event.locals.user.id)
        )
      );

    return json({ success: true });
  } catch (err) {
    console.error('Failed to delete movie from watchlist:', err);
    throw error(500, 'Failed to delete movie from watchlist');
  }
}
