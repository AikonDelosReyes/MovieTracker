import { auth } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { LuciaError } from 'lucia';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, '/');
  }
  return {};
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');
    const email = formData.get('email');

    // basic check
    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      typeof email !== 'string' ||
      username.length < 4 ||
      username.length > 31 ||
      password.length < 6 ||
      password.length > 255 ||
      email.length < 3
    ) {
      return fail(400, {
        message: 'Invalid input'
      });
    }

    try {
      const user = await auth.createUser({
        key: {
          providerId: 'username',
          providerUserId: username.toLowerCase(),
          password
        },
        attributes: {
          username,
          email
        }
      });
      const session = await auth.createSession({
        userId: user.userId,
        attributes: {}
      });
      locals.auth.setSession(session);
    } catch (e) {
      if (
        e instanceof LuciaError &&
        (e.message === 'AUTH_DUPLICATE_KEY_ID' ||
          e.message === 'AUTH_INVALID_KEY_ID')
      ) {
        return fail(400, {
          message: 'Username already taken'
        });
      }
      return fail(500, {
        message: 'An unknown error occurred'
      });
    }
    throw redirect(302, '/');
  }
};
