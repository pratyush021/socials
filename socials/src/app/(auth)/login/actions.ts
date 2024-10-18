"use server"

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { logInSchema, LogInValues } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verify } from "@node-rs/argon2"

/**
 * Handles user login authentication.
 * 
 * @async
 * @function login
 * @param {LogInValues} credentials - The user's login credentials.
 * @returns {Promise<{error: string}>} A promise that resolves to an object containing an error message if login fails.
 * @throws {Error} Throws an error if a redirect occurs during the login process.
 * 
 * @description
 * This function performs the following steps:
 * 1. Validates the input credentials using the logInSchema.
 * 2. Searches for the user in the database (case-insensitive username match).
 * 3. Verifies the provided password against the stored hash.
 * 4. If authentication is successful, creates a new session and sets a session cookie.
 * 5. Redirects the user to the home page on successful login.
 * 
 * @example
 * const result = await login({ username: "user123", password: "password123" });
 * if (result.error) {
 *   console.error(result.error);
 * }
 */
export async function login(
    credentials: LogInValues
): Promise<{error: string}> {
    try {
        const {username, password} = logInSchema.parse(credentials)

        const existingUserName = await prisma.user.findFirst({
            where: {
                username: {
                    equals: username, 
                    mode: "insensitive"
                }
            }
        })
        /*
         * if user does not exist or if the user does not have a
         * password associated with them. 
         * - Don't return specific error. 
         */
        if(!existingUserName || !existingUserName.passwordHash) return {
            error: "Incorrect username or password"
        }
        //validate password

        const validPassword = await verify(existingUserName.passwordHash, password, {
            memoryCost: 19456, 
            timeCost: 2, 
            outputLen: 32, 
            parallelism: 1
        })
        if(!validPassword) {
            return {
                error: "Incorrect username or password"
            }
        }

        //if user is validated
        const userId = existingUserName.id; 
        const session = await lucia.createSession(userId, {})
        const sessionCookie = lucia.createSessionCookie(session.id)

        cookies().set(
            sessionCookie.name, 
            sessionCookie.value, 
            sessionCookie.attributes
        )
        return redirect("/")
    } catch (error) {
        if(isRedirectError(error)) throw error; 
        console.log(error); // [REMOVE]
        return {
            error: "Something went wrong!"
        }
    }
}
