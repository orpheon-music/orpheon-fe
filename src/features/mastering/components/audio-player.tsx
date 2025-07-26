"use client"
import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AudioPlayerProps {
    url: string
    highEq?: number
    mediumEq?: number
    lowEq?: number
    loudness?: number
    stereoWidth?: number
}

export default function AudioPlayer({
    url,
    highEq = 0,
    mediumEq = 0,
    lowEq = 0,
    loudness = 0,
    stereoWidth = 0,
}: AudioPlayerProps) {
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

    // Audio processing nodes
    const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)
    const highFilterRef = useRef<BiquadFilterNode | null>(null)
    const midFilterRef = useRef<BiquadFilterNode | null>(null)
    const lowFilterRef = useRef<BiquadFilterNode | null>(null)
    const gainNodeRef = useRef<GainNode | null>(null)
    const splitterRef = useRef<ChannelSplitterNode | null>(null)
    const mergerRef = useRef<ChannelMergerNode | null>(null)
    const leftGainRef = useRef<GainNode | null>(null)
    const rightGainRef = useRef<GainNode | null>(null)

    const setupAudioProcessing = () => {
        if (!audioRef.current || !audioContextRef.current) return

        try {
            // Create source node if it doesn't exist
            if (!sourceNodeRef.current) {
                sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current)
            }

            // Create EQ filters
            if (!highFilterRef.current) {
                highFilterRef.current = audioContextRef.current.createBiquadFilter()
                highFilterRef.current.type = "highshelf"
                highFilterRef.current.frequency.setValueAtTime(8000, audioContextRef.current.currentTime)
            }

            if (!midFilterRef.current) {
                midFilterRef.current = audioContextRef.current.createBiquadFilter()
                midFilterRef.current.type = "peaking"
                midFilterRef.current.frequency.setValueAtTime(1000, audioContextRef.current.currentTime)
                midFilterRef.current.Q.setValueAtTime(1, audioContextRef.current.currentTime)
            }

            if (!lowFilterRef.current) {
                lowFilterRef.current = audioContextRef.current.createBiquadFilter()
                lowFilterRef.current.type = "lowshelf"
                lowFilterRef.current.frequency.setValueAtTime(200, audioContextRef.current.currentTime)
            }

            // Create gain node for loudness
            if (!gainNodeRef.current) {
                gainNodeRef.current = audioContextRef.current.createGain()
            }

            // Create stereo width processing nodes
            if (!splitterRef.current) {
                splitterRef.current = audioContextRef.current.createChannelSplitter(2)
            }

            if (!mergerRef.current) {
                mergerRef.current = audioContextRef.current.createChannelMerger(2)
            }

            if (!leftGainRef.current) {
                leftGainRef.current = audioContextRef.current.createGain()
            }

            if (!rightGainRef.current) {
                rightGainRef.current = audioContextRef.current.createGain()
            }

            // Connect the audio graph
            sourceNodeRef.current
                .connect(lowFilterRef.current)
                .connect(midFilterRef.current)
                .connect(highFilterRef.current)
                .connect(gainNodeRef.current)
                .connect(splitterRef.current)

            // Stereo width processing
            splitterRef.current.connect(leftGainRef.current, 0)
            splitterRef.current.connect(rightGainRef.current, 1)

            leftGainRef.current.connect(mergerRef.current, 0, 0)
            rightGainRef.current.connect(mergerRef.current, 0, 1)

            mergerRef.current.connect(audioContextRef.current.destination)
        } catch (err) {
            console.error("Error setting up audio processing:", err)
        }
    }

    const updateAudioProcessing = useCallback(() => {
        if (!audioContextRef.current) return

        const currentTime = audioContextRef.current.currentTime

        // Update EQ
        if (highFilterRef.current) {
            highFilterRef.current.gain.setValueAtTime(highEq, currentTime)
        }
        if (midFilterRef.current) {
            midFilterRef.current.gain.setValueAtTime(mediumEq, currentTime)
        }
        if (lowFilterRef.current) {
            lowFilterRef.current.gain.setValueAtTime(lowEq, currentTime)
        }

        // Update loudness (convert to gain)
        if (gainNodeRef.current) {
            const gainValue = Math.pow(10, loudness / 20) // Convert dB to linear gain
            gainNodeRef.current.gain.setValueAtTime(gainValue, currentTime)
        }

        // Update stereo width
        if (leftGainRef.current && rightGainRef.current) {
            // Stereo width algorithm
            const widthFactor = stereoWidth / 30 // Normalize to -1 to 1
            const leftGain = 1 + widthFactor * 0.5
            const rightGain = 1 + widthFactor * 0.5

            leftGainRef.current.gain.setValueAtTime(leftGain, currentTime)
            rightGainRef.current.gain.setValueAtTime(rightGain, currentTime)
        }
    }, [highEq, mediumEq, lowEq, loudness, stereoWidth])


    const generateWaveformFromAudio = useCallback(async (audioUrl: string) => {
        try {
            setIsLoading(true)
            setError(null)

            if (!audioContextRef.current) {
                audioContextRef.current = new (
                    window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
                )()
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

            // Setup audio processing after loading
            setTimeout(() => {
                setupAudioProcessing()
                updateAudioProcessing()
            }, 100)
        } catch (err) {
            console.error("Error generating waveform:", err)
            setError("Failed to load audio file")
            setIsLoading(false)
            const fallbackWaveform = Array.from({ length: 200 }, () => Math.random() * 100 + 30)
            setWaveformData(fallbackWaveform)
        }
    }, [updateAudioProcessing])

    const togglePlayPause = async () => {
        if (!audioRef.current || !audioContextRef.current) return

        // Resume audio context if suspended
        if (audioContextRef.current.state === "suspended") {
            await audioContextRef.current.resume()
        }

        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
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

    const handleDrag = useCallback(
        (e: MouseEvent | TouchEvent) => {
            if (!waveformRef.current || !audioRef.current || duration === 0) return
            const clientX = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX
            const rect = waveformRef.current.getBoundingClientRect()
            const percentage = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
            const newTime = percentage * duration
            audioRef.current.currentTime = newTime
            setCurrentTime(newTime)
        },
        [duration],
    )


    // Update audio processing when parameters change
    useEffect(() => {
        updateAudioProcessing()
    }, [updateAudioProcessing])

    useEffect(() => {
        if (url) {
            generateWaveformFromAudio(url)
        }
    }, [url, generateWaveformFromAudio])

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
    }, [isDragging, handleDrag])

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
                                style={{ left: `${progress * 100}%`, transform: "translateX(-1px)" }}
                                onMouseDown={() => setIsDragging(true)}
                                onTouchStart={() => setIsDragging(true)}
                            />

                            {/* Waveform bars */}
                            {waveformData.map((height, index) => {
                                const isActive = index < progress * waveformData.length
                                return (
                                    <div
                                        key={index}
                                        className={`w-[3px] rounded-sm border border-white ${isActive ? "bg-white" : "bg-white/40 hover:bg-white/60"
                                            }`}
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
