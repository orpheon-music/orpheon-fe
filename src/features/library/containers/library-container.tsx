"use client"

import Pagination from "@/components/shared/pagination"

const audioFiles = [
    {
        filename: "PXL_20250619_050518864.mp3",
        metadata: "01:15 | 320kbps | MP3 | 2.8MB",
    },
    {
        filename: "PXL_20250619_050518864.mp3",
        metadata: "02:34 | 320kbps | MP3 | 5.1MB",
    },
    {
        filename: "PXL_20250619_050518864.mp3",
        metadata: "01:18 | 320kbps | MP3 | 3.2MB",
    },
    {
        filename: "PXL_20250619_050518864.mp3",
        metadata: "03:45 | 320kbps | MP3 | 7.8MB",
    },
]

export default function LibraryContainer() {
    return (
        <div
            className="min-h-screen bg-cover bg-center py-20 md:py-40 "
            style={{ backgroundImage: 'url("/authenticated-bg.png")' }}
        >
            <h1 className="text-white text-3xl font-semibold text-center mb-12">Library</h1>
            <div className="container py-10 px-14 rounded-3xl mt-9 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.50)] transition-colors border"
                style={{ backdropFilter: "blur(27.85px)" }}>
                <div className="space-y-4 mb-8">
                    {audioFiles.map((file, index) => (
                        <div
                            key={index}
                            className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.50)] border py-6 px-14 rounded-3xl transition-colors cursor-pointer"
                            style={{ backdropFilter: "blur(27.85px)" }}
                        >
                            <div className="space-y-1">
                                <h3 className="text-white font-medium text-lg">{file.filename}</h3>
                                <p className="text-white/60 text-sm">{file.metadata}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <Pagination currentPage={1} totalPages={10} onPageChange={(page) => console.log(page)} />
            </div>
        </div>
    )
}

