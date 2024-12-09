import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { watchlist, movies } from '$lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateId } from 'lucia';

// Add movie to watchlist
export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { movieId, status = 'want_to_watch', progress = 0 } = await request.json();

  // Check if movie exists in our database
  let movie = await db.query.movies.findFirst({
    where: eq(movies.id, movieId)
  });

  // If not, fetch from OMDB and save
  if (!movie) {
    const response = await fetch(`http://www.omdbapi.com/?i=${movieId}&apikey=${process.env.OMDB_API_KEY}`);
    const data = await response.json();

    if (data.Response === 'False') {
      return json({ error: 'Movie not found' }, { status: 404 });
    }

    await db.insert(movies).values({
      id: movieId,
      title: data.Title,
      year: data.Year,
      poster: data.Poster,
      plot: data.Plot,
      genre: data.Genre,
      director: data.Director,
      actors: data.Actors,
      rating: data.imdbRating
    });
  }

  // Check if movie is already in watchlist
  const existing = await db.query.watchlist.findFirst({
    where: and(
      eq(watchlist.userId, locals.user.userId),
      eq(watchlist.movieId, movieId)
    )
  });

  if (existing) {
    return json({ error: 'Movie already in watchlist' }, { status: 400 });
  }

  // Add to watchlist
  await db.insert(watchlist).values({
    id: generateId(15),
    userId: locals.user.userId,
    movieId,
    status,
    progress
  });

  return json({ success: true });
};

// Update movie in watchlist
export const PUT: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { movieId, status, progress } = await request.json();

  await db.update(watchlist)
    .set({ status, progress, updatedAt: new Date() })
    .where(and(
      eq(watchlist.userId, locals.user.userId),
      eq(watchlist.movieId, movieId)
    ));

  return json({ success: true });
};

// Remove movie from watchlist
export const DELETE: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { movieId } = await request.json();

  await db.delete(watchlist)
    .where(and(
      eq(watchlist.userId, locals.user.userId),
      eq(watchlist.movieId, movieId)
    ));

  return json({ success: true });
};
