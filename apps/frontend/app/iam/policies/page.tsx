"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function PoliciesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [resourceFilter, setResourceFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data for resource policies
  const policies = [
    {
      id: "1",
      name: "Project Alpha Access",
      description: "Controls access to Project Alpha and its resources",
      resourceType: "Project",
      resourceId: "project-alpha",
      status: "Active",
      rules: [
        { principal: "john@example.com", permissions: ["read", "write"], type: "user" },
        { principal: "Developer", permissions: ["read"], type: "role" },
        { principal: "jane@example.com", permissions: ["admin"], type: "user" },
      ],
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
    },
    {
      id: "2",
      name: "Production Databases Policy",
      description: "Restricted access to production databases",
      resourceType: "Database",
      resourceId: "prod-*",
      status: "Active",
      rules: [
        { principal: "Admin", permissions: ["read", "write", "delete"], type: "role" },
        { principal: "Senior Developer", permissions: ["read", "write"], type: "role" },
      ],
      createdAt: "2024-01-10",
      updatedAt: "2024-01-18",
    },
    {
      id: "3",
      name: "API Keys Management",
      description: "Controls who can manage API keys",
      resourceType: "API Key",
      resourceId: "*",
      status: "Active",
      rules: [
        { principal: "Admin", permissions: ["read", "write", "delete"], type: "role" },
        { principal: "bob@example.com", permissions: ["read"], type: "user" },
      ],
      createdAt: "2024-01-12",
      updatedAt: "2024-01-16",
    },
    {
      id: "4",
      name: "Billing Access Policy",
      description: "Controls access to billing and usage information",
      resourceType: "Billing",
      resourceId: "billing",
      status: "Draft",
      rules: [
        { principal: "Admin", permissions: ["read", "write"], type: "role" },
        { principal: "Finance Team", permissions: ["read"], type: "role" },
      ],
      createdAt: "2024-01-22",
      updatedAt: "2024-01-22",
    },
  ]

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesResource = resourceFilter === "all" || policy.resourceType === resourceFilter
    const matchesStatus = statusFilter === "all" || policy.status === statusFilter
    return matchesSearch && matchesResource && matchesStatus
  })

  const getResourceColor = (resourceType: string) => {
    const colors: Record<string, string> = {
      Project: "default",
      Database: "secondary",
      "API Key": "outline",
      Billing: "destructive",
    }
    return colors[resourceType] || "outline"
  }

  return (
    <DashboardLayout>

  
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resource Policies</h1>
          <p className="text-muted-foreground">Manage access control policies for specific resources</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/iam/policies/create">
            <Button>Create Policy</Button>
          </Link>
          <Link href="/iam/policies/templates">
            <Button variant="outline">Policy Templates</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <svg
                className="h-4 w-4 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Policies</p>
              <p className="text-2xl font-bold">{policies.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <svg
                className="h-4 w-4 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Policies</p>
              <p className="text-2xl font-bold">{policies.filter((p) => p.status === "Active").length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <svg
                className="h-4 w-4 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Draft Policies</p>
              <p className="text-2xl font-bold">{policies.filter((p) => p.status === "Draft").length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <svg
                className="h-4 w-4 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Resource Types</p>
              <p className="text-2xl font-bold">{new Set(policies.map((p) => p.resourceType)).size}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search policies by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={resourceFilter} onChange={(e) => setResourceFilter(e.target.value)}>
              <option value="all">All Resources</option>
              <option value="Project">Projects</option>
              <option value="Database">Databases</option>
              <option value="API Key">API Keys</option>
              <option value="Billing">Billing</option>
            </Select>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPolicies.map((policy) => (
          <Card key={policy.id} className="p-6">
            <div className="space-y-4">
              {/* Policy Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold">{policy.name}</h3>
                    <Badge variant={policy.status === "Active" ? "default" : "secondary"}>{policy.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{policy.description}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Link href={`/iam/policies/${policy.id}`}>
                    <Button variant="ghost" size="sm">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </Button>
                </div>
              </div>

              {/* Resource Info */}
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Badge variant={getResourceColor(policy.resourceType)}>{policy.resourceType}</Badge>
                  <span className="text-muted-foreground">•</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{policy.resourceId}</code>
                </div>
              </div>

              {/* Access Rules Summary */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Access Rules ({policy.rules.length})</p>
                <div className="space-y-1">
                  {policy.rules.slice(0, 3).map((rule, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {rule.type}
                        </Badge>
                        <span className="font-medium">{rule.principal}</span>
                      </div>
                      <div className="flex space-x-1">
                        {rule.permissions.map((permission, pIndex) => (
                          <Badge key={pIndex} variant="secondary" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                  {policy.rules.length > 3 && (
                    <p className="text-xs text-muted-foreground">+{policy.rules.length - 3} more rules</p>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="text-xs text-muted-foreground pt-2 border-t">
                <div className="flex justify-between">
                  <span>Created: {new Date(policy.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(policy.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
    </DashboardLayout>
  )
}
