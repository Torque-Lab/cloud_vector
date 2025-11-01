"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const PlanDetailsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="space-y-4">
          <Link href="/usage" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            ← Back to Usage & Billing
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Plan Details</h1>
              <p className="text-muted-foreground">Complete information about your current plan</p>
              <p className="text-muted-foreground italic">Page is not ready for real data...</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 text-lg px-4 py-2 hover:not-enabled:cursor-not-allowed">
              Free Plan
            </Badge>
          </div>
        </div>

        {/* Plan Overview */}
        <Card className="p-8 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Free Plan</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Cost:</span>
                  <span className="font-semibold text-2xl text-blue-600 dark:text-blue-400">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Billing Cycle:</span>
                  <span className="font-medium text-foreground">Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next Billing:</span>
                  <span className="font-medium text-foreground">January 15, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan Started:</span>
                  <span className="font-medium text-foreground">October 15, 2024</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Link href="/usage/plans">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 cursor-pointer">
                  Change Plan
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Current Usage */}
        <Card className="p-8 bg-card border-border">
          <h3 className="text-xl font-semibold mb-6 text-foreground">Current Usage</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-foreground">Databases</span>
                <span className="text-sm text-muted-foreground">7 of 10 used (70%)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-4">
                <div
                  className="bg-blue-500 dark:bg-blue-400 h-4 rounded-full transition-all duration-300"
                  style={{ width: "70%" }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">3 databases remaining</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-foreground">API Calls</span>
                <span className="text-sm text-muted-foreground">47,832 of 100,000 used (48%)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-4">
                <div
                  className="bg-green-500 dark:bg-green-400 h-4 rounded-full transition-all duration-300"
                  style={{ width: "48%" }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">52,168 API calls remaining this month</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-foreground">Storage</span>
                <span className="text-sm text-muted-foreground">23.4GB of 50GB used (47%)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-4">
                <div
                  className="bg-purple-500 dark:bg-purple-400 h-4 rounded-full transition-all duration-300"
                  style={{ width: "47%" }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">26.6GB storage remaining</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-foreground">Vector Operations</span>
                <span className="text-sm text-muted-foreground">156,000 of 1,000,000 used (16%)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-4">
                <div
                  className="bg-orange-500 dark:bg-orange-400 h-4 rounded-full transition-all duration-300"
                  style={{ width: "16%" }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">844,000 vector operations remaining</p>
            </div>
          </div>
        </Card>

        {/* Plan Features */}
        <Card className="p-8 bg-card border-border">
          <h3 className="text-xl font-semibold mb-6 text-foreground">Included Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-foreground">Up to 10 databases</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-foreground">1M vectors per database</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-foreground">100K API calls/month</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-foreground">50GB storage</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-foreground">Priority support</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-foreground">Advanced analytics</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-foreground">Custom integrations</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-foreground">99.9% SLA</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Billing History */}
        <Card className="p-8 bg-card border-border">
          <h3 className="text-xl font-semibold mb-6 text-foreground">Recent Billing History</h3>
          <div className="space-y-4">
            {[
              { date: "Dec 15, 2024", amount: "$99.00", status: "Paid", period: "Dec 15 - Jan 14, 2025" },
              { date: "Nov 15, 2024", amount: "$99.00", status: "Paid", period: "Nov 15 - Dec 14, 2024" },
              { date: "Oct 15, 2024", amount: "$99.00", status: "Paid", period: "Oct 15 - Nov 14, 2024" },
            ].map((invoice, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-border rounded-lg bg-card"
              >
                <div>
                  <p className="font-medium text-foreground">{invoice.date}</p>
                  <p className="text-sm text-muted-foreground">Pro Plan • {invoice.period}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg text-foreground">{invoice.amount}</p>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  >
                    {invoice.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
              View All Invoices
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default PlanDetailsPage
