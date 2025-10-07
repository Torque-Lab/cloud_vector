"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function AccessControlPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [resourceFilter, setResourceFilter] = useState("all")

  // Mock data for resource access control
  const resources = [
    {
      id: "1",
      name: "Project Alpha",
      type: "Project",
      path: "/projects/project-alpha",
      accessLevel: "Restricted",
      totalUsers: 8,
      directAccess: [
        { user: "john@example.com", permissions: ["admin"], source: "direct" },
        { user: "jane@example.com", permissions: ["write"], source: "direct" },
      ],
      roleAccess: [
        { role: "Developer", permissions: ["read"], userCount: 5 },
        { role: "Admin", permissions: ["admin"], userCount: 2 },
      ],
      policies: ["Project Alpha Access"],
    },
    {
      id: "2",
      name: "Production Database",
      type: "Database",
      path: "/databases/prod-main",
      accessLevel: "Highly Restricted",
      totalUsers: 3,
      directAccess: [{ user: "admin@example.com", permissions: ["admin"], source: "direct" }],
      roleAccess: [
        { role: "Admin", permissions: ["admin"], userCount: 2 },
        { role: "Senior Developer", permissions: ["read"], userCount: 1 },
      ],
      policies: ["Production Databases Policy"],
    },
    {
      id: "3",
      name: "Development API Keys",
      type: "API Key",
      path: "/api-keys/dev-*",
      accessLevel: "Open",
      totalUsers: 12,
      directAccess: [],
      roleAccess: [
        { role: "Developer", permissions: ["read", "write"], userCount: 8 },
        { role: "Admin", permissions: ["admin"], userCount: 2 },
        { role: "Viewer", permissions: ["read"], userCount: 2 },
      ],
      policies: ["API Keys Management"],
    },
  ]

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.path.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesResource = resourceFilter === "all" || resource.type === resourceFilter
    return matchesSearch && matchesResource
  })

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case "Highly Restricted":
        return "destructive"
      case "Restricted":
        return "secondary"
      case "Open":
        return "default"
      default:
        return "outline"
    }
  }

  return (
    <DashboardLayout>

    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Access Control Overview</h1>
          <p className="text-muted-foreground">Monitor and manage access to your resources</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/iam/policies">
            <Button variant="outline">Manage Policies</Button>
          </Link>
          <Link href="/iam/access-control/audit">
            <Button>Access Audit</Button>
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Protected Resources</p>
              <p className="text-2xl font-bold">{resources.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <svg
                className="h-4 w-4 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Restricted Access</p>
              <p className="text-2xl font-bold">
                {resources.filter((r) => r.accessLevel.includes("Restricted")).length}
              </p>
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Access Grants</p>
              <p className="text-2xl font-bold">{resources.reduce((sum, r) => sum + r.totalUsers, 0)}</p>
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Policies</p>
              <p className="text-2xl font-bold">{new Set(resources.flatMap((r) => r.policies)).size}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search resources by name or path..."
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
            </Select>
          </div>
        </div>
      </Card>

      {/* Resources List */}
      <div className="space-y-4">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="p-6">
            <div className="space-y-4">
              {/* Resource Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold">{resource.name}</h3>
                    <Badge variant="outline">{resource.type}</Badge>
                    <Badge variant={getAccessLevelColor(resource.accessLevel)}>{resource.accessLevel}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{resource.path}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{resource.totalUsers} users</span>
                  <Link href={`/iam/access-control/${resource.id}`}>
                    <Button variant="outline" size="sm">
                      Manage Access
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Direct Access */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Direct User Access</h4>
                  {resource.directAccess.length > 0 ? (
                    <div className="space-y-1">
                      {resource.directAccess.map((access, index) => (
                        <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                          <span>{access.user}</span>
                          <div className="flex space-x-1">
                            {access.permissions.map((permission, pIndex) => (
                              <Badge key={pIndex} variant="secondary" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No direct user access</p>
                  )}
                </div>

                {/* Role-Based Access */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Role-Based Access</h4>
                  <div className="space-y-1">
                    {resource.roleAccess.map((access, index) => (
                      <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                        <div className="flex items-center space-x-2">
                          <span>{access.role}</span>
                          <span className="text-muted-foreground">({access.userCount} users)</span>
                        </div>
                        <div className="flex space-x-1">
                          {access.permissions.map((permission, pIndex) => (
                            <Badge key={pIndex} variant="secondary" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Applied Policies */}
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Applied Policies:</span>
                  <div className="flex space-x-1">
                    {resource.policies.map((policy, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {policy}
                      </Badge>
                    ))}
                  </div>
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
