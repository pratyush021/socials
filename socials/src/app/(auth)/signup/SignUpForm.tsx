"use client";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"

export default function SignUpForm() {

    const form = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema)
    })

    return <>

    </>
}