import React from 'react'
import TestimonialScroller from '../components/testimonial-scroller'

export default function WhatOtherSay() {
    return (
        <section className="flex items-start justify-between container flex-col lg:flex-row gap-20">
            <div className="flex flex-col gap-6 items-start">
                <div className='flex gap-2 items-center py-2 px-4 border border-white'>
                    <div className='w-8 h-8 bg-[#1778F2] rounded-full' />
                    <span className='text-sm md:text-base text-[F8F8FF]'>Review</span>
                </div>
                <h1 className='text-[30px] md:text-[54px] text-white text-start font-bold font-space-grotesk'>What Others Say</h1>
            </div>
            <TestimonialScroller />

        </section>

    )
}
