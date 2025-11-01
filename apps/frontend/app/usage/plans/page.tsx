"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import axios from "axios"
import { toast } from "@/hooks/use-toast"

const PlansPage = () => {
  const plans = [
    {
      name: "Base",
      price: "$20",
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
      price: "$40",
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
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleSubscriptionUpgrade = async (planName: string) => {
    setSelectedPlan(planName);
    setIsUpgrading(true);

    try {

      const response = await axios.post<{
        success: true,
        message: string,
        checkoutUrl: string
      }>(`/api/v1/bill/create-subscription`, {
        tier: planName,
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
          variant: "default",
        })
        window.location.href = response.data.checkoutUrl;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong, please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsUpgrading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1 px-8 py-2 mt-6">
              <Link
                href="/usage"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Usage & Billing
              </Link>
              <h1 className="text-3xl font-bold tracking-tight">Choose Your Plan</h1>
              <p className="text-muted-foreground">
                Scale infrastructure with flexible pricing that grows with your needs
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden transition-all duration-300 ${plan.popular &&
                   "ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg dark:shadow-blue-500/10"
                 
                }`}
            >
              {plan.popular  && (
                <div className="absolute top-0 left-0 right-0">
                  <div className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white text-xs font-medium py-2 text-center">
                    Most Popular
                  </div>
                </div>
              )}
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0">
                  <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white text-xs font-medium py-2 text-center">
                    Popular Plan
                  </div>
                </div>
              )}

              <div className={`p-6 ${plan.popular ? "pt-12" : "pt-6"}`}>
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
                  className={`w-full py-2.5 font-medium transition-all duration-200 cursor-pointer ${plan.popular &&
                      "bg-muted text-muted-foreground  hover:bg-muted"
                    }`}
        
                  onClick={() => handleSubscriptionUpgrade(plan.name)}
                >
                 Upgrade to {plan.name}
                </Button>

                {plan.name !== "Enterprise" && (
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
