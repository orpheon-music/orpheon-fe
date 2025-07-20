"use client"
import LoadingAnimation from "@/assets/animations/loading.json";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function MasteringLoadingModal({
    open,
}: {
    open: boolean
}) {
    const [dots, setDots] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev + 1) % 8)
        }, 100)
        return () => clearInterval(interval)
    }, [])

    return (
        <Dialog open={open}>
            <DialogContent className="bg-black text-center max-w-sm text-white border-none">
                {/* Spinner */}
                <div className="flex justify-center mb-6">
                    <Lottie
                        animationData={LoadingAnimation}
                        loop={true}
                        className="w-48 h-48"
                    />
                </div>

                {/* Text */}
                <h2 className="text-xl font-semibold mb-2">Mastering in progress</h2>
                {/* <p className="text-sm text-gray-300 mb-6">
          Mastering will be completed in approximately 10 minutes.
          <br />
          You can check the status in the library.
        </p> */}


            </DialogContent>
        </Dialog>
    )
}
