import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { userLists, listMovies } from '$lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// Create new list
export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  const { name, description, isPublic } = await request.json();

  try {
    const listId = randomUUID();
    await db.insert(userLists).values({
      id: listId,
      userId: locals.user.id,
      name,
      description,
      isPublic: isPublic === 'true'
    });

    return json({ success: true, listId });
  } catch (err) {
    console.error('Failed to create list:', err);
    throw error(500, 'Failed to create list');
  }
};

// Update list details
export const PUT: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  const { listId, name, description, isPublic } = await request.json();

  const list = await db.query.userLists.findFirst({
    where: and(
      eq(userLists.id, listId),
      eq(userLists.userId, locals.user.id)
    )
  });

  if (!list) {
    throw error(404, 'List not found');
  }

  try {
    await db
      .update(userLists)
      .set({
        name,
        description,
        isPublic: isPublic === 'true',
        updatedAt: new Date()
      })
      .where(eq(userLists.id, listId));

    return json({ success: true });
  } catch (err) {
    console.error('Failed to update list:', err);
    throw error(500, 'Failed to update list');
  }
};

// Delete list
export const DELETE: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  const { listId } = await request.json();

  const list = await db.query.userLists.findFirst({
    where: and(
      eq(userLists.id, listId),
      eq(userLists.userId, locals.user.id)
    )
  });

  if (!list) {
    throw error(404, 'List not found');
  }

  try {
    // Delete all movies in list
    await db.delete(listMovies)
      .where(eq(listMovies.listId, listId));

    // Delete list
    await db.delete(userLists)
      .where(eq(userLists.id, listId));

    return json({ success: true });
  } catch (err) {
    console.error('Failed to delete list:', err);
    throw error(500, 'Failed to delete list');
  }
};
