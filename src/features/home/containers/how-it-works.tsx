import Image from 'next/image'
import React from 'react'
import Step1 from "@/assets/images/home/hiw-step1.png"
import Step2 from "@/assets/images/home/hiw-step2.png"
import Step3 from "@/assets/images/home/hiw-step3.png"
import Ellipse1 from "@/assets/images/home/hiw-ellipse.png"
import Ellipse2 from "@/assets/images/home/hiw-ellipse2.png"

const steps = [
    { image: Step1, title: "Record Your Part", desc: "Feel free to express yourself freely. Let your voice be heard and share your unique perspective with the world!" },
    { image: Step2, title: "Let Us Do The Job", desc: "Let our AI take care of your sound mastering! With advanced algorithms, it transforms your raw recordings into polished tracks, ensuring your voice shines through. " },
    { image: Step3, title: "Share and Shine!", desc: "Experience the new joy of sharing your unique and professionally mastered audio like never before!" },
]

export default function HowItWorks() {
    return (
        <section className='py-12 flex flex-col gap-9 relative'>
            <Image src={Ellipse1} alt='' className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
            <Image
                src={Ellipse2}
                alt=""
                className="opacity-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
            />

            <div className="container flex items-end gap-10 xl:gap-20 justify-between z-20">
                <div className="flex flex-col gap-6 items-start">
                    <div className="border-[#767B7E] px-3 py-2 border flex gap-2.5 items-center ">
                        <div className="bg-[#FF12D8] rounded-full w-7 h-7" />
                        <span>How It Works</span>
                    </div>
                    <h1 className="text-6xl">Everyone Is a Singer</h1>
                    <p className="text-[#CECECE] text-sm md:text-base leading-relaxed">
                        Our AI-powered mastering tool transforms raw vocals into studio-quality sound, instantly. Whether you're recording on your phone or mic, your voice deserves to shine. No complicated settings. No audio expertise needed. Just upload, master, and share your best sound yet.
                    </p>
                </div>
                <hr className="h-[1px] w-full max-w-[900px]" />
            </div>

            <div className='container grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mt-12 z-30'>
                {steps.map((step, index) => (
                    <div key={index} className="relative overflow-hidden h-[500px] shadow-xl">
                        <Image
                            src={step.image}
                            alt={step.title}
                            fill
                            className="object-cover absolute z-0"
                        />
                        <div className="relative z-20 flex flex-col justify-end h-full p-6 text-white">
                            <div className="backdrop-blur-md bg-[#595959]/[0.04] p-4">
                                <h3 className="text-xl md:text-2xl font-bold mb-2">{step.title}</h3>
                                <p className="text-sm md:text-base text-[#BEBEBE]">{step.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
