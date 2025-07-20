export interface AudioProcessing {
    id: string;
    user_id: string;
    name: string;
    size: number;
    duration: number;
    format: string;
    bitrate: number;
    standard_audio_url: string;
    dynamic_audio_url: string;
    smooth_audio_url: string;
}

export interface AudioProcessingResponse {
    audio_processing: AudioProcessing;
}

export type AudioType = "smooth" | "dynamic" | "standard"
