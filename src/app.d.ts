// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
/// <reference types="@sveltejs/kit" />
/// <reference types="lucia" />

declare global {
	namespace App {
		interface Locals {
			auth: import('auth').AuthRequest;
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
		}
	}

	namespace Lucia {
		type Auth = typeof import('$lib/server/auth').lucia;
		type DatabaseUserAttributes = {
			username: string;
			email: string;
		};
		type DatabaseSessionAttributes = Record<string, never>;
	}
}

export {};
