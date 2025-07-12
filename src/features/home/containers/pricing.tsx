import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function Pricing() {
    const plans = [
        {
            name: "Starter",
            price: 19,
            period: "/month",
            description: "Perfect for curious creators who want to explore AI-powered mastering.",
            features: ["Access to full UI/UX features", "Upload & preview 3 mastered versions", "Includes 3 tokens/month"],
            popular: false,
            buttonVariant: "outline" as const,
        },
        {
            name: "Professional",
            price: 89,
            period: "/month",
            description: "For professionals, studios, and serious musicians who demand flexibility and control.",
            features: [
                "All features in Growth, plus:",
                "Top-speed priority queue and faster rendering",
                "Includes 100 tokens/month",
            ],
            popular: true,
            buttonVariant: "default" as const,
        },
        {
            name: "Growth",
            price: 19,
            period: "/month",
            description: "Designed for content studios, frequent collaborators, or music educators.",
            features: [
                "Everything in Starter, plus:",
                "Faster processing with mid-priority queue",
                "Includes 30 tokens/month",
            ],
            popular: false,
            buttonVariant: "outline" as const,
        },
    ]

    return (
        <div id="pricing" className="min-h-screen bg-black text-white py-20 md:py-52 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className='flex justify-center items-center flex-col gap-8'>
                    <div className='flex gap-2 items-center py-2 px-4 border border-white'>
                        <div className='w-8 h-8 bg-[#23BC51] rounded-full' />
                        <span className='text-sm md:text-base text-[F8F8FF]'>Price</span>
                    </div>
                    <div className='flex flex-col gap-4 items-center'>
                        <h1 className='text-[30px] md:text-[54px] text-white text-center'>Pricing</h1>
                        <p className='text-[#A1A4A7] text-lg md:text-2xl max-w-[640px] text-center'> Choose a plan that fits your needs—simple, transparent, and built for growth.</p>
                    </div>

                </div>

                <div className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8 container mt-20">
                    {plans.map((plan, index) => (
                        <Card
                            key={plan.name}
                            className={cn(
                                "relative rounded-3xl",
                                plan.popular
                                    ? "bg-primary md:scale-120 border-0 text-white"
                                    : "bg-white border-[#767B7E] text-primary",
                                !plan.popular && index === 0 && "md:rounded-tr-none rounded-tr-3xl md:rounded-br-none rounded-br-3xl ", 
                                !plan.popular && index === 2 && "md:rounded-tl-none rounded-tl-3xl md:rounded-bl-none rounded-bl-3xl"  
                            )}
                        >



                            <CardHeader className="text-center pb-8">
                                {plan.popular && (
                                    <div className="">
                                        <Badge className="bg-primary text-white px-4 py-1 text-xs font-medium self-end">MOST POPULAR</Badge>
                                    </div>
                                )}
                                <div className="mb-4">
                                    <span className="text-4xl font-bold">${plan.price}</span>
                                    <span className={`text-sm ${plan.popular ? "text-purple-200" : "text-[#767B7E]"}`}>{plan.period}</span>
                                </div>
                                <CardTitle className="text-2xl font-semibold mb-3">{plan.name}</CardTitle>
                                <CardDescription
                                    className={`text-sm leading-relaxed ${plan.popular ? "text-purple-100" : "text-[#767B7E]"}`}
                                >
                                    {plan.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start gap-3">
                                            <Check
                                                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.popular ? "text-purple-200" : "text-green-600"
                                                    }`}
                                            />
                                            <span className={`text-sm ${plan.popular ? "text-purple-100" : "text-[#767B7E]"}`}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className={`w-full py-3 font-medium ${plan.popular
                                        ? "bg-white text-primary hover:bg-primary/80]"
                                        : "bg-primary text-white hover:bg-primary/80"
                                        }`}
                                    variant={plan.popular ? "secondary" : "default"}
                                >
                                    Choose plan
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
