import { json, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/db';
import { watchlists } from '$lib/db/schema';
import { generateId } from 'lucia';

interface WatchlistRequest {
  name: string;
  description?: string;
}

export async function POST(event: RequestEvent) {
  if (!event.locals.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const body = await event.request.json() as WatchlistRequest;

    if (!body.name) {
      return json({ error: 'Name is required' }, { status: 400 });
    }

    const watchlistId = generateId(15);
    
    await db.insert(watchlists).values({
      id: watchlistId,
      name: body.name,
      description: body.description,
      userId: event.locals.user.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return json({ id: watchlistId });
  } catch (error) {
    console.error('Failed to create watchlist:', error);
    return json({ error: 'Failed to create watchlist' }, { status: 500 });
  }
}
