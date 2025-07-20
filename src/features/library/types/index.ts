import { AudioProcessing } from "@/features/mastering/types"

export interface LibraryResponse {
  audio_processings: AudioProcessing[]
  meta: {
    pagination: {
      page: number
      limit: number
      total_data: number
      total_page: number
    }
  }
}