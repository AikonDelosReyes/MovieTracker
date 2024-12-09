import { lucia } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import { db } from '$lib/db';
import { users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';
import type { Actions, PageServerLoad } from './$types';
import { validateUsername, validateEmail, validatePassword, getValidationError } from '$lib/utils/validation';
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
    const email = formData.get('email');
    const password = formData.get('password');

    // Validate inputs
    const usernameError = getValidationError('username', username);
    if (usernameError) {
      return fail(400, { message: usernameError });
    }

    const emailError = getValidationError('email', email);
    if (emailError) {
      return fail(400, { message: emailError });
    }

    const passwordError = getValidationError('password', password);
    if (passwordError) {
      return fail(400, { message: passwordError });
    }

    // Check for existing username
    const existingUser = await db.query.users.findFirst({
      where: eq(users.username, username as string)
    });

    if (existingUser) {
      return fail(400, {
        message: 'Username already taken'
      });
    }

    // Check for existing email
    const existingEmail = await db.query.users.findFirst({
      where: eq(users.email, email as string)
    });

    if (existingEmail) {
      return fail(400, {
        message: 'Email already registered'
      });
    }

    // Create new user
    const hashedPassword = await new Argon2id().hash(password as string);
    const userId = generateId(15);

    await db.insert(users).values({
      id: userId,
      username: username as string,
      email: email as string,
      hashedPassword
    });

    // Create session
    const session = await lucia.createSession(userId, {});
    setSessionCookie(cookies, session.id);

    throw redirect(302, '/');
  }
};
