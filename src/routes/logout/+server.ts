import { auth } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  await auth.invalidateSession(locals.session.sessionId);
  locals.auth.setSession(null);
  throw redirect(302, '/login');
};
