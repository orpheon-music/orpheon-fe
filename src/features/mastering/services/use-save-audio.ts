import { useMutationApi } from "@/lib/react-query"
import { AudioType } from "../types"

interface SaveAudioTypePayload {
  type: AudioType
}

export function useSaveAudio(id: string) {
  return useMutationApi<null, SaveAudioTypePayload>({
    method: "put",
    url: `/audio-processing/${id}`,
  })
}