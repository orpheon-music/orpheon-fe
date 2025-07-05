import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { ArrowUpRight } from 'lucide-react'

export default function Navbar() {
    return (
        <nav className="fixed bottom-10 left-0 right-0 z-[9999] backdrop-blur-md">
            <div className="container">
                <div className="flex justify-between items-center">
                    <Image alt="Orpheon Logo" src={"/assets/images/logo_nav.png"} width={200} height={88} className="" />

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
                        <Button className="bg-white text-black hover:bg-gray-200 transition-all duration-200 font-semibold px-6 py-2 rounded-full">
                            Get Started
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                    <div className='block'/>

                </div>

            </div>

        </nav>
    )
}
