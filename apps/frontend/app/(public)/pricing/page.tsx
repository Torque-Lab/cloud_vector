"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function PricingPage() {
    const plans = [
        {
            name: "Base",
            price: "$10",
            period: "month",
            description: "Perfect for small projects and experimentation",
            features: [
                "Up to 40 Projects",
                "Up to 1000 Instances",
                "Managed Postgres",
                "Managed Redis",
                "Managed RabbitMQ",
                "Launch Virtual Machine",
                "Agent support",
                "Shard Namespaces",
                "Basic analytics",
            ],
            popular: false,
        },
        {
            name: "Pro",
            price: "$20",
            period: "month",
            description: "Ideal for growing businesses and production workloads",
            features: [
                "Up to 100 Projects",
                "Up to 2000 Instances",
                "Managed Postgres",
                "Managed Redis",
                "Managed RabbitMQ",
                "Launch Virtual Machine",
                "Agent support",
                "Dedicated Namespace",
                "Advanced analytics",
                "99.9% SLA",
            ],
            popular: true,
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "",
            description: "For large-scale applications with custom requirements",
            features: [
                "Unlimited Projects",
                "Unlimited Instances",
                "Dedicated Namespace",
                "Dedicated VPC",
                "Managed Postgres",
                "Managed Redis",
                "Managed RabbitMQ",
                "Launch Virtual Machine",
                "24/7 dedicated support",
                "SLA guarantee",
            ],
            popular: false,
        },
    ]

    const router = useRouter()

    return (
        <section className="max-w-6xl mx-auto px-6 py-16 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Choose Your Plan</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Scale your infrastructure with flexible pricing that grows with your needs.
                </p>
            </div>


            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan, index) => (
                    <Card
                        key={index}
                        className={`relative overflow-hidden transition-all duration-300 ${plan.popular
                                ? "ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg dark:shadow-blue-500/10"
                                : "hover:shadow-lg dark:hover:shadow-lg border border-border"
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 left-0 right-0">
                                <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white text-xs font-medium py-2 text-center">
                                    Most Popular
                                </div>
                            </div>
                        )}


                        <div className={`p-6 ${plan.popular ? "pt-12" : "pt-8"}`}>
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                    {plan.description}
                                </p>
                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                                    {plan.period && (
                                        <span className="text-lg text-muted-foreground">
                                            /{plan.period}
                                        </span>
                                    )}


                                    <p className="text-xs text-muted-foreground mt-1">
                                        + Pay as per usage
                                    </p>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-start text-sm leading-relaxed text-foreground/90"
                                    >
                                        <div className="w-4 h-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                            <svg
                                                className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={`w-full py-2.5 cursor-pointer font-medium transition-all duration-200 ${plan.popular
                                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                        : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                                    }`}
                                onClick={() => router.push(`/signup`)}
                            >
                                {plan.name === "Enterprise"
                                    ? "Contact Sales"
                                    : `Upgrade to ${plan.name}`}
                            </Button>



                        </div>
                    </Card>
                ))}
            </div>
        </section>
    )
}
