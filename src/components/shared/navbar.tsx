"use client"

import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { ArrowUpRight } from 'lucide-react'
import NextLink from 'next/link'
import { Link as ScrollLink } from 'react-scroll'

export default function Navbar() {
    return (
        <nav className="fixed bottom-10 left-0 right-0 z-[9999] backdrop-blur-md">
            <div className="container relative">
                <div className="flex justify-between items-center relative">
                    {/* Logo kiri */}
                    <NextLink href={"/"} className='hidden md:block'>
                        <Image alt="Orpheon Logo" src={"/assets/images/logo_nav.png"} width={200} height={88} />
                    </NextLink>

                    {/* Navlink di tengah */}
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
                        <div className="flex items-center space-x-32 bg-[#010101]/15 rounded-[72px] px-12 py-6">
                            <div className='flex items-center space-x-8'>
                                <ScrollLink
                                    to="hero"
                                    smooth={true}
                                    duration={500}
                                    offset={-70}
                                    className="cursor-pointer text-white hover:text-pink-400 transition-colors duration-200 font-medium"
                                >
                                    Home
                                </ScrollLink>
                                <ScrollLink
                                    to="about"
                                    smooth={true}
                                    duration={500}
                                    offset={-70}
                                    className="cursor-pointer text-white/70 hover:text-pink-400 transition-colors duration-200 font-medium"
                                >
                                    About
                                </ScrollLink>
                                <ScrollLink
                                    to="sample"
                                    smooth={true}
                                    duration={500}
                                    offset={-70}
                                    className="cursor-pointer text-white/70 hover:text-pink-400 transition-colors duration-200 font-medium"
                                >
                                    Sample
                                </ScrollLink>
                                <ScrollLink
                                    to="pricing"
                                    smooth={true}
                                    duration={500}
                                    offset={150}
                                    className="cursor-pointer text-white/70 hover:text-pink-400 transition-colors duration-200 font-medium"
                                >
                                    Pricing
                                </ScrollLink>
                            </div>
                            <div className='flex items-center gap-4 text-white'>
                                <span>Get Started</span>
                                <Button className="bg-white w-14 h-14 flex justify-center items-center text-black hover:bg-gray-200 transition-all duration-200 font-semibold px-6 py-2 rounded-full">
                                    <ArrowUpRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Placeholder kanan biar space seimbang */}
                    <div className='hidden md:block w-[200px]' />
                </div>
            </div>
        </nav>
    )
}
