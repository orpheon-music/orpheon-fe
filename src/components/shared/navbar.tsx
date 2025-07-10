import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
    return (
        <nav className="fixed bottom-10 left-0 right-0 z-[9999] backdrop-blur-md">
            <div className="container">
                <div className="flex justify-between items-center">
                    <Link href={"/"} className='hidden md:block'>
                        <Image alt="Orpheon Logo" src={"/assets/images/logo_nav.png"} width={200} height={88} className="" />
                    </Link>
                    <div className="hidden md:flex items-center space-x-32 bg-[#010101]/15 rounded-[72px] px-12 py-6">
                        <div className='md:flex items-center space-x-8'>
                            <a href="#" className="text-white hover:text-pink-400 transition-colors duration-200 font-medium">
                                Home
                            </a>
                            <a href="#" className="text-white/70 hover:text-pink-400 transition-colors duration-200 font-medium">
                                About
                            </a>
                            <a href="#" className="text-white/70 hover:text-pink-400 transition-colors duration-200 font-medium">
                                Sample
                            </a>
                            <a href="#" className="text-white/70 hover:text-pink-400 transition-colors duration-200 font-medium">
                                Pricing
                            </a>
                        </div>
                        <div className='flex items-center gap-4'>
                            <span>
                                Get Started
                            </span>
                            <Button className="bg-white w-14 h-14 flex justify-center items-center text-black hover:bg-gray-200 transition-all duration-200 font-semibold px-6 py-2 rounded-full">
                                <ArrowUpRight className="h-4 w-4" />
                            </Button>
                        </div>

                    </div>
                    <div className='hidden xl:block' />

                </div>

            </div>

        </nav>
    )
}
