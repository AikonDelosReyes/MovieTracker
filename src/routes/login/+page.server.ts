import { lucia } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { setSessionCookie } from '$lib/server/auth.utils';
import { validateCredentials } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, '/');
  }
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    // validate form data
    if (typeof username !== 'string' || typeof password !== 'string') {
      return fail(400, {
        message: 'Invalid form data'
      });
    }

    try {
      // find user and verify password
      const isValid = await validateCredentials(username.toLowerCase(), password);
      if (!isValid) {
        return fail(400, {
          message: 'Incorrect username or password'
        });
      }
      
      // Create session
      const session = await lucia.createSession(username.toLowerCase(), {});
      setSessionCookie(cookies, session.id);
    } catch (error) {
      if (error instanceof Error) {
        // handle authentication errors
        console.error('Login error:', error);
      }
      return fail(500, {
        message: 'An unknown error occurred'
      });
    }
    throw redirect(302, '/');
  }
};
