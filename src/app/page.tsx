import Hero from "@/features/home/containers/hero"
import HowItWorks from "@/features/home/containers/how-it-works"
import Pricing from "@/features/home/containers/pricing"
import Sample from "@/features/home/containers/sample"

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Sample />
      <Pricing />
    </>
  )
}
