"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const getPageNumbers = () => {
        const pages: (number | "...")[] = []

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, "...", totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages)
            } else {
                pages.push(1, "...", currentPage, "...", totalPages)
            }
        }

        return pages
    }

    const pages = getPageNumbers()

    return (
        <div className="flex items-center justify-center gap-2">
            <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-40"
            >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Prev
            </Button>

            <div className="flex items-center gap-1">
                {pages.map((page, index) =>
                    page === "..." ? (
                        <span key={`ellipsis-${index}`} className="text-white/50 px-2">
                            ...
                        </span>
                    ) : (
                        <Button
                            key={`page-${page}`}
                            size="sm"
                            className={`w-8 h-8 p-0 ${currentPage === page
                                    ? "bg-white/20 text-white hover:bg-white/30"
                                    : "text-white/70 hover:text-white hover:bg-white/10"
                                }`}
                            variant={currentPage === page ? "default" : "ghost"}
                            onClick={() => onPageChange(Number(page))}
                        >
                            {page}
                        </Button>
                    )
                )}
            </div>

            <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-40"
            >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
        </div>
    )
}
