"use client"
import Knob from "@/assets/images/mastering/knob.png"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { api } from "@/lib/axios"
import { FE_URL } from "@/lib/env"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import AudioPlayer from "../components/audio-player"
import { useGetAudioProcessingById } from "../services/use-get-audio-processing-by-id"

export default function MasteringAudioContainer() {
    const { id } = useParams<{ id: string }>()
    const { data, isLoading } = useGetAudioProcessingById(id)

    const [selected, setSelected] = useState<"AI-Assisted" | "Manual">("AI-Assisted")

    // Separate rotation states for each knob
    const [aiKnobRotation, setAiKnobRotation] = useState(0)
    const [loudnessRotation, setLoudnessRotation] = useState(0)
    const [stereoWidthRotation, setStereoWidthRotation] = useState(0)

    // Dragging states for each knob
    const isDraggingAi = useRef(false)
    const isDraggingLoudness = useRef(false)
    const isDraggingStereoWidth = useRef(false)

    const lastAngle = useRef(0)
    const center = useRef({ x: 0, y: 0 })

    const [highEq, setHighEq] = useState([0])
    const [mediumEq, setMediumEq] = useState([0])
    const [lowEq, setLowEq] = useState([0])
    const [denoise, setDenoise] = useState([0])
    const [autotune, setAutotune] = useState([0])

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

    // const getLoudnessMode = (rotation: number): "Natural" | "Normal" | "Max" => {
    //     if (rotation < -40) return "Natural"
    //     if (rotation > 40) return "Max"
    //     return "Normal"
    // }

    const getStereoWidthValue = (rotation: number): number => {
        // Map rotation (-90 to 90) to stereo width (-30 to 30)
        return Math.round((rotation / 90) * 30)
    }

    const getLoudnessValue = (rotation: number): number => {
        // Map rotation (-90 to 90) to dB (-20 to +20)
        return (rotation / 90) * 20
    }

    // AI Knob handlers
    const handleAiWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        setAiKnobRotation((prev) => clamp(prev + (e.deltaY < 0 ? 5 : -5), -120, 120))
    }

    const handleAiMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        center.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        isDraggingAi.current = true
        lastAngle.current = getAngle(e.clientX, e.clientY)
    }

    const handleAiTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        center.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        isDraggingAi.current = true
        const touch = e.touches[0]
        lastAngle.current = getAngle(touch.clientX, touch.clientY)
    }

    // Loudness Knob handlers
    const handleLoudnessWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        setLoudnessRotation((prev) => clamp(prev + (e.deltaY < 0 ? 5 : -5), -90, 90))
    }

    const handleLoudnessMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        center.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        isDraggingLoudness.current = true
        lastAngle.current = getAngle(e.clientX, e.clientY)
    }

    const handleLoudnessTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        center.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        isDraggingLoudness.current = true
        const touch = e.touches[0]
        lastAngle.current = getAngle(touch.clientX, touch.clientY)
    }

    // Stereo Width Knob handlers
    const handleStereoWidthWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        setStereoWidthRotation((prev) => clamp(prev + (e.deltaY < 0 ? 5 : -5), -90, 90))
    }

    const handleStereoWidthMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        center.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        isDraggingStereoWidth.current = true
        lastAngle.current = getAngle(e.clientX, e.clientY)
    }

    const handleStereoWidthTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        center.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        isDraggingStereoWidth.current = true
        const touch = e.touches[0]
        lastAngle.current = getAngle(touch.clientX, touch.clientY)
    }



    const handleMouseUp = () => {
        isDraggingAi.current = false
        isDraggingLoudness.current = false
        isDraggingStereoWidth.current = false
    }

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const angle = getAngle(e.clientX, e.clientY)
        const delta = angle - lastAngle.current

        if (isDraggingAi.current) {
            setAiKnobRotation((prev) => clamp(prev + delta, -90, 90))
        } else if (isDraggingLoudness.current) {
            setLoudnessRotation((prev) => clamp(prev + delta, -90, 90))
        } else if (isDraggingStereoWidth.current) {
            setStereoWidthRotation((prev) => clamp(prev + delta, -90, 90))
        }

        lastAngle.current = angle
    }, []) // no dependencies because refs and state setters are stable

    const handleTouchMove = useCallback((e: TouchEvent) => {
        const touch = e.touches[0]
        const angle = getAngle(touch.clientX, touch.clientY)
        const delta = angle - lastAngle.current

        if (isDraggingAi.current) {
            setAiKnobRotation((prev) => clamp(prev + delta, -90, 90))
        } else if (isDraggingLoudness.current) {
            setLoudnessRotation((prev) => clamp(prev + delta, -90, 90))
        } else if (isDraggingStereoWidth.current) {
            setStereoWidthRotation((prev) => clamp(prev + delta, -90, 90))
        }

        lastAngle.current = angle
    }, [])

    const handleTouchEnd = () => {
        isDraggingAi.current = false
        isDraggingLoudness.current = false
        isDraggingStereoWidth.current = false
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
    }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])
    const router = useRouter()

    // const { mutate } = useSaveAudio(id)
    const handleSave = async () => {
        const type = getKnobMode(aiKnobRotation).toLowerCase() as "smooth" | "dynamic" | "standard"
        const formData = new FormData()
        formData.append("type", type)
        const response = await api.put(`/audio-processing/${id}`, formData, {
            headers: {
            "Content-Type": "multipart/form-data"
            }
        })
        if (response.status !== 200) {
            toast.error("Failed to save audio.")
            return
        }
        toast.success("Audio saved successfully!")
        router.push("/library")
        // await mutate({ type }, {
        //     onSuccess: () => {
        //         toast.success("Audio saved successfully!")
        //         router.push("/library")
        //     },
        //     onError: (error) => {
        //         console.log(error)
        //         toast.error("Failed to save audio.")
        //     },
        // })
    }

    return (
        <section
            className="min-h-screen bg-cover bg-center py-10 md:pt-20 md:pb-40 flex flex-col items-center justify-center gap-12"
            style={{ backgroundImage: 'url("/authenticated-bg.png")' }}
        >
            <div className="flex justify-between items-center container">
                <span className="font-space-groteskf">{isLoading ? "Loading..." : `${data?.audio_processing.name}`}</span>
                <div className="flex gap-6">
                    <Button variant={"outline"}>Delete</Button>
                    <Button variant={"white"} onClick={handleSave}>Save</Button>
                </div>
            </div>

            {/* Audio Player */}
            {
                !isLoading && (
                    <AudioPlayer
                        url={`${FE_URL}/standard.wav`}
                        highEq={highEq[0]}
                        mediumEq={mediumEq[0]}
                        lowEq={lowEq[0]}
                        loudness={(loudnessRotation / 90) * 20}
                        stereoWidth={getStereoWidthValue(stereoWidthRotation)}
                    />
                )
            }

            {/* Mode Toggle */}
            <div className="flex rounded-3xl border border-white/30 bg-white/5 p-1 backdrop-blur-sm justify-center items-center w-fit self-center">
                {["AI-Assisted", "Manual"].map((label) => (
                    <button
                        key={label}
                        onClick={() => setSelected(label as "AI-Assisted" | "Manual")}
                        className={cn(
                            "px-6 py-6 cursor-pointer text-sm rounded-3xl transition-all duration-300",
                            selected === label ? "bg-white/12 text-white shadow-inner" : "text-white/80",
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Knob Section */}
            {selected === "AI-Assisted" ? (
                <div className="container max-w-md mx-auto">
                    <div className="relative flex flex-col items-center space-y-4">
                        <div className="text-white text-sm md:text-base font-medium">Smooth</div>
                        <div
                            onWheel={handleAiWheel}
                            onMouseDown={handleAiMouseDown}
                            onTouchStart={handleAiTouchStart}
                            className="relative w-48 h-48 md:w-48 md:h-48 flex items-center justify-center cursor-pointer select-none"
                        >
                            <Image
                                draggable={false}
                                src={Knob || "/placeholder.svg"}
                                alt="Knob"
                                className="w-full h-full object-contain transition-transform duration-100 ease-out"
                                style={{ transform: `rotate(${aiKnobRotation}deg)` }}
                            />
                        </div>
                        <div className="text-white font-semibold text-base">Mode: {getKnobMode(aiKnobRotation)}</div>
                        <div className="absolute top-1/2 flex justify-between items-center w-full max-w-xs md:max-w-sm px-4">
                            <span className="text-white text-sm md:text-base font-medium">Dynamic</span>
                            <span className="text-white text-sm md:text-base font-medium">Standard</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl w-full container">
                    {/* Equalizer Section */}
                    <Card className="bg-[rgba(255,255,255,0.05)] backdrop-blur-sm border border-[rgba(255,255,255,0.5)] rounded-3xl p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-white text-2xl font-light tracking-[0.3em] mb-8">EQUALIZER</h2>
                            <div className="flex justify-center items-end space-x-12">
                                {/* High Frequency */}
                                <div className="flex flex-col items-center">
                                    <div className="text-white text-sm mb-4 font-light">High</div>
                                    <div className="text-white/60 text-xs mb-2">+{highEq[0]}</div>
                                    <div className="h-48 flex items-center">
                                        <Slider
                                            value={highEq}
                                            onValueChange={setHighEq}
                                            max={15}
                                            min={-15}
                                            step={1}
                                            orientation="vertical"
                                            className="h-40"
                                        />
                                    </div>
                                    <div className="text-white/60 text-xs mt-2">-15</div>
                                </div>

                                {/* Medium Frequency */}
                                <div className="flex flex-col items-center">
                                    <div className="text-white text-sm mb-4 font-light">Medium</div>
                                    <div className="text-white/60 text-xs mb-2">+{mediumEq[0]}</div>
                                    <div className="h-48 flex items-center">
                                        <Slider
                                            value={mediumEq}
                                            onValueChange={setMediumEq}
                                            max={15}
                                            min={-15}
                                            step={1}
                                            orientation="vertical"
                                            className="h-40"
                                        />
                                    </div>
                                    <div className="text-white/60 text-xs mt-2">-15</div>
                                </div>

                                {/* Low Frequency */}
                                <div className="flex flex-col items-center">
                                    <div className="text-white text-sm mb-4 font-light">Low</div>
                                    <div className="text-white/60 text-xs mb-2">+{lowEq[0]}</div>
                                    <div className="h-48 flex items-center">
                                        <Slider
                                            value={lowEq}
                                            onValueChange={setLowEq}
                                            max={15}
                                            min={-15}
                                            step={1}
                                            orientation="vertical"
                                            className="h-40"
                                        />
                                    </div>
                                    <div className="text-white/60 text-xs mt-2">-15</div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="space-y-6">
                        {/* Denoise Section */}
                        <Card className="bg-[rgba(255,255,255,0.05)] backdrop-blur-sm border border-[rgba(255,255,255,0.5)] rounded-3xl p-8">
                            <div className="text-center">
                                <h2 className="text-white text-2xl font-light tracking-[0.3em] mb-8">DENOISE</h2>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-white/60 text-sm">-15</span>
                                    <span className="text-white/60 text-sm">+15</span>
                                </div>
                                <Slider value={denoise} onValueChange={setDenoise} max={15} min={-15} step={1} className="w-full" />
                            </div>
                        </Card>

                        {/* Autotune Section */}
                        <Card className="bg-[rgba(255,255,255,0.05)] backdrop-blur-sm border border-[rgba(255,255,255,0.5)] rounded-3xl p-8">
                            <div className="text-center">
                                <h2 className="text-white text-2xl font-light tracking-[0.3em] mb-8">AUTOTUNE</h2>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-white/60 text-sm">-15</span>
                                    <span className="text-white/60 text-sm">+15</span>
                                </div>
                                <Slider value={autotune} onValueChange={setAutotune} max={15} min={-15} step={1} className="w-full" />
                            </div>
                        </Card>
                    </div>

                    {/* Loudness Section */}
                    <div className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.5)] rounded-3xl p-8 flex items-center justify-center">
                        <div className="container max-w-md mx-auto">
                            <h2 className="text-center text-white text-2xl font-light tracking-[0.3em] mb-8">LOUDNESS</h2>
                            <div className="relative flex flex-col items-center space-y-4">
                                <div className="text-white text-sm md:text-base font-medium">Normal</div>
                                <div
                                    onWheel={handleLoudnessWheel}
                                    onMouseDown={handleLoudnessMouseDown}
                                    onTouchStart={handleLoudnessTouchStart}
                                    className="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center cursor-pointer select-none"
                                >
                                    <Image
                                        draggable={false}
                                        src={Knob || "/placeholder.svg"}
                                        alt="Loudness Knob"
                                        className="w-full h-full object-contain transition-transform duration-100 ease-out"
                                        style={{ transform: `rotate(${loudnessRotation}deg)` }}
                                    />
                                </div>
                                <div className="text-white font-semibold text-base">
                                    Value: {getLoudnessValue(loudnessRotation).toFixed(1)} dB
                                </div>
                                <div className="absolute top-1/2 flex justify-between items-center w-full max-w-xs md:max-w-md px-0">
                                    <span className="text-white text-sm md:text-base font-medium">Natural</span>
                                    <span className="text-white text-sm md:text-base font-medium">Max</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stereo Width Section */}
                    <div className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.5)] rounded-3xl p-8 flex items-center justify-center">
                        <div className="container max-w-md mx-auto">
                            <h2 className="text-center text-white text-2xl font-light tracking-[0.3em] mb-8">STEREO WIDTH</h2>
                            <div className="relative flex flex-col items-center space-y-4">
                                <div className="text-white text-sm md:text-base font-medium">
                                    0
                                </div>
                                <div
                                    onWheel={handleStereoWidthWheel}
                                    onMouseDown={handleStereoWidthMouseDown}
                                    onTouchStart={handleStereoWidthTouchStart}
                                    className="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center cursor-pointer select-none"
                                >
                                    <Image
                                        draggable={false}
                                        src={Knob || "/placeholder.svg"}
                                        alt="Stereo Width Knob"
                                        className="w-full h-full object-contain transition-transform duration-100 ease-out"
                                        style={{ transform: `rotate(${stereoWidthRotation}deg)` }}
                                    />
                                </div>
                                <div className="text-white font-semibold text-base">
                                    Width: {getStereoWidthValue(stereoWidthRotation)}
                                </div>
                                <div className="absolute top-1/2 flex justify-between items-center w-full max-w-xs md:max-w-sm px-4">
                                    <span className="text-white text-sm md:text-base font-medium">-30</span>
                                    <span className="text-white text-sm md:text-base font-medium">30</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
