'use client'

import Bookmark from '@/assets/images/mastering/bookmark.png'
import Guitar from '@/assets/images/mastering/guitar.png'
import Mic from '@/assets/images/mastering/mic.png'

import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useMutationApi } from '@/lib/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { AudioProcessingResponse } from '../types'
import { AxiosResponse } from 'axios'

const FormSchema = z.object({
    voice_file: z
        .any()
        .refine((file) => file instanceof File || file?.length > 0, {
            message: 'Vocal file is required',
        }),
    instrument_file: z
        .any()
        .refine((file) => file instanceof File || file?.length > 0, {
            message: 'Instrument file is required',
        }),
    reference_url: z
        .string()
        .min(2, { message: 'Reference track is required' })
        .regex(
            /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(&.*)?$/,
            { message: 'Please enter a valid YouTube link' }
        ),
})

type FormSchemaType = z.infer<typeof FormSchema>

export default function MasteringInputContainer() {
    const form = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            voice_file: undefined,
            instrument_file: undefined,
            reference_url: '',
        },
    })
    const uploadMutation = useMutationApi({
        method: "post",
        url: "/audio-processing",
    })
    const router = useRouter()

    const onSubmit = async (data: FormSchemaType) => {
        const formData = new FormData()
        formData.append("voice_file", data.voice_file)
        formData.append("instrument_file", data.instrument_file)
        formData.append("reference_url", data.reference_url)
        await uploadMutation.mutateAsync(formData, {
            onSuccess: (res) => {
                const response = res as AxiosResponse<AudioProcessingResponse>
                toast.success("File uploaded successfully")
                router.push(`/mastering/${response.data.audio_processing.id}`)
            },
            onError: (error) => {
                const err = error as { response?: { data?: { message?: string } } }
                toast.error(err.response?.data?.message || "Failed to upload files")
                console.error("Gagal upload", error)
            }
        })
    }

    return (
        <div
            className="min-h-screen bg-cover bg-center py-10 md:pt-20 md:pb-40 flex flex-col items-center justify-center gap-9"
            style={{ backgroundImage: 'url("/authenticated-bg.png")' }}
        >
            <h1 className="text-white text-3xl font-semibold text-center">File Upload</h1>


            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                    <div className="container py-10 md:px-14 rounded-3xl mt-9 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.50)] transition-colors border max-w-4xl flex flex-col gap-6 "
                        style={{ backdropFilter: 'blur(27.85px)' }}
                    >
                        {/* Vocal File Upload */}
                        <FormField
                            control={form.control}
                            name="voice_file"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div
                                            className="flex flex-col md:flex-row py-10 px-3 md:px-14 rounded-3xl bg-[rgba(255,255,255,0.05)] border-dashed border-[rgba(255,255,255,0.50)] justify-center items-center gap-6"
                                            style={{ backdropFilter: 'blur(27.85px)' }}
                                        >
                                            <Image src={Mic} alt="Mic" />
                                            <span className="text-white">
                                                {field.value instanceof File ? field.value.name : 'Upload Vocal File'}
                                            </span>
                                            <Button className='py-5 px-10 cursor-pointer' type="button" onClick={() => document.getElementById('voice_fileInput')?.click()}>
                                                Browse
                                            </Button>
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                id="voice_fileInput"
                                                onChange={(e) => field.onChange(e.target.files?.[0])}
                                                className="hidden"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-center" />
                                </FormItem>
                            )}
                        />

                        {/* Instrument File Upload */}
                        <FormField
                            control={form.control}
                            name="instrument_file"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div
                                            className="flex flex-col md:flex-row py-10 px-14 rounded-3xl bg-[rgba(255,255,255,0.05)] border-dashed border-[rgba(255,255,255,0.50)] justify-center items-center gap-6"
                                            style={{ backdropFilter: 'blur(27.85px)' }}
                                        >
                                            <Image src={Guitar} alt="Guitar" />
                                            <span className="text-white">
                                                {field.value instanceof File ? field.value.name : 'Upload Instrument File'}
                                            </span>
                                            <Button className='py-5 px-10 cursor-pointer' type="button" onClick={() => document.getElementById('instrument_fileInput')?.click()}>
                                                Browse
                                            </Button>
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                id="instrument_fileInput"
                                                onChange={(e) => field.onChange(e.target.files?.[0])}
                                                className="hidden"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-center" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="reference_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div
                                            className="flex flex-col lg:flex-row py-10 px-14 rounded-3xl bg-[rgba(255,255,255,0.05)] border-dashed border-[rgba(255,255,255,0.50)] items-center xl:items-stretch gap-6"
                                            style={{ backdropFilter: 'blur(27.85px)' }}
                                        >
                                            <Image src={Bookmark} alt="Bookmark" />

                                            <div className='flex flex-col gap-6 w-full'>
                                                <span className='text-center'>
                                                    Upload Reference Track or Youtube Link
                                                </span>
                                                <Input
                                                    placeholder='Enter YouTube link for reference track'
                                                    className='h-14 bg-white border-0 text-black text-sm md:text-base rounded-lg'
                                                    {...field}
                                                />
                                            </div>
                                            {/* <Button className='py-5 px-10 cursor-pointer' type="button" onClick={() => document.getElementById('instrument_fileInput')?.click()}>
                                                Browse
                                            </Button>
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                id="instrument_fileInput"
                                                onChange={(e) => field.onChange(e.target.files?.[0])}
                                                className="hidden"
                                            /> */}
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-center" />
                                </FormItem>
                            )}
                        />

                        <div className='flex flex-col md:flex-row justify-center items-center gap-6'>
                            <div className='py-8 px-6 flex flex-col gap-6 rounded-3xl border border-[rgba(255,255,255,0.50)] bg-[rgba(255,255,255,0.05)] transition-colors'>
                                <span className=''>Support</span>
                                <span className='text-2xl'>WAV, MP3, FLAC</span>
                                <span className='text-[#C0C0C0]'>formats</span>
                            </div>
                            <div className='py-8 px-6 flex flex-col gap-6 rounded-3xl border border-[rgba(255,255,255,0.50)] bg-[rgba(255,255,255,0.05)] transition-colors'>
                                <span className=''>Under</span>
                                <span className='text-2xl'>100 MB, 10 mins</span>
                                <span className='text-[#C0C0C0]'>audio file</span>
                            </div>
                        </div>


                    </div>
                    <Button
                        type="submit"
                        className="w-full max-w-4xl flex self-center py-5 bg-white text-black font-semibold rounded"
                    >
                        Upload Files
                    </Button>
                </form>
            </Form>
        </div >
    )
}
