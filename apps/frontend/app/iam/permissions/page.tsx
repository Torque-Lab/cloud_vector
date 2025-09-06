"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PermissionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // All available permissions organized by resource
  const permissions = [
    {
      id: "1",
      key: "projects:read",
      name: "View Projects",
      description: "Can view project details, metrics, and configurations",
      category: "Projects",
      riskLevel: "low",
      usedInRoles: ["Admin", "Developer", "Viewer", "Project Manager"],
    },
    {
      id: "2",
      key: "projects:write",
      name: "Manage Projects",
      description: "Can create, edit, and configure projects",
      category: "Projects",
      riskLevel: "medium",
      usedInRoles: ["Admin", "Project Manager"],
    },
    {
      id: "3",
      key: "projects:delete",
      name: "Delete Projects",
      description: "Can delete projects and all associated data",
      category: "Projects",
      riskLevel: "high",
      usedInRoles: ["Admin"],
    },
    {
      id: "4",
      key: "databases:read",
      name: "View Databases",
      description: "Can view database details, schemas, and metrics",
      category: "Databases",
      riskLevel: "low",
      usedInRoles: ["Admin", "Developer", "Viewer", "Project Manager"],
    },
    {
      id: "5",
      key: "databases:write",
      name: "Manage Databases",
      description: "Can create, edit, and configure databases",
      category: "Databases",
      riskLevel: "medium",
      usedInRoles: ["Admin", "Developer"],
    },
    {
      id: "6",
      key: "databases:delete",
      name: "Delete Databases",
      description: "Can delete databases and their data",
      category: "Databases",
      riskLevel: "high",
      usedInRoles: ["Admin"],
    },
    {
      id: "7",
      key: "users:read",
      name: "View Users",
      description: "Can view user details, roles, and activity",
      category: "Users & IAM",
      riskLevel: "low",
      usedInRoles: ["Admin", "Project Manager"],
    },
    {
      id: "8",
      key: "users:write",
      name: "Manage Users",
      description: "Can invite, edit, and manage user accounts",
      category: "Users & IAM",
      riskLevel: "high",
      usedInRoles: ["Admin"],
    },
    {
      id: "9",
      key: "billing:read",
      name: "View Billing",
      description: "Can view usage, costs, and billing information",
      category: "Billing",
      riskLevel: "medium",
      usedInRoles: ["Admin"],
    },
    {
      id: "10",
      key: "billing:write",
      name: "Manage Billing",
      description: "Can manage payment methods, plans, and billing settings",
      category: "Billing",
      riskLevel: "high",
      usedInRoles: ["Admin"],
    },
  ]

  const categories = ["all", ...Array.from(new Set(permissions.map((p) => p.category)))]

  const filteredPermissions = permissions.filter((permission) => {
    const matchesSearch =
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.key.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || permission.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
          <p className="text-muted-foreground">Manage all available permissions and their usage</p>
        </div>
        <Link href="/iam/roles">
          <Button variant="outline">Back to Roles</Button>
        </Link>
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Permissions</p>
              <p className="text-2xl font-bold">{permissions.length}</p>
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">High Risk</p>
              <p className="text-2xl font-bold">{permissions.filter((p) => p.riskLevel === "high").length}</p>
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Medium Risk</p>
              <p className="text-2xl font-bold">{permissions.filter((p) => p.riskLevel === "medium").length}</p>
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
              <p className="text-sm font-medium text-muted-foreground">Low Risk</p>
              <p className="text-2xl font-bold">{permissions.filter((p) => p.riskLevel === "low").length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search permissions by name, description, or key..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Permissions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Permission</th>
                <th className="text-left p-4 font-medium">Category</th>
                <th className="text-left p-4 font-medium">Risk Level</th>
                <th className="text-left p-4 font-medium">Used in Roles</th>
                <th className="text-left p-4 font-medium">Key</th>
              </tr>
            </thead>
            <tbody>
              {filteredPermissions.map((permission) => (
                <tr key={permission.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{permission.name}</p>
                      <p className="text-sm text-muted-foreground">{permission.description}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">{permission.category}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={getRiskColor(permission.riskLevel)}>
                      {permission.riskLevel.charAt(0).toUpperCase() + permission.riskLevel.slice(1)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {permission.usedInRoles.slice(0, 2).map((role, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                      {permission.usedInRoles.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{permission.usedInRoles.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <code className="text-xs bg-muted px-2 py-1 rounded">{permission.key}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
