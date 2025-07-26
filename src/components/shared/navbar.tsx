"use client"

import { ArrowUpRight } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { default as Link, default as NextLink } from "next/link"
import { useState } from "react"
import { Link as ScrollLink } from "react-scroll"
import SignInModal from "../../features/auth/components/sign-in-modal"
import SignUpModal from "../../features/auth/components/sign-up-modal"
import { Button } from "../ui/button"

export default function Navbar() {
    const session = useSession()

    const [signInOpen, setSignInOpen] = useState(false)
    const [signUpOpen, setSignUpOpen] = useState(false)

    const handleSwitchToSignUp = () => {
        setSignInOpen(false)
        setSignUpOpen(true)
    }

    const handleSwitchToSignIn = () => {
        setSignUpOpen(false)
        setSignInOpen(true)
    }

    return (
        <nav className="fixed bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 left-0 right-0 z-[999]">
            <div className="container relative px-2 sm:px-4 md:px-6">
                <div className="flex justify-between items-center relative">
                    {/* Logo kiri */}
                    <NextLink href={"/"} className="block sm:block md:block lg:block">
                        {/* Logo untuk mobile (tanpa text) */}
                        <Image
                            alt="Orpheon Logo"
                            src={"/assets/images/logo-nav-without-text.png"}
                            width={44}
                            height={44}
                            className="w-[44px] h-[44px] xl:hidden"
                        />
                        {/* Logo untuk sm ke atas (dengan text) */}
                        <Image
                            alt="Orpheon Logo"
                            src={"/assets/images/logo_nav.png"}
                            width={100}
                            height={44}
                            className="hidden xl:block sm:w-[120px] sm:h-[52px] md:w-[150px] md:h-[66px] lg:w-[190px] lg:h-[83px]"
                        />
                    </NextLink>

                    {/* Navlink di tengah */}
                    {session.status !== "authenticated" ? (
                        <div className="flex-1 flex justify-center sm:absolute sm:left-1/2 h-10 sm:h-12 md:h-14 lg:h-16 sm:-translate-x-1/2">
                            <div className="flex items-center space-x-4 sm:space-x-8 md:space-x-16 lg:space-x-32 bg-[#010101]/15 rounded-[36px] sm:rounded-[48px] md:rounded-[60px] lg:rounded-[72px] px-3 py-2 sm:px-6 sm:py-3 md:px-9 md:py-4 lg:px-12 lg:py-6">
                                <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8">
                                    <ScrollLink
                                        to="hero"
                                        smooth={true}
                                        duration={500}
                                        offset={-70}
                                        className="cursor-pointer text-white hover:text-pink-400 transition-colors duration-200 font-medium text-xs sm:text-xs md:text-sm lg:text-base"
                                    >
                                        Home
                                    </ScrollLink>
                                    <ScrollLink
                                        to="about"
                                        smooth={true}
                                        duration={500}
                                        offset={-70}
                                        className="cursor-pointer text-white/70 hover:text-pink-400 transition-colors duration-200 font-medium text-xs sm:text-xs md:text-sm lg:text-base"
                                    >
                                        About
                                    </ScrollLink>
                                    <ScrollLink
                                        to="sample"
                                        smooth={true}
                                        duration={500}
                                        offset={-70}
                                        className="cursor-pointer text-white/70 hover:text-pink-400 transition-colors duration-200 font-medium text-xs sm:text-xs md:text-sm lg:text-base"
                                    >
                                        Sample
                                    </ScrollLink>
                                    <ScrollLink
                                        to="pricing"
                                        smooth={true}
                                        duration={500}
                                        offset={150}
                                        className="cursor-pointer text-white/70 hover:text-pink-400 transition-colors duration-200 font-medium text-xs sm:text-xs md:text-sm lg:text-base"
                                    >
                                        Pricing
                                    </ScrollLink>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 text-white">
                                    {/* Sign In Button */}
                                    <SignInModal
                                        open={signInOpen}
                                        onOpenChange={setSignInOpen}
                                        onSwitchToSignUp={handleSwitchToSignUp}
                                        trigger={
                                            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 cursor-pointer whitespace-nowrap">
                                                <span className="text-sm hidden sm:block">Get Started</span>
                                                <Button className="bg-white w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex justify-center items-center text-black hover:bg-gray-200 transition-all duration-200 font-semibold rounded-full">
                                                    <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </Button>
                                            </div>
                                        }
                                    />
                                    <SignUpModal open={signUpOpen} onOpenChange={setSignUpOpen} onSwitchToSignIn={handleSwitchToSignIn} trigger={<div></div>} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex justify-center sm:absolute sm:left-1/2 h-10 sm:h-12 md:h-14 lg:h-16 sm:-translate-x-1/2">
                            <div className="flex items-center space-x-4 sm:space-x-8 md:space-x-16 lg:space-x-32 bg-[#010101]/15 rounded-[36px] sm:rounded-[48px] md:rounded-[60px] lg:rounded-[72px] px-3 py-2 sm:px-6 sm:py-3 md:px-9 md:py-4 lg:px-12 lg:py-6">
                                <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8">
                                    <Link href={"/mastering"} className="text-white hover:text-pink-400 transition-colors duration-200 font-medium text-xs sm:text-xs md:text-sm lg:text-base">
                                        Mastering
                                    </Link>
                                    <Link href={"/library"} className="text-white hover:text-pink-400 transition-colors duration-200 font-medium text-xs sm:text-xs md:text-sm lg:text-base">
                                        Library
                                    </Link>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 text-white">
                                    <Link href={"/signout"} className="flex items-center gap-1 sm:gap-2 md:gap-3 cursor-pointer">
                                        <span className="hidden sm:block text-sm">Sign Out</span>
                                        <Button className="bg-white w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex justify-center items-center text-black hover:bg-gray-200 transition-all duration-200 font-semibold rounded-full">
                                            <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder kanan biar space seimbang - hanya muncul di sm ke atas */}
                    <div className="hidden sm:block w-[44px] sm:w-[120px] md:w-[150px] lg:w-[190px]" />
                </div>
            </div>
        </nav>
    )
}