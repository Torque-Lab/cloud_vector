"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function RolesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data for roles
  const roles = [
    {
      id: "1",
      name: "Admin",
      description: "Full access to all resources and settings",
      userCount: 3,
      permissions: ["projects:*", "databases:*", "users:*", "billing:*", "api-keys:*"],
      isSystem: true,
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      name: "Developer",
      description: "Can create and manage databases and API keys",
      userCount: 8,
      permissions: ["projects:read", "databases:*", "api-keys:*"],
      isSystem: true,
      createdAt: "2024-01-01",
    },
    {
      id: "3",
      name: "Viewer",
      description: "Read-only access to resources",
      userCount: 12,
      permissions: ["projects:read", "databases:read", "api-keys:read"],
      isSystem: true,
      createdAt: "2024-01-01",
    },
    {
      id: "4",
      name: "Project Manager",
      description: "Can manage specific projects and their resources",
      userCount: 5,
      permissions: ["projects:write", "databases:read", "users:read"],
      isSystem: false,
      createdAt: "2024-01-10",
    },
  ]

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getPermissionColor = (permission: string) => {
    if (permission.includes("*")) return "default"
    if (permission.includes("write")) return "secondary"
    return "outline"
  }

  return (
    <DashboardLayout>

   
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-muted-foreground">Manage roles and their associated permissions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/iam/roles/create">
            <Button>Create Role</Button>
          </Link>
          <Link href="/iam/permissions">
            <Button variant="outline">Manage Permissions</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <p className="text-sm font-medium text-muted-foreground">Total Roles</p>
              <p className="text-2xl font-bold">{roles.length}</p>
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">System Roles</p>
              <p className="text-2xl font-bold">{roles.filter((r) => r.isSystem).length}</p>
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Users Assigned</p>
              <p className="text-2xl font-bold">{roles.reduce((sum, role) => sum + role.userCount, 0)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <Input
          placeholder="Search roles by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </Card>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRoles.map((role) => (
          <Card key={role.id} className="p-6">
            <div className="space-y-4">
              {/* Role Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold">{role.name}</h3>
                    {role.isSystem && (
                      <Badge variant="outline" className="text-xs">
                        System
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Link href={`/iam/roles/${role.id}`}>
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
                  {!role.isSystem && (
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
                  )}
                </div>
              </div>

              {/* User Count */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                <span>{role.userCount} users assigned</span>
              </div>

              {/* Permissions */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Permissions</p>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 4).map((permission, index) => (
                    <Badge key={index} variant={getPermissionColor(permission)} className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                  {role.permissions.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{role.permissions.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Created Date */}
              <div className="text-xs text-muted-foreground pt-2 border-t">
                Created on {new Date(role.createdAt).toLocaleDateString()}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
    </DashboardLayout>
  )
}
