import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { userLists, listMovies } from '$lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateId } from 'lucia';

// Add movie to list
export const POST: RequestHandler = async ({ request, locals, params }) => {
  if (!locals.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { movieId } = await request.json();
  const { listId } = params;

  // Verify list ownership
  const list = await db.query.userLists.findFirst({
    where: and(
      eq(userLists.id, listId),
      eq(userLists.userId, locals.user.userId)
    )
  });

  if (!list) {
    return json({ error: 'List not found' }, { status: 404 });
  }

  // Get highest order
  const lastMovie = await db.query.listMovies.findFirst({
    where: eq(listMovies.listId, listId),
    orderBy: (movies, { desc }) => [desc(movies.order)]
  });

  const order = lastMovie ? lastMovie.order + 1 : 0;

  // Add movie to list
  await db.insert(listMovies).values({
    id: generateId(15),
    listId,
    movieId,
    order
  });

  return json({ success: true });
};

// Update movie order in list
export const PUT: RequestHandler = async ({ request, locals, params }) => {
  if (!locals.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { movieId, newOrder } = await request.json();
  const { listId } = params;

  // Verify list ownership
  const list = await db.query.userLists.findFirst({
    where: and(
      eq(userLists.id, listId),
      eq(userLists.userId, locals.user.userId)
    )
  });

  if (!list) {
    return json({ error: 'List not found' }, { status: 404 });
  }

  // Update order
  await db.update(listMovies)
    .set({ order: newOrder })
    .where(and(
      eq(listMovies.listId, listId),
      eq(listMovies.movieId, movieId)
    ));

  return json({ success: true });
};

// Remove movie from list
export const DELETE: RequestHandler = async ({ request, locals, params }) => {
  if (!locals.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { movieId } = await request.json();
  const { listId } = params;

  // Verify list ownership
  const list = await db.query.userLists.findFirst({
    where: and(
      eq(userLists.id, listId),
      eq(userLists.userId, locals.user.userId)
    )
  });

  if (!list) {
    return json({ error: 'List not found' }, { status: 404 });
  }

  // Remove movie from list
  await db.delete(listMovies)
    .where(and(
      eq(listMovies.listId, listId),
      eq(listMovies.movieId, movieId)
    ));

  return json({ success: true });
};
