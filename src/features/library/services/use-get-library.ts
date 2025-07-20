import { useQueryApi } from "@/lib/react-query";
import { LibraryResponse } from "../types";

export function useGetLibrary(params?: { page?: number; limit?: number }) {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.append("page", String(params.page))
  if (params?.limit) searchParams.append("limit", String(params.limit))

  const queryString = searchParams.toString()
  const url = `/audio-processing/library${queryString ? `?${queryString}` : ""}`

  return useQueryApi<LibraryResponse>(
    ["library", String(params?.page ?? 1)],
    url
  )
}