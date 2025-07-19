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
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const FormSchema = z.object({
    vocalFile: z
        .any()
        .refine((file) => file instanceof File || file?.length > 0, {
            message: 'Vocal file is required',
        }),
    instrumentFile: z
        .any()
        .refine((file) => file instanceof File || file?.length > 0, {
            message: 'Instrument file is required',
        }),
    referenceTrack: z
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
            vocalFile: undefined,
            instrumentFile: undefined,
        },
    })

    const onSubmit = (data: FormSchemaType) => {
        console.log('Submit files:', data)
        // TODO: implement file upload logic
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
                            name="vocalFile"
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
                                            <Button className='py-5 px-10 cursor-pointer' type="button" onClick={() => document.getElementById('vocalFileInput')?.click()}>
                                                Browse
                                            </Button>
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                id="vocalFileInput"
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
                            name="instrumentFile"
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
                                            <Button className='py-5 px-10 cursor-pointer' type="button" onClick={() => document.getElementById('instrumentFileInput')?.click()}>
                                                Browse
                                            </Button>
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                id="instrumentFileInput"
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
                            name="referenceTrack"
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
                                                    className='h-14 bg-white border-0 text-[#B2BAC6] text-sm md:text-base rounded-lg'
                                                    {...field}
                                                />
                                            </div>
                                            {/* <Button className='py-5 px-10 cursor-pointer' type="button" onClick={() => document.getElementById('instrumentFileInput')?.click()}>
                                                Browse
                                            </Button>
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                id="instrumentFileInput"
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
