import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { reviews } from '$lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// Add review
export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  const { movieId, rating, review: reviewText } = await request.json();

  // Check if user has already reviewed this movie
  const existing = await db.query.reviews.findFirst({
    where: and(
      eq(reviews.userId, locals.user.id),
      eq(reviews.movieId, movieId)
    )
  });

  if (existing) {
    throw error(400, 'You have already reviewed this movie');
  }

  // Add review
  try {
    await db
      .insert(reviews)
      .values({
        id: randomUUID(),
        userId: locals.user.id,
        movieId,
        rating,
        review: reviewText,
        createdAt: new Date(),
        updatedAt: new Date()
      });

    return json({ success: true });
  } catch (err) {
    console.error('Failed to add review:', err);
    throw error(500, 'Failed to add review');
  }
};

// Update review
export const PUT: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  const { movieId, rating, review: reviewText } = await request.json();

  try {
    const result = await db.update(reviews)
      .set({ 
        rating, 
        review: reviewText, 
        updatedAt: new Date() 
      })
      .where(and(
        eq(reviews.userId, locals.user.id),
        eq(reviews.movieId, movieId)
      ))
      .returning();

    if (result.length === 0) {
      throw error(404, 'Review not found');
    }

    return json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.message === 'Review not found') {
      throw err;
    }
    console.error('Failed to update review:', err);
    throw error(500, 'Failed to update review');
  }
};

// Delete review
export const DELETE: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  const { movieId } = await request.json();

  try {
    const result = await db.delete(reviews)
      .where(and(
        eq(reviews.userId, locals.user.id),
        eq(reviews.movieId, movieId)
      ))
      .returning();

    if (result.length === 0) {
      throw error(404, 'Review not found');
    }

    return json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.message === 'Review not found') {
      throw err;
    }
    console.error('Failed to delete review:', err);
    throw error(500, 'Failed to delete review');
  }
};

// Get user reviews
export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  try {
    const userReviews = await db.query.reviews.findMany({
      where: eq(reviews.userId, locals.user.id),
      with: {
        movie: true
      }
    });

    return json(userReviews);
  } catch (err) {
    console.error('Failed to fetch reviews:', err);
    throw error(500, 'Failed to fetch reviews');
  }
};
