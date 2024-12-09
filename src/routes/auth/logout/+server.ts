import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { handleLogout } from '$lib/server/auth.utils';

export const POST: RequestHandler = async ({ locals, cookies }) => {
  try {
    if (!locals.user) {
      throw redirect(302, '/');
    }

    await handleLogout(cookies);
    
    return new Response(null, {
      status: 303,
      headers: {
        Location: '/'
      }
    });
  } catch (error) {
    console.error('Error during logout:', error);
    return new Response(JSON.stringify({ error: 'Logout failed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
