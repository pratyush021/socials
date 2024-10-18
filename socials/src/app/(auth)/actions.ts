"use server"

import { lucia, validateRequest } from "@/auth"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Logs out the current user by invalidating their session.
 * 
 * This server action performs the following steps:
 * 1. Validates the current request to check for an active session.
 * 2. If no session is found, it throws an "Unauthorized" error.
 * 3. Invalidates the current session using Lucia.
 * 4. Creates a blank session cookie.
 * 5. Sets the blank session cookie in the response.
 * 6. Redirects the user to the login page.
 * 
 * @throws {Error} If there is no active session (user is not logged in).
 * @returns {Promise<never>} This function never returns as it always redirects.
 */
export async function logout(){
    const { session } = await validateRequest(); 

    if(!session) {
        throw new Error("Unauthorized"); 
    }
    await lucia.invalidateSession(session.id); 
    const sessionCookie = lucia.createBlankSessionCookie(); 

    cookies().set(
        sessionCookie.name, 
        sessionCookie.value, 
        sessionCookie.attributes
    )
    return redirect("/login");
}