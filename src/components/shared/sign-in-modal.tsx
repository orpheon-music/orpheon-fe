"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
    rememberMe: z.boolean(),
})

interface SignInModalProps {
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
    onSwitchToSignUp?: () => void
}

export default function SignInModal({
    trigger,
    open: controlledOpen,
    onOpenChange,
    onSwitchToSignUp,
}: SignInModalProps = {}) {
    const [showPassword, setShowPassword] = useState(false)
    const [internalOpen, setInternalOpen] = useState(false)
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    // Use controlled open state if provided, otherwise use internal state
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen
    const setOpen = onOpenChange || setInternalOpen

    useEffect(() => {
        const isSignin = searchParams.get("signin")
        if (isSignin === "true") {
            setOpen(true)
        }
    }, [searchParams, setOpen])

    useEffect(() => {
        if (open && searchParams.get("signin") === "true") {
            const params = new URLSearchParams(searchParams.toString())
            params.delete("signin")
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        }
    }, [open, searchParams, pathname, router])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const res = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
            callbackUrl: "/",
        })

        if (res?.ok) {
            toast.success("Login successful!")
            setOpen(false)
            form.reset()
        } else {
            toast.error(res?.error || "Login failed. Please try again.")
        }
    }

    const handleSwitchToSignUp = () => {
        if (onSwitchToSignUp) {
            onSwitchToSignUp()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button size="lg" variant="default" className="bg-[#791B87]">
                        Sign In
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md md:max-w-xl border-[#EFEFEF] bg-white/05 rounded-3xl text-white px-8 md:px-14 py-12 md:py-20">
                <DialogHeader className="text-center pb-4">
                    <DialogTitle className="text-center text-3xl font-bold text-white mb-5">Sign-In to your account</DialogTitle>
                    <p className="text-center text-[#C0C0C0] text-sm md:text-base">Welcome back! Please enter your details</p>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white text-base font-medium">Email Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your email"
                                            className="h-14 bg-white border-0 text-[#B2BAC6] text-sm md:text-base rounded-lg"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white text-base font-medium">Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                className="h-14 bg-white border-0 text-gray-500 placeholder:text-gray-400 text-lg rounded-lg pr-12"
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 h-auto p-0 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                                ) : (
                                                    <Eye className="h-5 w-5 text-gray-400" />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center justify-between">
                            <FormField
                                control={form.control}
                                name="rememberMe"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="border-gray-400 data-[state=checked]:bg-[#791B87] data-[state=checked]:border-[#791B87]"
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-white text-xs font-normal">Remember me</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button type="button" variant="link" className="text-xs text-[#4D81E7] p-0 h-auto font-normal">
                                Forgot Password ?
                            </Button>
                        </div>

                        <Button type="submit" className="w-full" variant={"default"} size={"lg"}>
                            Sign-In
                        </Button>
                    </form>
                </Form>

                <div className="text-center">
                    <p className="text-gray-400 text-sm">
                        {"Don't have an account? "}
                        <Button
                            type="button"
                            variant="link"
                            className="text-[#4D81E7] hover:text-blue-300 p-0 h-auto font-normal text-sm"
                            onClick={handleSwitchToSignUp}
                        >
                            Sign up here
                        </Button>
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
