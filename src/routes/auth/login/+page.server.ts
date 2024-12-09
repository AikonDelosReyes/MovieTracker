import { lucia } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import { db } from '$lib/db';
import { users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { validateUsername, validatePassword, getValidationError } from '$lib/utils/validation';
import { setSessionCookie } from '$lib/server/auth.utils';

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

    // Validate inputs
    const usernameError = getValidationError('username', username);
    if (usernameError) {
      return fail(400, { message: usernameError });
    }

    const passwordError = getValidationError('password', password);
    if (passwordError) {
      return fail(400, { message: passwordError });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.username, username as string)
    });

    if (!user) {
      return fail(400, {
        message: 'Username or password is incorrect'
      });
    }

    const validPassword = await new Argon2id().verify(
      user.hashedPassword,
      password as string
    );

    if (!validPassword) {
      return fail(400, {
        message: 'Username or password is incorrect'
      });
    }

    const session = await lucia.createSession(user.id, {});
    setSessionCookie(cookies, session.id);

    throw redirect(302, '/');
  }
};
