import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import prisma from "./lib/prisma";
import { Lucia, Session, User } from "lucia";
import { cache } from "react";
import { cookies } from "next/headers";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id,
      username: databaseUserAttributes.username,
      avatarUrl: databaseUserAttributes.avatarUrl,
      googleId: databaseUserAttributes.googleId,
      email: databaseUserAttributes.email,
    };
  },
});

declare module "lucia" {
  interface Register {
    ludia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  username: string;
  avatarUrl: string | null;
  googleId: string | null;
  email: string | null;
}

/**
 * Validates the current request by checking the session cookie.
 * 
 * This function attempts to retrieve the session ID from the cookies and validate it using Lucia's session validation.
 * If the session is valid and fresh, it updates the session cookie.
 * If the session is invalid, it creates a blank session cookie.
 * 
 * @returns A promise that resolves to an object containing either the user and session information or null values if the session is invalid.
 */
export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessonId = cookies().get(lucia.sessionCookieName)?.value ?? null; 

    if(sessonId === null){
      return { user: null, session: null };
    }

    const result = await lucia.validateSession(sessonId); 

    try {
        if(result.session && result.session.fresh) {
            const sessionCookie = lucia.createSessionCookie(result.session.id); 
            cookies().set(
                sessionCookie.name, 
                sessionCookie.value, 
                sessionCookie.attributes
            )        
        }
        if(!result.session) {
            const sessionCookie = lucia.createBlankSessionCookie();
            cookies().set(
                sessionCookie.name, 
                sessionCookie.value, 
                sessionCookie.attributes
            )  
        }
    } catch {}
    return result; 

  },
);
