import { lucia } from './auth';
import type { Cookies } from '@sveltejs/kit';

export async function handleLogout(cookies: Cookies) {
  const sessionId = cookies.get(lucia.sessionCookieName);
  if (sessionId) {
    await lucia.invalidateSession(sessionId);
  }

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies.set(sessionCookie.name, sessionCookie.value, {
    path: '/',
    ...sessionCookie.attributes
  });
}

export function setSessionCookie(cookies: Cookies, sessionId: string) {
  const sessionCookie = lucia.createSessionCookie(sessionId);
  cookies.set(sessionCookie.name, sessionCookie.value, {
    path: '/',
    ...sessionCookie.attributes
  });
}
