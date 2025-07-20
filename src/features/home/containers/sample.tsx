"use client"

import React, { useEffect, useRef, useState } from 'react'
import Disk from "@/assets/images/home/sample-disk.png"
import Ellipse from "@/assets/images/home/ellipse-sample.png"
import Image from 'next/image'
import { cn } from '@/lib/utils'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Sample() {
  const [selected, setSelected] = useState<"AI-Assisted" | "Original">("AI-Assisted")
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sample-anim",
        { opacity: 0, y: 40 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true, 
          },
          opacity: 1,
          y: 0,
          duration: 4,
          stagger: 0.7,
          ease: "power3.out",
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id='sample'
      ref={sectionRef}
      className='mt-20 md:mt-52 bg-black py-20 overflow-hidden'
    >
      <div className='flex justify-center items-center flex-col gap-8 z-30'>
        <div className='flex gap-2 items-center py-2 px-4 border border-white sample-anim'>
          <div className='w-8 h-8 bg-white rounded-full' />
          <span className='text-sm md:text-base text-[F8F8FF]'>Sample</span>
        </div>
        <div className='flex flex-col gap-4 items-center sample-anim'>
          <h1 className='text-[30px] md:text-[54px] text-white text-center'>Music Sample</h1>
          <p className='text-[#A1A4A7] text-lg md:text-2xl max-w-[640px] text-center'>
            Listen to how our innovative technology transforms raw audio into polished tracks,
            showcasing clarity and depth that elevates your sound to professional standards.
          </p>
        </div>
        <div className="flex items-center justify-center relative z-90 sample-anim">
          <div className="flex rounded-3xl border border-white/30 bg-white/5 p-1 backdrop-blur-sm">
            {["AI-Assisted", "Original"].map((label) => (
              <button
                key={label}
                onClick={() => setSelected(label as "AI-Assisted" | "Original")}
                className={cn(
                  "px-6 py-6 text-sm font-medium rounded-3xl transition-all duration-300",
                  selected === label
                    ? "bg-white/12 text-white shadow-inner"
                    : "text-white/80"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className='flex justify-center items-center relative mt-16'>
        <Image
          src={Disk}
          alt="Sample Disk"
          className='z-30 animate-spin-slow'
        />
        <Image
          src={Ellipse}
          alt="Sample Ellipse"
          className='absolute z-10'
        />
      </div>
    </section>
  )
}
