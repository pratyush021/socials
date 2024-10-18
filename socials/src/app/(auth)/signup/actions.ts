"use server"

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { hash } from "@node-rs/argon2"
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Handles user sign-up process.
 * 
 * This server-side function performs the following steps:
 * 1. Validates user input
 * 2. Hashes the password
 * 3. Checks for existing username and email
 * 4. Creates a new user in the database
 * 5. Creates a new session and sets a session cookie
 * 6. Redirects to the home page on success
 *
 * @param {SignUpValues} credentials - Object containing username, email, and password
 * @returns {Promise<{error: string}>} Returns an object with an error message if sign-up fails
 * @throws {Error} Throws an error if a redirect occurs during the signup process.
 */
export async function signUp(
    credentials: SignUpValues
): Promise<{error: string}> {
    try {
        const {username, email, password} = signUpSchema.parse(credentials)

        const passwordHash = await hash(password, {
            memoryCost: 19456, 
            timeCost: 2, 
            outputLen: 32, 
            parallelism: 1
        })

        const userId = generateIdFromEntropySize(10); 

        const existingUserName = await prisma.user.findFirst({
            where: {
                username: {
                    equals: username,
                    mode: "insensitive", 
                }
            }
        })
        if(existingUserName) {
            return {
                error: "User " + username + " already exists!"
            }
        }
        const existingEmail = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email, 
                    mode: "insensitive"
                }
            }
        })
        if(existingEmail) {
            return {
                error: "Email " + email + " already exists!"
            }
        }

        await prisma.user.create({
            data: {
                id: userId, 
                username, 
                displayName: username, 
                email, 
                passwordHash

            }
        })

        const session = await lucia.createSession(userId, {})
        const sessionCookie = lucia.createSessionCookie(session.id)
        cookies().set(
            sessionCookie.name, 
            sessionCookie.value, 
            sessionCookie.attributes
        );

        return redirect("/")
    } catch(error) {
        if (isRedirectError(error)) throw error; 
        console.log(error); // [REMOVE]
        return {
            error: "Something went wrong. Please try again"
        }
    }
}