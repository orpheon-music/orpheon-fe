"use client"

import { useState } from "react"
import Pagination from "@/components/shared/pagination"
import { Download } from "lucide-react"
import { useGetLibrary } from "../services/use-get-library"
import { FE_URL } from "@/lib/env"
import { Skeleton } from "@/components/ui/skeleton"

export default function LibraryContainer() {
    const [currentPage, setCurrentPage] = useState(1)
    const { data, isLoading, error } = useGetLibrary({ page: currentPage })

    const audioFiles = data?.audio_processings ?? []
    const totalPages = data?.meta.pagination.total_page ?? 1

    const handleDownload = async (url: string, filename: string) => {
        try {
            const response = await fetch(url)
            const blob = await response.blob()

            const downloadUrl = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = downloadUrl
            link.download = filename
            link.click()
            window.URL.revokeObjectURL(downloadUrl)
        } catch (err) {
            console.error("Download failed", err)
        }
    }

    return (
        <div
            className="min-h-screen bg-cover bg-center py-20 md:py-40"
            style={{ backgroundImage: 'url("/authenticated-bg.png")' }}
        >
            <h1 className="text-white text-3xl font-semibold text-center mb-12">Library</h1>
            <div className="container py-10 px-14 rounded-3xl mt-9 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.50)] transition-colors border"
                style={{ backdropFilter: "blur(27.85px)" }}>

                {error && <p className="text-red-500 text-center">Failed to load audio files.</p>}

                {isLoading ? (
                    <div className="space-y-4 mb-8">
                        {[...Array(5)].map((_, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.50)] border py-6 px-14 rounded-3xl transition-colors"
                                style={{ backdropFilter: "blur(27.85px)" }}
                            >
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-48 bg-white/20" />
                                    <Skeleton className="h-4 w-64 bg-white/10" />
                                </div>
                                <Skeleton className="h-5 w-5 rounded-full bg-white/20" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4 mb-8">
                        {audioFiles.map((file) => (
                            <div
                                key={file.id}
                                className="flex justify-between items-center bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.50)] border py-6 px-14 rounded-3xl transition-colors cursor-pointer"
                                style={{ backdropFilter: "blur(27.85px)" }}
                            >
                                <div className="space-y-1">
                                    <h3 className="text-white font-medium text-lg">{file.name}</h3>
                                    <p className="text-white/60 text-sm">
                                        {file.duration || "0:00"} | {file.bitrate}kbps | {file.format.toUpperCase()} | {(file.size / 1024 / 1024).toFixed(1)}MB
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDownload(file.standard_audio_url, file.name)}
                                    className="text-white hover:text-white/70 transition-colors"
                                    title="Download"
                                >
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && !error && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                )}
            </div>
        </div>
    )
}
