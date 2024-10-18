import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
    email: requiredString.email("Invalid email address"),
    username: requiredString.regex(
        /^[a-zA-Z0-9_-]+$/,
        "Only letters, numbers, - and _ allowed"
    ), 
    password: requiredString.min(8, "Password must be 8 characters long!")
})

export type SignUpValues = z.infer<typeof signUpSchema>


export const logInSchema = z.object({
    username: requiredString,
    password: requiredString.min(8, "Password must be 8 characters long!")
})

export type LogInValues = z.infer<typeof logInSchema> 