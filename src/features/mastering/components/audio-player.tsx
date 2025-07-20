"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AudioPlayerProps {
    url: string
}

export default function AudioPlayer({ url }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [waveformData, setWaveformData] = useState<number[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    const audioRef = useRef<HTMLAudioElement>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const waveformRef = useRef<HTMLDivElement>(null)

    const generateWaveformFromAudio = async (audioUrl: string) => {
        try {
            setIsLoading(true)
            setError(null)

            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
            }

            const response = await fetch(audioUrl, { mode: "cors" })
            if (!response.ok) {
                throw new Error("Failed to fetch audio file")
            }

            const arrayBuffer = await response.arrayBuffer()
            const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer)

            const audioData = audioBuffer.getChannelData(0)
            const samples = audioData.length
            const blockSize = Math.max(1, Math.floor(samples / 200))
            const waveform: number[] = []

            for (let i = 0; i < 200; i++) {
                const start = i * blockSize
                const end = start + blockSize
                let sum = 0
                for (let j = start; j < end && j < samples; j++) {
                    sum += audioData[j] * audioData[j]
                }
                const rms = Math.sqrt(sum / blockSize || 1)
                const height = Math.max(30, Math.min(100, rms * 500))
                waveform.push(height)
            }

            setWaveformData(waveform)
            setDuration(audioBuffer.duration)
            setIsLoading(false)
        } catch (err) {
            console.error("Error generating waveform:", err)
            setError("Failed to load audio file")
            setIsLoading(false)
            const fallbackWaveform = Array.from({ length: 200 }, () => Math.random() * 100 + 30)
            setWaveformData(fallbackWaveform)
        }
    }

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                audioRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const handleWaveformClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current || duration === 0) return

        const rect = event.currentTarget.getBoundingClientRect()
        const clickX = event.clientX - rect.left
        const percentage = clickX / rect.width
        const newTime = percentage * duration

        audioRef.current.currentTime = newTime
        setCurrentTime(newTime)
    }

    const handleDrag = (e: MouseEvent | TouchEvent) => {
        if (!waveformRef.current || !audioRef.current || duration === 0) return

        const clientX = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX
        const rect = waveformRef.current.getBoundingClientRect()
        const percentage = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
        const newTime = percentage * duration

        audioRef.current.currentTime = newTime
        setCurrentTime(newTime)
    }

    useEffect(() => {
        if (url) {
            generateWaveformFromAudio(url)
        }
    }, [url])

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const updateTime = () => setCurrentTime(audio.currentTime)
        const updateDuration = () => {
            if (audio.duration && !isNaN(audio.duration)) {
                setDuration(audio.duration)
            }
        }

        audio.addEventListener("timeupdate", updateTime)
        audio.addEventListener("loadedmetadata", updateDuration)
        audio.addEventListener("ended", () => setIsPlaying(false))
        audio.addEventListener("play", () => setIsPlaying(true))
        audio.addEventListener("pause", () => setIsPlaying(false))

        return () => {
            audio.removeEventListener("timeupdate", updateTime)
            audio.removeEventListener("loadedmetadata", updateDuration)
            audio.removeEventListener("ended", () => setIsPlaying(false))
            audio.removeEventListener("play", () => setIsPlaying(true))
            audio.removeEventListener("pause", () => setIsPlaying(false))
        }
    }, [])

    useEffect(() => {
        if (!isDragging) return

        const handleMouseMove = (e: MouseEvent) => handleDrag(e)
        const handleTouchMove = (e: TouchEvent) => handleDrag(e)
        const stopDragging = () => setIsDragging(false)

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("touchmove", handleTouchMove)
        window.addEventListener("mouseup", stopDragging)
        window.addEventListener("touchend", stopDragging)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("touchmove", handleTouchMove)
            window.removeEventListener("mouseup", stopDragging)
            window.removeEventListener("touchend", stopDragging)
        }
    }, [isDragging])

    const progress = duration > 0 ? currentTime / duration : 0

    return (
        <div className="w-full max-w-4xl mx-auto p-8">
            <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.5)] rounded-3xl p-8 relative overflow-hidden">
                {/* Audio element */}
                <audio ref={audioRef} src={url} preload="metadata" crossOrigin="anonymous" />



                {/* Waveform */}
                <div className="relative h-32 mb-8">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-gray-400">Loading waveform...</div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-red-400 text-sm">{error}</div>
                        </div>
                    ) : (
                        <div
                            ref={waveformRef}
                            className="relative flex items-end justify-center gap-[2px] px-4 h-full cursor-pointer"
                            onClick={handleWaveformClick}
                        >
                            {/* Draggable red line */}
                            <div
                                className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-10"
                                style={{ left: `${progress * 100}%`, transform: 'translateX(-1px)' }}
                                onMouseDown={() => setIsDragging(true)}
                                onTouchStart={() => setIsDragging(true)}
                            />

                            {/* Waveform bars */}
                            {waveformData.map((height, index) => {
                                const isActive = index < progress * waveformData.length
                                return (
                                    <div
                                        key={index}
                                        className={`w-[3px] rounded-sm border border-white ${isActive ? "bg-white" : "bg-white/40 hover:bg-white/60"}`}
                                        style={{ height: `${height}%`, minHeight: "4px" }}
                                    />
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Time labels */}
                <div className="flex justify-between text-gray-400 text-sm mb-6">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>

                {/* Play/Pause */}
                <div className="flex justify-center">
                    <Button
                        onClick={togglePlayPause}
                        size="lg"
                        className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 text-black p-0 disabled:opacity-50"
                        disabled={isLoading || !!error}
                    >
                        {isPlaying ? (
                            <Pause className="w-6 h-6 ml-0.5" fill="currentColor" />
                        ) : (
                            <Play className="w-6 h-6 ml-1" fill="currentColor" />
                        )}
                    </Button>
                </div>

                {/* Progress overlay */}
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500/5 to-transparent transition-all duration-300 pointer-events-none"
                    style={{ width: `${progress * 100}%` }}
                />

            </div>
        </div>
    )
}
