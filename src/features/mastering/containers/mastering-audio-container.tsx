"use client"
import React, { useState, useRef, useEffect } from 'react'
import AudioPlayer from '../components/audio-player'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Knob from "@/assets/images/mastering/knob.png"
import Image from 'next/image'

export default function MasteringAudioContainer() {
    const [selected, setSelected] = useState<"AI-Assisted" | "Manual">("AI-Assisted")
    const [rotation, setRotation] = useState(0)
    const isDragging = useRef(false)
    const lastAngle = useRef(0)
    const center = useRef({ x: 0, y: 0 })

    const clamp = (value: number, min: number, max: number) => {
        return Math.min(Math.max(value, min), max)
    }

    const getAngle = (x: number, y: number) => {
        const dx = x - center.current.x
        const dy = y - center.current.y
        return Math.atan2(dy, dx) * (180 / Math.PI)
    }

    const getKnobMode = (rotation: number): "Dynamic" | "Standard" | "Smooth" => {
        if (rotation < -40) return "Dynamic"
        if (rotation > 40) return "Standard"
        return "Smooth"
    }


    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        setRotation(prev => clamp(prev + (e.deltaY < 0 ? 5 : -5), -120, 120))
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        center.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        isDragging.current = true
        lastAngle.current = getAngle(e.clientX, e.clientY)
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return
        const angle = getAngle(e.clientX, e.clientY)
        const delta = angle - lastAngle.current
        setRotation(prev => clamp(prev + delta, -90, 90))
        lastAngle.current = angle
    }

    const handleMouseUp = () => {
        isDragging.current = false
    }

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        center.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        isDragging.current = true
        const touch = e.touches[0]
        lastAngle.current = getAngle(touch.clientX, touch.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging.current) return
        const touch = e.touches[0]
        const angle = getAngle(touch.clientX, touch.clientY)
        const delta = angle - lastAngle.current
        setRotation(prev => clamp(prev + delta, -90, 90))
        lastAngle.current = angle
    }

    const handleTouchEnd = () => {
        isDragging.current = false
    }

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
        document.addEventListener("touchmove", handleTouchMove)
        document.addEventListener("touchend", handleTouchEnd)
        return () => {
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
            document.removeEventListener("touchmove", handleTouchMove)
            document.removeEventListener("touchend", handleTouchEnd)
        }
    }, [])

    return (
        <section
            className="min-h-screen bg-cover bg-center py-10 md:pt-20 md:pb-40 flex flex-col items-center justify-center gap-12"
            style={{ backgroundImage: 'url("/authenticated-bg.png")' }}
        >
            <div className='flex justify-between items-center container'>
                <span>file.mp3</span>
                <div className='flex gap-6'>
                    <Button variant={"outline"}>Delete</Button>
                    <Button variant={"white"}>Save</Button>
                </div>
            </div>

            <AudioPlayer url="http://localhost:3000/standard.wav" />

            {/* Mode Toggle */}
            <div className="flex rounded-3xl border border-white/30 bg-white/5 p-1 backdrop-blur-sm justify-center items-center w-fit self-center">
                {["AI-Assisted", "Manual"].map((label) => (
                    <button
                        key={label}
                        onClick={() => setSelected(label as "AI-Assisted" | "Manual")}
                        className={cn(
                            "px-6 py-6 cursor-pointer text-sm rounded-3xl transition-all duration-300",
                            selected === label
                                ? "bg-white/12 text-white shadow-inner"
                                : "text-white/80"
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Knob Section */}
            <div className='container max-w-md mx-auto'>
                <div className='relative flex flex-col items-center space-y-4'>
                    <div className='text-white text-sm md:text-base font-medium'>
                        Smooth
                    </div>

                    <div
                        onWheel={handleWheel}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                        className='relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center cursor-pointer select-none'
                    >
                        <Image
                            draggable={false}
                            src={Knob}
                            alt="Knob"
                            className='w-full h-full object-contain transition-transform duration-100 ease-out'
                            style={{ transform: `rotate(${rotation}deg)` }}
                        />
                    </div>

                    <div className="text-white font-semibold text-base">
                        Mode: {getKnobMode(rotation)}
                    </div>

                    <div className='absolute top-1/2 flex justify-between items-center w-full max-w-xs md:max-w-sm px-4'>
                        <span className='text-white text-sm md:text-base font-medium'>
                            Dynamic
                        </span>
                        <span className='text-white text-sm md:text-base font-medium'>
                            Standard
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
