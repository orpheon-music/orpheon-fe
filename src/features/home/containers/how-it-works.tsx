"use client"

import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Step1 from "@/assets/images/home/hiw-step1.png"
import Step2 from "@/assets/images/home/hiw-step2.png"
import Step3 from "@/assets/images/home/hiw-step3.png"
import Ellipse1 from "@/assets/images/home/hiw-ellipse.png"
import Ellipse2 from "@/assets/images/home/hiw-ellipse2.png"
import EllipseHeroBottom from "@/assets/images/home/ellips-hero-bottom.png"

gsap.registerPlugin(ScrollTrigger)

const steps = [
    { image: Step1, title: "Record Your Part", desc: "Feel free to express yourself freely..." },
    { image: Step2, title: "Let Us Do The Job", desc: "Let our AI take care of your sound mastering!" },
    { image: Step3, title: "Share and Shine!", desc: "Experience the new joy of sharing your unique and professionally mastered audio!" },
]

export default function HowItWorks() {
    const sectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Title and Description
            gsap.fromTo([".hiw-title", ".hiw-description"], {
                opacity: 0,
                y: 40,
            }, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                },
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
            })

            // Steps
            gsap.fromTo(".hiw-step", {
                opacity: 0,
                y: 50,
            }, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 60%",
                },
                opacity: 1,
                y: 0,
                duration: 4,
                stagger: 0.4,
                delay: 1,
                ease: "power3.out",
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} id='about' className='py-12 flex flex-col gap-9 relative'>
            <Image src={EllipseHeroBottom} alt="Ellipse Hero Bottom" className="absolute rotate-180 top-0 left-0 w-full h-auto z-[20]" />
            <Image src={Ellipse1} alt='' className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
            <Image src={Ellipse2} alt="" className="opacity-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30" />

            <div className="container flex items-end gap-10 xl:gap-20 justify-between z-20">
                <div className="flex flex-col gap-6 items-start">
                    <div className="border-[#767B7E] px-3 py-2 border flex gap-2.5 items-center ">
                        <div className="bg-[#FF12D8] rounded-full w-7 h-7" />
                        <span className="hiw-title ">How It Works</span>
                    </div>
                    <h1 className="hiw-title text-6xl font-space-grotesk">Everyone Is a Singer</h1>
                    <p className="hiw-description text-[#CECECE] text-sm md:text-base leading-relaxed">
                        Our AI-powered mastering tool transforms raw vocals into studio-quality sound, instantly...
                    </p>
                </div>
                <hr className="h-[1px] w-full max-w-[900px]" />
            </div>

            <div className='container grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mt-12 z-30'>
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="hiw-step relative overflow-hidden aspect-square shadow-xl w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] xl:max-w-[420px] mx-auto"
                    >
                        <Image
                            src={step.image}
                            alt={step.title}
                            fill
                            className="object-cover absolute z-0"
                        />
                        <div className="relative z-20 flex flex-col justify-end h-full p-6 text-white">
                            <div className="backdrop-blur-md bg-[#595959]/[0.04] p-4">
                                <h3 className="text-xl md:text-2xl font-bold mb-2 font-space-grotesk">{step.title}</h3>
                                <p className="text-sm md:text-base text-[#BEBEBE]">{step.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
