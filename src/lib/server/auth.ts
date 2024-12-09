import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { dev } from "$app/environment";
import Database from "better-sqlite3";

const sqlite = new Database("sqlite.db");

const adapter = new BetterSqlite3Adapter(sqlite, {
  user: "users",
  session: "sessions"
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !dev,
      sameSite: "lax",
      path: "/"
    }
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      email: attributes.email
    };
  }
});

export async function validateCredentials(username: string, password: string): Promise<boolean> {
  // This is where you would validate the password against the stored hash
  // For now, we'll just return true
  return true;
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      username: string;
      email: string;
    };
  }
}
