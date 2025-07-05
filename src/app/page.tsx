import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <>
      <main
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
        className="bg-primary"
      >
        <video
          src={"/assets/videos/landing_video.mp4"}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "80vh",
            objectFit: "cover",
            zIndex: 1,
          }}
        />

        <div className="absolute inset-0 bg-black/40 z-[2]" />

        <div className="container flex items-end relative z-[3] h-[80vh]">
          <div className="flex justify-between flex-col gap-4 xl:flex-row w-full mb-5">
            <div className="flex flex-col max-w-xl">
              <div className="text-[#FF12D8] text-base">Orpheon</div>
              <h1 className="font-bold text-[24px] md:text-[54px] text-white">
                Revolutionize Your Music
                with AI
              </h1>
            </div>

            <div className="flex flex-col gap-6 max-w-xl">
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Unleash the full potential of your music with our cutting-edge AI mastering technology. Experience a new
                dimension of sonic clarity and impact.
              </p>

              <Button
                variant="outline"
                size="lg"
                className="w-fit px-16 py-6 rounded-none bg-transparent border-[#F8F8FF] text-white hover:bg-[#F8F8FF] hover:text-black transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>

        </div>
      </main>
      <main className="h-[200vh]"></main>
    </>
  )
}
