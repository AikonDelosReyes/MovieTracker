import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';
import { watchlist, movies } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { WatchlistItem } from '$lib/types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, '/login');
  }

  try {
    const watchlistItems = await db
      .select()
      .from(watchlist)
      .where(eq(watchlist.userId, locals.user.id))
      .leftJoin(movies, eq(watchlist.movieId, movies.id));

    return {
      watchlist: watchlistItems.map(item => ({
        id: item.watchlist.id,
        status: item.watchlist.status,
        progress: item.watchlist.progress,
        movie: item.movies ? {
          id: item.movies.id,
          title: item.movies.title,
          year: item.movies.year,
          poster: item.movies.poster
        } : null
      } as WatchlistItem))
    };
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return {
      watchlist: []
    };
  }
};
