"use client"

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import EllipseHeroBottom from "@/assets/images/home/ellips-hero-bottom.png"

export default function Hero() {
    const heroRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".hero-text", {
                opacity: 0,
                y: 40,
            }, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                stagger: 0.3,
            })

            gsap.fromTo(".hero-ellipse", {
                opacity: 0,
                y: 50,
            }, {
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: "power3.out",
                delay: 1,
            })

            gsap.fromTo(".hero-video", {
                scale: 1.05,
                opacity: 0,
            }, {
                scale: 1,
                opacity: 1,
                duration: 2,
                ease: "power2.out",
            })
        }, heroRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={heroRef}
            id='hero'
            style={{
                position: "relative",
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
            }}
        >
            {/* Video Background */}
            <video
                src="/assets/videos/landing_video.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="hero-video absolute top-0 left-0 w-screen h-screen 2xl:h-[80vh] object-cover z-[1]"
            />

            {/* Overlay Gradient */}
            <div className="absolute top-0 left-0 w-full h-full z-[2] bg-gradient-to-b from-[rgba(17,17,17,0.25)] to-[rgba(17,17,17,0.25)]" />

            {/* Content */}
            <div className="container flex items-end relative z-[30] h-[80vh]">
                <div className="flex justify-between flex-col gap-4 xl:flex-row w-full mb-5">
                    <div className="flex flex-col max-w-xl">
                        <div className="hero-text text-[#FF12D8] text-base">Orpheon</div>
                        <h1 className="hero-text font-bold text-[24px] md:text-[54px] text-white">
                            Revolutionize Your Music
                            with AI
                        </h1>
                    </div>

                    <div className="flex flex-col gap-6 max-w-xl">
                        <p className="hero-text text-gray-300 text-sm md:text-base leading-relaxed">
                            Unleash the full potential of your music with our cutting-edge AI mastering technology. Experience a new
                            dimension of sonic clarity and impact.
                        </p>

                        <Button
                            variant="outline"
                            size="lg"
                            className="hero-text w-fit px-16 py-6 rounded-none bg-transparent border-[#F8F8FF] text-white hover:bg-[#F8F8FF] hover:text-black transition-all duration-300"
                        >
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>

            {/* Bottom Ellipse Image */}
            <Image
                src={EllipseHeroBottom}
                alt="Ellipse Hero Bottom"
                className="hero-ellipse absolute bottom-0 left-0 w-full h-auto z-[20]"
            />
        </section>
    )
}
