"use client"

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
    rememberMe: z.boolean(),
})

interface SignUpModalProps {
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
    onSwitchToSignIn?: () => void
}

export default function SignUpModal({
    trigger,
    open: controlledOpen,
    onOpenChange,
    onSwitchToSignIn,
}: SignUpModalProps = {}) {
    const [showPassword, setShowPassword] = useState(false)
    const [internalOpen, setInternalOpen] = useState(false)

    // Use controlled open state if provided, otherwise use internal state
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen
    const setOpen = onOpenChange || setInternalOpen

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            rememberMe: false,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Register values:", values)
    }

    const handleSwitchToSignIn = () => {
        if (onSwitchToSignIn) {
            onSwitchToSignIn()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button size="lg" variant="default" className="bg-[#791B87]">
                        Register
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md md:max-w-xl border-[#EFEFEF] bg-white/05 rounded-3xl text-white px-8 md:px-14 py-12 md:py-20">
                <DialogHeader className="text-center pb-4">
                    <DialogTitle className="text-center text-3xl font-bold text-white mb-5">Create your account</DialogTitle>
                    <p className="text-center text-[#C0C0C0] text-sm md:text-base">Start your journey with us</p>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white text-base font-medium">Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your name"
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
                                                placeholder="Create a password"
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
                        </div>

                        <Button type="submit" className="w-full" variant={"default"} size={"lg"}>
                            Register
                        </Button>
                    </form>
                </Form>

                <div className="text-center">
                    <p className="text-gray-400 text-sm">
                        {"Already have an account? "}
                        <Button
                            type="button"
                            variant="link"
                            className="text-[#4D81E7] hover:text-blue-300 p-0 h-auto font-normal text-sm"
                            onClick={handleSwitchToSignIn}
                        >
                            Sign in here
                        </Button>
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
