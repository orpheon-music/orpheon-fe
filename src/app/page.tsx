import Hero from "@/features/home/containers/hero"
import HowItWorks from "@/features/home/containers/how-it-works"
import Pricing from "@/features/home/containers/pricing"
import Sample from "@/features/home/containers/sample"
import WhatOtherSay from "@/features/home/containers/what-other-say"

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Sample />
      <WhatOtherSay />
      <Pricing />
    </>
  )
}
