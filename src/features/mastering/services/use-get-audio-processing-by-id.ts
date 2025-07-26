import { useQueryApi } from "@/lib/react-query";
import { AudioProcessingResponse } from "../types";

export function useGetAudioProcessingById(id: string) {
  return useQueryApi<AudioProcessingResponse>(
    ["audio-processing", id],
    `/audio-processing/${id}`
  )
}