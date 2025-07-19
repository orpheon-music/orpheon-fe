"use client"

import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface UseSignInProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useSignIn({ onSuccess, onError }: UseSignInProps = {}) {
  const router = useRouter()

  const signInWithCredentials = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    })

    if (res?.ok) {
      toast.success("Login successful!")
      onSuccess?.()
      router.push("/mastering")
    } else {
      const message = res?.error || "Login failed. Please try again."
      toast.error(message)
      onError?.(message)
    }
  }

  return {
    signInWithCredentials,
  }
}
