"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const PlansPage = () => {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "month",
      description: "Perfect for small projects and experimentation",
      features: [
        "Up to 3 databases",
        "100K vectors per database",
        "10K API calls/month",
        "5GB storage",
        "Email support",
        "Basic analytics",
      ],
      current: false,
      popular: false,
    },
    {
      name: "Pro",
      price: "$99",
      period: "month",
      description: "Ideal for growing businesses and production workloads",
      features: [
        "Up to 10 databases",
        "1M vectors per database",
        "100K API calls/month",
        "50GB storage",
        "Priority support",
        "Advanced analytics",
        "Custom integrations",
        "99.9% SLA",
      ],
      current: true,
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large-scale applications with custom requirements",
      features: [
        "Unlimited databases",
        "Unlimited vectors",
        "Unlimited API calls",
        "1TB+ storage",
        "24/7 dedicated support",
        "Custom integrations",
        "SLA guarantee",
        "On-premise deployment",
        "Custom security",
      ],
      current: false,
      popular: false,
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Link
                href="/usage"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Usage & Billing
              </Link>
              <h1 className="text-3xl font-bold tracking-tight">Choose Your Plan</h1>
              <p className="text-muted-foreground">
                Scale your vector database infrastructure with flexible pricing that grows with your needs
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden transition-all duration-300 ${
                plan.current
                  ? "ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg dark:shadow-blue-500/10"
                  : plan.popular
                    ? "ring-2 ring-emerald-500 dark:ring-emerald-400 shadow-lg dark:shadow-emerald-500/10"
                    : "hover:shadow-lg dark:hover:shadow-lg"
              }`}
            >
              {plan.popular && !plan.current && (
                <div className="absolute -top-0 left-0 right-0">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-medium py-2 text-center">
                    Most Popular
                  </div>
                </div>
              )}
              {plan.current && (
                <div className="absolute -top-0 left-0 right-0">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium py-2 text-center">
                    Current Plan
                  </div>
                </div>
              )}

              <div className={`p-6 ${plan.popular && !plan.current ? "pt-12" : plan.current ? "pt-12" : "pt-6"}`}>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-lg text-muted-foreground">/{plan.period}</span>}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <div className="w-4 h-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                        <svg
                          className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full py-2.5 font-medium transition-all duration-200 ${
                    plan.current
                      ? "bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted"
                      : plan.popular
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                  }`}
                  disabled={plan.current}
                >
                  {plan.current
                    ? "Current Plan"
                    : plan.name === "Enterprise"
                      ? "Contact Sales"
                      : `Upgrade to ${plan.name}`}
                </Button>

                {!plan.current && plan.name !== "Enterprise" && (
                  <p className="text-center text-xs text-muted-foreground mt-3">14-day free trial • Cancel anytime</p>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <h3 className="text-xl font-semibold text-center mb-6">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Can I change plans anytime?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">What happens if I exceed limits?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We'll notify you before you reach limits. You can upgrade or purchase additional resources.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Is there a free trial?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Yes, all paid plans include a 14-day free trial with full access to features.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">How is billing calculated?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Billing is based on your plan tier plus any usage overages, calculated monthly.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default PlansPage
